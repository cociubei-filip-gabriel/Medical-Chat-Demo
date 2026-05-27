using ChatMEDICAL.Api.Data;
using ChatMEDICAL.Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using OpenTelemetry.Logs;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

var builder = WebApplication.CreateBuilder(args);

// Configure OpenTelemetry
var serviceName = builder.Configuration["OTEL_SERVICE_NAME"] ?? "chatmedical-api";
builder.Services.AddOpenTelemetry()
    .ConfigureResource(resource => resource.AddService(serviceName))
    .WithTracing(tracing =>
    {
        tracing
            .AddAspNetCoreInstrumentation(options =>
            {
                options.Filter = httpContext =>
                {
                    var path = httpContext.Request.Path.Value;
                    return path != null && !path.Contains("/swagger", StringComparison.OrdinalIgnoreCase) && !path.Contains("/health", StringComparison.OrdinalIgnoreCase);
                };
            })
            .AddHttpClientInstrumentation()
            .AddOtlpExporter();
    })
    .WithMetrics(metrics =>
    {
        metrics
            .AddAspNetCoreInstrumentation()
            .AddRuntimeInstrumentation()
            .AddOtlpExporter();
    });

builder.Logging.ClearProviders();

builder.Logging.AddOpenTelemetry(options =>
{
    options.SetResourceBuilder(
        ResourceBuilder.CreateDefault()
            .AddService(serviceName));

    options.IncludeFormattedMessage = true;
    options.IncludeScopes = true;
    options.ParseStateValues = true;

    options.AddOtlpExporter(otlpOptions =>
    {
        var endpoint = builder.Configuration["OTEL_EXPORTER_OTLP_ENDPOINT"] ?? "http://localhost:4317";
        otlpOptions.Endpoint = new Uri(endpoint);
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("DevelopmentClient", policy =>
        policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<MedicalDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
        ?? "Data Source=medical_chat.db";

    options.UseSqlite(connectionString);
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<MedicalDbContext>();
    await DatabaseSeeder.SeedAsync(db);
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("DevelopmentClient");

app.MapGet("/health", () => Results.Ok(new HealthResponse("ok", DateTimeOffset.UtcNow)))
    .WithName("Health")
    .WithOpenApi();

var api = app.MapGroup("/api");

// ===================== AUTH =====================

api.MapPost("/auth/register-patient", async (RegisterPatientRequest request, MedicalDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(request.FullName) ||
        string.IsNullOrWhiteSpace(request.Cnp) ||
        string.IsNullOrWhiteSpace(request.Email) ||
        string.IsNullOrWhiteSpace(request.Password) ||
        string.IsNullOrWhiteSpace(request.PhoneNumber))
    {
        return Results.BadRequest(new ApiError("Full name, CNP, email, phone number and password are required."));
    }

    var email = request.Email.Trim().ToLowerInvariant();
    var cnp = request.Cnp.Trim();

    if (!IsPatientEmail(email))
    {
        return Results.BadRequest(new ApiError("Patient email must have the format nume.prenume@pacient."));
    }

    if (await db.Patients.AnyAsync(patient => patient.Email == email) ||
        await db.Doctors.AnyAsync(doctor => doctor.Email == email) ||
        await db.Admins.AnyAsync(admin => admin.Email == email))
    {
        return Results.BadRequest(new ApiError("This email is already used."));
    }

    if (await db.Patients.AnyAsync(patient => patient.Cnp == cnp))
    {
        return Results.BadRequest(new ApiError("This CNP is already used."));
    }

    var patient = new Patient
    {
        Id = Guid.NewGuid(),
        FullName = request.FullName.Trim(),
        Cnp = cnp,
        Email = email,
        Password = request.Password,
        PhoneNumber = request.PhoneNumber.Trim(),
        CreatedAt = DateTimeOffset.UtcNow
    };

    db.Patients.Add(patient);
    await db.SaveChangesAsync();

    return Results.Created($"/api/patients/{patient.Id}", ToPatientResponse(patient));
})
.WithName("RegisterPatient")
.WithOpenApi();

api.MapPost("/auth/login", async (LoginRequest request, MedicalDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
    {
        return Results.BadRequest(new ApiError("Email and password are required."));
    }

    var email = request.Email.Trim().ToLowerInvariant();

    var patient = await db.Patients.FirstOrDefaultAsync(x => x.Email == email && x.Password == request.Password);
    if (patient is not null)
    {
        return Results.Ok(new LoginResponse(patient.Id, patient.Email, patient.FullName, "patient"));
    }

    var doctor = await db.Doctors.FirstOrDefaultAsync(x => x.Email == email && x.Password == request.Password);
    if (doctor is not null)
    {
        return Results.Ok(new LoginResponse(doctor.Id, doctor.Email, doctor.FullName, "doctor"));
    }

    var admin = await db.Admins.FirstOrDefaultAsync(x => x.Email == email && x.Password == request.Password);
    if (admin is not null)
    {
        return Results.Ok(new LoginResponse(admin.Id, admin.Email, admin.FullName, "admin"));
    }

    return Results.Unauthorized();
})
.WithName("Login")
.WithOpenApi();

// ===================== PATIENTS =====================

api.MapGet("/patients", async (MedicalDbContext db) =>
{
    var patients = await db.Patients
        .OrderBy(patient => patient.FullName)
        .ToListAsync();

    return Results.Ok(patients.Select(ToPatientResponse).ToList());
})
.WithName("GetPatients")
.WithOpenApi();

api.MapGet("/patients/{id:guid}", async (Guid id, MedicalDbContext db) =>
{
    var patient = await db.Patients.FindAsync(id);
    return patient is null ? Results.NotFound() : Results.Ok(ToPatientResponse(patient));
})
.WithName("GetPatientById")
.WithOpenApi();

// ===================== DOCTORS =====================

api.MapGet("/specialties", async (MedicalDbContext db) =>
{
    var specialties = await db.Doctors
        .Select(doctor => doctor.Specialty)
        .Distinct()
        .OrderBy(specialty => specialty)
        .ToListAsync();

    return Results.Ok(specialties);
})
.WithName("GetSpecialties")
.WithOpenApi();

api.MapGet("/doctors", async (string? specialty, MedicalDbContext db) =>
{
    var query = db.Doctors.AsQueryable();

    if (!string.IsNullOrWhiteSpace(specialty))
    {
        var selectedSpecialty = specialty.Trim();
        query = query.Where(doctor => doctor.Specialty == selectedSpecialty);
    }

    var doctors = await query
        .OrderBy(doctor => doctor.Specialty)
        .ThenBy(doctor => doctor.FullName)
        .ToListAsync();

    return Results.Ok(doctors.Select(ToDoctorResponse).ToList());
})
.WithName("GetDoctors")
.WithOpenApi();

api.MapPost("/doctors", async (CreateDoctorRequest request, MedicalDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(request.FullName) ||
        string.IsNullOrWhiteSpace(request.Email) ||
        string.IsNullOrWhiteSpace(request.Password) ||
        string.IsNullOrWhiteSpace(request.Specialty))
    {
        return Results.BadRequest(new ApiError("Full name, email, password and specialty are required."));
    }

    var email = request.Email.Trim().ToLowerInvariant();

    if (!IsDoctorEmail(email))
    {
        return Results.BadRequest(new ApiError("Doctor email must have the format nume.prenume@doctor."));
    }

    if (await db.Doctors.AnyAsync(doctor => doctor.Email == email) ||
        await db.Patients.AnyAsync(patient => patient.Email == email) ||
        await db.Admins.AnyAsync(admin => admin.Email == email))
    {
        return Results.BadRequest(new ApiError("This email is already used."));
    }

    var doctor = new Doctor
    {
        Id = Guid.NewGuid(),
        FullName = request.FullName.Trim(),
        Email = email,
        Password = request.Password,
        Specialty = request.Specialty.Trim(),
        PhoneNumber = request.PhoneNumber?.Trim() ?? string.Empty,
        CreatedAt = DateTimeOffset.UtcNow
    };

    db.Doctors.Add(doctor);
    await db.SaveChangesAsync();

    return Results.Created($"/api/doctors/{doctor.Id}", ToDoctorResponse(doctor));
})
.WithName("CreateDoctor")
.WithOpenApi();

// ===================== ADMINS =====================

api.MapGet("/admins", async (MedicalDbContext db) =>
{
    var admins = await db.Admins
        .OrderBy(admin => admin.FullName)
        .ToListAsync();

    return Results.Ok(admins.Select(ToAdminResponse).ToList());
})
.WithName("GetAdmins")
.WithOpenApi();

api.MapPost("/admins", async (CreateAdminRequest request, MedicalDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(request.FullName) ||
        string.IsNullOrWhiteSpace(request.Email) ||
        string.IsNullOrWhiteSpace(request.Password))
    {
        return Results.BadRequest(new ApiError("Full name, email and password are required."));
    }

    var email = request.Email.Trim().ToLowerInvariant();

    if (!IsAdminEmail(email))
    {
        return Results.BadRequest(new ApiError("Admin email must be admin@admin."));
    }

    if (await db.Admins.AnyAsync(admin => admin.Email == email) ||
        await db.Patients.AnyAsync(patient => patient.Email == email) ||
        await db.Doctors.AnyAsync(doctor => doctor.Email == email))
    {
        return Results.BadRequest(new ApiError("This email is already used."));
    }

    var admin = new Admin
    {
        Id = Guid.NewGuid(),
        FullName = request.FullName.Trim(),
        Email = email,
        Password = request.Password,
        CreatedAt = DateTimeOffset.UtcNow
    };

    db.Admins.Add(admin);
    await db.SaveChangesAsync();

    return Results.Created($"/api/admins/{admin.Id}", ToAdminResponse(admin));
})
.WithName("CreateAdmin")
.WithOpenApi();

// ===================== APPOINTMENTS =====================

api.MapPost("/appointments", async (CreateAppointmentRequest request, MedicalDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(request.PatientEmail) ||
        string.IsNullOrWhiteSpace(request.DoctorName) ||
        string.IsNullOrWhiteSpace(request.Specialty))
    {
        return Results.BadRequest(new ApiError("Patient email, doctor name and specialty are required."));
    }

    if (request.Date < DateOnly.FromDateTime(DateTime.Today))
    {
        return Results.BadRequest(new ApiError("Appointment date cannot be in the past."));
    }

    var patientEmail = request.PatientEmail.Trim().ToLowerInvariant();
    var patient = await db.Patients.FirstOrDefaultAsync(x => x.Email == patientEmail);

    if (patient is null)
    {
        return Results.BadRequest(new ApiError("Patient not found. The patient must register first."));
    }

    var doctorName = request.DoctorName.Trim();
    var specialty = request.Specialty.Trim();

    var doctor = await db.Doctors.FirstOrDefaultAsync(x => x.FullName == doctorName && x.Specialty == specialty);
    if (doctor is null)
    {
        return Results.BadRequest(new ApiError("Doctor not found."));
    }

    var appointment = new Appointment
    {
        Id = Guid.NewGuid(),
        PatientId = patient.Id,
        DoctorId = doctor.Id,
        Specialty = specialty,
        Date = request.Date,
        Time = request.Time ?? new TimeOnly(9, 0),
        Reason = request.Reason?.Trim() ?? string.Empty,
        Status = AppointmentStatus.Pending,
        CreatedAt = DateTimeOffset.UtcNow
    };

    db.Appointments.Add(appointment);
    await db.SaveChangesAsync();

    appointment.Patient = patient;
    appointment.Doctor = doctor;

    return Results.Created($"/api/appointments/{appointment.Id}", ToAppointmentResponse(appointment));
})
.WithName("CreateAppointment")
.WithOpenApi();

api.MapGet("/appointments", async (string? patientEmail, string? doctorEmail, string? status, MedicalDbContext db) =>
{
    var query = db.Appointments
        .Include(appointment => appointment.Patient)
        .Include(appointment => appointment.Doctor)
        .AsQueryable();

    if (!string.IsNullOrWhiteSpace(patientEmail))
    {
        var email = patientEmail.Trim().ToLowerInvariant();
        query = query.Where(appointment => appointment.Patient != null && appointment.Patient.Email == email);
    }

    if (!string.IsNullOrWhiteSpace(doctorEmail))
    {
        var email = doctorEmail.Trim().ToLowerInvariant();
        query = query.Where(appointment => appointment.Doctor != null && appointment.Doctor.Email == email);
    }

    if (!string.IsNullOrWhiteSpace(status))
    {
        var selectedStatus = status.Trim().ToLowerInvariant();
        query = query.Where(appointment => appointment.Status == selectedStatus);
    }

    var appointments = await query
        .OrderByDescending(appointment => appointment.Date)
        .ThenBy(appointment => appointment.Time)
        .ToListAsync();

    return Results.Ok(appointments.Select(ToAppointmentResponse).ToList());
})
.WithName("GetAppointments")
.WithOpenApi();

api.MapPut("/appointments/{id:guid}/confirm", async (Guid id, MedicalDbContext db) =>
{
    var appointment = await db.Appointments
        .Include(x => x.Patient)
        .Include(x => x.Doctor)
        .FirstOrDefaultAsync(x => x.Id == id);

    if (appointment is null)
    {
        return Results.NotFound(new ApiError("Appointment not found."));
    }

    appointment.Status = AppointmentStatus.Confirmed;
    appointment.ConfirmedAt = DateTimeOffset.UtcNow;
    appointment.CancelledAt = null;

    await db.SaveChangesAsync();

    return Results.Ok(ToAppointmentResponse(appointment));
})
.WithName("ConfirmAppointment")
.WithOpenApi();

api.MapPut("/appointments/{id:guid}/cancel", async (Guid id, MedicalDbContext db) =>
{
    var appointment = await db.Appointments
        .Include(x => x.Patient)
        .Include(x => x.Doctor)
        .FirstOrDefaultAsync(x => x.Id == id);

    if (appointment is null)
    {
        return Results.NotFound(new ApiError("Appointment not found."));
    }

    appointment.Status = AppointmentStatus.Cancelled;
    appointment.CancelledAt = DateTimeOffset.UtcNow;

    await db.SaveChangesAsync();

    return Results.Ok(ToAppointmentResponse(appointment));
})
.WithName("CancelAppointment")
.WithOpenApi();

// ===================== ACCESS REQUESTS =====================

api.MapPost("/access-requests", async (CreateAccessRequest request, MedicalDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(request.FullName) ||
        string.IsNullOrWhiteSpace(request.Email) ||
        string.IsNullOrWhiteSpace(request.Reason))
    {
        return Results.BadRequest(new ApiError("Full name, email and reason are required."));
    }

    var accessRequest = new AccessRequest
    {
        Id = Guid.NewGuid(),
        FullName = request.FullName.Trim(),
        Email = request.Email.Trim().ToLowerInvariant(),
        Reason = request.Reason.Trim(),
        Status = "pending",
        CreatedAt = DateTimeOffset.UtcNow
    };

    db.AccessRequests.Add(accessRequest);
    await db.SaveChangesAsync();

    return Results.Created($"/api/access-requests/{accessRequest.Id}", accessRequest);
})
.WithName("CreateAccessRequest")
.WithOpenApi();

