using System.Collections.Concurrent;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("DevelopmentClient", policy =>
        policy.AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<MedicalDemoStore>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("DevelopmentClient");
}

app.MapGet("/health", () => Results.Ok(new HealthResponse("ok", DateTimeOffset.UtcNow)))
    .WithName("Health")
    .WithOpenApi();

var api = app.MapGroup("/api");

api.MapPost("/auth/login", (LoginRequest request) =>
{
    if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
    {
        return Results.BadRequest(new ApiError("Email and password are required."));
    }

    var role = request.Email.Contains("doctor", StringComparison.OrdinalIgnoreCase)
        ? "doctor"
        : "patient";

    var displayName = role == "doctor" ? "Demo Doctor" : "Demo Patient";

    return Results.Ok(new LoginResponse(
        Guid.NewGuid(),
        request.Email.Trim(),
        displayName,
        role));
})
.WithName("Login")
.WithOpenApi();

api.MapPost("/access-requests", (AccessRequest request, MedicalDemoStore store) =>
{
    if (string.IsNullOrWhiteSpace(request.FullName) ||
        string.IsNullOrWhiteSpace(request.Email) ||
        string.IsNullOrWhiteSpace(request.Reason))
    {
        return Results.BadRequest(new ApiError("Full name, email and reason are required."));
    }

    var createdRequest = request with
    {
        Id = Guid.NewGuid(),
        Status = "pending",
        CreatedAt = DateTimeOffset.UtcNow
    };

    store.AccessRequests[createdRequest.Id] = createdRequest;
    return Results.Created($"/api/access-requests/{createdRequest.Id}", createdRequest);
})
.WithName("CreateAccessRequest")
.WithOpenApi();

api.MapGet("/specialties", (MedicalDemoStore store) =>
    Results.Ok(store.DoctorsBySpecialty.Keys.OrderBy(specialty => specialty)))
    .WithName("GetSpecialties")
    .WithOpenApi();

api.MapGet("/doctors", (string? specialty, MedicalDemoStore store) =>
{
    var doctors = store.DoctorsBySpecialty
        .Where(group => string.IsNullOrWhiteSpace(specialty) ||
            group.Key.Equals(specialty, StringComparison.OrdinalIgnoreCase))
        .SelectMany(group => group.Value.Select(name => new DoctorResponse(name, group.Key)))
        .OrderBy(doctor => doctor.Specialty)
        .ThenBy(doctor => doctor.Name);

    return Results.Ok(doctors);
})
.WithName("GetDoctors")
.WithOpenApi();

api.MapPost("/appointments", (CreateAppointmentRequest request, MedicalDemoStore store) =>
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

    var appointment = new AppointmentResponse(
        Guid.NewGuid(),
        request.PatientEmail.Trim(),
        request.DoctorName.Trim(),
        request.Specialty.Trim(),
        request.Date,
        "confirmed",
        DateTimeOffset.UtcNow);

    store.Appointments[appointment.Id] = appointment;
    return Results.Created($"/api/appointments/{appointment.Id}", appointment);
})
.WithName("CreateAppointment")
.WithOpenApi();

api.MapGet("/appointments", (string? patientEmail, MedicalDemoStore store) =>
{
    var appointments = store.Appointments.Values
        .Where(appointment => string.IsNullOrWhiteSpace(patientEmail) ||
            appointment.PatientEmail.Equals(patientEmail, StringComparison.OrdinalIgnoreCase))
        .OrderByDescending(appointment => appointment.Date);

    return Results.Ok(appointments);
})
.WithName("GetAppointments")
.WithOpenApi();

api.MapGet("/chats/{doctorName}/messages", (string doctorName, MedicalDemoStore store) =>
{
    var messages = store.ChatMessages.GetValueOrDefault(doctorName, []);
    return Results.Ok(messages.OrderBy(message => message.SentAt));
})
.WithName("GetChatMessages")
.WithOpenApi();

api.MapPost("/chats/{doctorName}/messages", (string doctorName, CreateChatMessageRequest request, MedicalDemoStore store) =>
{
    if (string.IsNullOrWhiteSpace(request.Sender) || string.IsNullOrWhiteSpace(request.Text))
    {
        return Results.BadRequest(new ApiError("Sender and message text are required."));
    }

    var message = new ChatMessageResponse(
        Guid.NewGuid(),
        doctorName,
        request.Sender.Trim(),
        request.Text.Trim(),
        DateTimeOffset.UtcNow);

    var messages = store.ChatMessages.GetOrAdd(doctorName, _ => []);
    messages.Add(message);

    return Results.Created($"/api/chats/{Uri.EscapeDataString(doctorName)}/messages/{message.Id}", message);
})
.WithName("CreateChatMessage")
.WithOpenApi();

app.Run();

sealed class MedicalDemoStore
{
    public IReadOnlyDictionary<string, string[]> DoctorsBySpecialty { get; } =
        new Dictionary<string, string[]>(StringComparer.OrdinalIgnoreCase)
        {
            ["Cardiology"] = ["Dr. Andrei Popescu", "Dr. Maria Ionescu", "Dr. Radu Georgescu"],
            ["Dermatology"] = ["Dr. Elena Marinescu", "Dr. Sorin Dumitrescu", "Dr. Bianca Pavel"],
            ["Orthopedics"] = ["Dr. Cristian Toma", "Dr. Diana Stoica", "Dr. Vlad Rusu"],
            ["Neurology"] = ["Dr. Ana Preda", "Dr. Mihai Enache", "Dr. Roxana Ilie"],
            ["Pediatrics"] = ["Dr. Laura Matei", "Dr. George Pavel", "Dr. Simona Dobre"],
            ["Gynecology"] = ["Dr. Cristina Neagu", "Dr. Ioana Petrescu", "Dr. Daniel Muresan"],
            ["Ophthalmology"] = ["Dr. Irina Stan", "Dr. Paul Tudor", "Dr. Silvia Matei"],
            ["ENT"] = ["Dr. Catalin Pop", "Dr. Roxana Filip", "Dr. Adrian Luca"],
            ["Urology"] = ["Dr. Mihnea Roman", "Dr. Oana Iliescu", "Dr. Victor Stan"],
            ["Gastroenterology"] = ["Dr. Claudia Pavel", "Dr. Tudor Enescu", "Dr. Silvia Barbu"],
            ["Endocrinology"] = ["Dr. Monica Sandu", "Dr. Raluca Dima", "Dr. Adrian Nistor"],
            ["Pulmonology"] = ["Dr. George Muntean", "Dr. Larisa Popa", "Dr. Mihai Dobre"],
            ["Psychiatry"] = ["Dr. Sorina Matei", "Dr. Alin Georgescu", "Dr. Bianca Rusu"],
            ["Oncology"] = ["Dr. Andrada Neagu", "Dr. Paul Marinescu", "Dr. Ruxandra Pop"],
            ["General Surgery"] = ["Dr. Cristian Pavel", "Dr. Mihnea Ionescu", "Dr. Vlad Dumitru"],
            ["Plastic Surgery"] = ["Dr. Ioana Luca", "Dr. Robert Stan", "Dr. Diana Popescu"],
            ["Rheumatology"] = ["Dr. Elena Tudor", "Dr. Sorin Pavel", "Dr. Carmen Matei"],
            ["Nephrology"] = ["Dr. Monica Radu", "Dr. George Ilie", "Dr. Silvia Dobre"],
            ["Infectious Diseases"] = ["Dr. Andreea Pop", "Dr. Vlad Marin", "Dr. Roxana Toma"],
            ["Diabetology"] = ["Dr. Ana Ionescu", "Dr. Mihai Luca", "Dr. Bianca Stoica"],
            ["Family Medicine"] = ["Dr. Elena Popa", "Dr. Radu Pavel", "Dr. Cristina Dinu"]
        };

    public ConcurrentDictionary<Guid, AccessRequest> AccessRequests { get; } = new();

    public ConcurrentDictionary<Guid, AppointmentResponse> Appointments { get; } = new();

    public ConcurrentDictionary<string, List<ChatMessageResponse>> ChatMessages { get; } =
        new(StringComparer.OrdinalIgnoreCase);
}

record HealthResponse(string Status, DateTimeOffset CheckedAt);

record ApiError(string Message);

record LoginRequest(string Email, string Password);

record LoginResponse(Guid UserId, string Email, string DisplayName, string Role);

record AccessRequest(
    Guid Id,
    string FullName,
    string Email,
    string Reason,
    string Status,
    DateTimeOffset CreatedAt);

record DoctorResponse(string Name, string Specialty);

record CreateAppointmentRequest(string PatientEmail, string DoctorName, string Specialty, DateOnly Date);

record AppointmentResponse(
    Guid Id,
    string PatientEmail,
    string DoctorName,
    string Specialty,
    DateOnly Date,
    string Status,
    DateTimeOffset CreatedAt);

record CreateChatMessageRequest(string Sender, string Text);

record ChatMessageResponse(Guid Id, string DoctorName, string Sender, string Text, DateTimeOffset SentAt);