api.MapGet("/access-requests", async (MedicalDbContext db) =>
{
    var requests = await db.AccessRequests
        .OrderByDescending(request => request.CreatedAt)
        .ToListAsync();

    return Results.Ok(requests);
})
.WithName("GetAccessRequests")
.WithOpenApi();

// ===================== CHAT =====================

api.MapGet("/chats/{doctorName}/messages", async (string doctorName, MedicalDbContext db) =>
{
    var messages = await db.ChatMessages
        .Include(message => message.Doctor)
        .Where(message => message.Doctor != null && message.Doctor.FullName == doctorName)
        .OrderBy(message => message.SentAt)
        .Select(message => new ChatMessageResponse(
            message.Id,
            message.Doctor!.FullName,
            message.Sender,
            message.Text,
            message.SentAt))
        .ToListAsync();

    return Results.Ok(messages);
})
.WithName("GetChatMessages")
.WithOpenApi();

api.MapPost("/chats/{doctorName}/messages", async (string doctorName, CreateChatMessageRequest request, MedicalDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(request.Sender) || string.IsNullOrWhiteSpace(request.Text))
    {
        return Results.BadRequest(new ApiError("Sender and message text are required."));
    }

    var doctor = await db.Doctors.FirstOrDefaultAsync(x => x.FullName == doctorName);
    if (doctor is null)
    {
        return Results.BadRequest(new ApiError("Doctor not found."));
    }

    var message = new ChatMessage
    {
        Id = Guid.NewGuid(),
        DoctorId = doctor.Id,
        Sender = request.Sender.Trim(),
        Text = request.Text.Trim(),
        SentAt = DateTimeOffset.UtcNow
    };

    db.ChatMessages.Add(message);
    await db.SaveChangesAsync();

    return Results.Created(
        $"/api/chats/{Uri.EscapeDataString(doctorName)}/messages/{message.Id}",
        new ChatMessageResponse(message.Id, doctor.FullName, message.Sender, message.Text, message.SentAt));
})
.WithName("CreateChatMessage")
.WithOpenApi();

app.Run();

static PatientResponse ToPatientResponse(Patient patient) =>
    new(patient.Id, patient.FullName, patient.Cnp, patient.Email, patient.PhoneNumber, patient.CreatedAt);

static DoctorResponse ToDoctorResponse(Doctor doctor) =>
    new(doctor.Id, doctor.FullName, doctor.Email, doctor.Specialty, doctor.PhoneNumber);

static AdminResponse ToAdminResponse(Admin admin) =>
    new(admin.Id, admin.FullName, admin.Email, admin.CreatedAt);

static AppointmentResponse ToAppointmentResponse(Appointment appointment) =>
    new(
        appointment.Id,
        appointment.Patient?.Email ?? string.Empty,
        appointment.Patient?.FullName ?? string.Empty,
        appointment.Doctor?.FullName ?? string.Empty,
        appointment.Doctor?.Email ?? string.Empty,
        appointment.Specialty,
        appointment.Date,
        appointment.Time,
        appointment.Reason,
        appointment.Status,
        appointment.CreatedAt,
        appointment.ConfirmedAt,
        appointment.CancelledAt);


static bool IsPatientEmail(string email) => IsNameBasedEmail(email, "pacient");

static bool IsDoctorEmail(string email) => IsNameBasedEmail(email, "doctor");

static bool IsAdminEmail(string email) => string.Equals(email, "admin@admin", StringComparison.OrdinalIgnoreCase);

static bool IsNameBasedEmail(string email, string domain)
{
    return Regex.IsMatch(
        email,
        @"^[a-z0-9]+(?:[.-][a-z0-9]+)*\.[a-z0-9]+(?:[.-][a-z0-9]+)*@" + Regex.Escape(domain) + @"$",
        RegexOptions.IgnoreCase | RegexOptions.CultureInvariant);
}

record HealthResponse(string Status, DateTimeOffset CheckedAt);
record ApiError(string Message);

record LoginRequest(string Email, string Password);
record LoginResponse(Guid UserId, string Email, string DisplayName, string Role);

record RegisterPatientRequest(string FullName, string Cnp, string Email, string PhoneNumber, string Password);
record PatientResponse(Guid Id, string FullName, string Cnp, string Email, string PhoneNumber, DateTimeOffset CreatedAt);

record CreateDoctorRequest(string FullName, string Email, string Password, string Specialty, string? PhoneNumber);
record DoctorResponse(Guid Id, string Name, string Email, string Specialty, string PhoneNumber);

record CreateAdminRequest(string FullName, string Email, string Password);
record AdminResponse(Guid Id, string FullName, string Email, DateTimeOffset CreatedAt);

record CreateAppointmentRequest(
    string PatientEmail,
    string DoctorName,
    string Specialty,
    DateOnly Date,
    TimeOnly? Time,
    string? Reason);

record AppointmentResponse(
    Guid Id,
    string PatientEmail,
    string PatientName,
    string DoctorName,
    string DoctorEmail,
    string Specialty,
    DateOnly Date,
    TimeOnly Time,
    string Reason,
    string Status,
    DateTimeOffset CreatedAt,
    DateTimeOffset? ConfirmedAt,
    DateTimeOffset? CancelledAt);

record CreateAccessRequest(string FullName, string Email, string Reason);

record CreateChatMessageRequest(string Sender, string Text);
record ChatMessageResponse(Guid Id, string DoctorName, string Sender, string Text, DateTimeOffset SentAt);
