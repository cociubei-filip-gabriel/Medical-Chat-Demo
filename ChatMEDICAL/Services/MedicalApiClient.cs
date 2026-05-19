using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ChatMEDICAL.Services;

public sealed class MedicalApiClient
{
    public static MedicalApiClient Shared { get; } = new();

    private readonly HttpClient _httpClient = new()
    {
        // Pentru rulare locala: porneste si proiectul ChatMEDICAL.Api.
        BaseAddress = new Uri("http://localhost:5221")
    };

    private MedicalApiClient()
    {
    }

    public async Task<LoginResponse?> LoginAsync(string email, string password)
    {
        var request = new LoginRequest(email, password);
        var response = await _httpClient.PostAsJsonAsync(
            "/api/auth/login",
            request,
            MedicalApiJsonContext.Default.LoginRequest);

        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync(MedicalApiJsonContext.Default.LoginResponse);
    }

    public async Task<PatientResponse?> RegisterPatientAsync(
        string fullName,
        string cnp,
        string email,
        string phoneNumber,
        string password)
    {
        var request = new RegisterPatientRequest(fullName, cnp, email, phoneNumber, password);
        var response = await _httpClient.PostAsJsonAsync(
            "/api/auth/register-patient",
            request,
            MedicalApiJsonContext.Default.RegisterPatientRequest);

        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync(MedicalApiJsonContext.Default.PatientResponse);
    }

    public async Task<IReadOnlyList<string>> GetSpecialtiesAsync()
    {
        return await _httpClient.GetFromJsonAsync(
            "/api/specialties",
            MedicalApiJsonContext.Default.StringArray) ?? [];
    }

    public async Task<IReadOnlyList<DoctorResponse>> GetDoctorsAsync(string specialty)
    {
        var url = $"/api/doctors?specialty={Uri.EscapeDataString(specialty)}";
        return await _httpClient.GetFromJsonAsync(
            url,
            MedicalApiJsonContext.Default.DoctorResponseArray) ?? [];
    }

    public async Task<AppointmentResponse?> CreateAppointmentAsync(
        string patientEmail,
        string doctorName,
        string specialty,
        DateOnly date,
        TimeOnly? time = null,
        string? reason = null)
    {
        var request = new CreateAppointmentRequest(patientEmail, doctorName, specialty, date, time, reason);
        var response = await _httpClient.PostAsJsonAsync(
            "/api/appointments",
            request,
            MedicalApiJsonContext.Default.CreateAppointmentRequest);

        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync(MedicalApiJsonContext.Default.AppointmentResponse);
    }

    public async Task<IReadOnlyList<AppointmentResponse>> GetAppointmentsAsync(
        string? patientEmail = null,
        string? doctorEmail = null,
        string? status = null)
    {
        var query = new List<string>();

        if (!string.IsNullOrWhiteSpace(patientEmail))
            query.Add($"patientEmail={Uri.EscapeDataString(patientEmail)}");

        if (!string.IsNullOrWhiteSpace(doctorEmail))
            query.Add($"doctorEmail={Uri.EscapeDataString(doctorEmail)}");

        if (!string.IsNullOrWhiteSpace(status))
            query.Add($"status={Uri.EscapeDataString(status)}");

        var url = "/api/appointments" + (query.Count > 0 ? "?" + string.Join("&", query) : string.Empty);

        return await _httpClient.GetFromJsonAsync(
            url,
            MedicalApiJsonContext.Default.AppointmentResponseArray) ?? [];
    }

    public async Task<AppointmentResponse?> ConfirmAppointmentAsync(Guid appointmentId)
    {
        var response = await _httpClient.PutAsync($"/api/appointments/{appointmentId}/confirm", null);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync(MedicalApiJsonContext.Default.AppointmentResponse);
    }

    public async Task<AppointmentResponse?> CancelAppointmentAsync(Guid appointmentId)
    {
        var response = await _httpClient.PutAsync($"/api/appointments/{appointmentId}/cancel", null);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync(MedicalApiJsonContext.Default.AppointmentResponse);
    }

    public async Task<ChatMessageResponse?> SendMessageAsync(string doctorName, string sender, string text)
    {
        var url = $"/api/chats/{Uri.EscapeDataString(doctorName)}/messages";
        var request = new CreateChatMessageRequest(sender, text);
        var response = await _httpClient.PostAsJsonAsync(
            url,
            request,
            MedicalApiJsonContext.Default.CreateChatMessageRequest);

        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync(MedicalApiJsonContext.Default.ChatMessageResponse);
    }
}

public static class AppSession
{
    public static Guid UserId { get; set; }
    public static string Email { get; set; } = string.Empty;
    public static string DisplayName { get; set; } = string.Empty;
    public static string Role { get; set; } = string.Empty;

    public static string PatientEmail
    {
        get => Email;
        set => Email = value;
    }
}

public sealed record LoginRequest(string Email, string Password);
public sealed record LoginResponse(Guid UserId, string Email, string DisplayName, string Role);

public sealed record RegisterPatientRequest(string FullName, string Cnp, string Email, string PhoneNumber, string Password);
public sealed record PatientResponse(Guid Id, string FullName, string Cnp, string Email, string PhoneNumber, DateTimeOffset CreatedAt);

public sealed record DoctorResponse(Guid Id, string Name, string Email, string Specialty, string PhoneNumber);

public sealed record CreateAppointmentRequest(
    string PatientEmail,
    string DoctorName,
    string Specialty,
    DateOnly Date,
    TimeOnly? Time = null,
    string? Reason = null);

public sealed record AppointmentResponse(
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

public sealed record CreateChatMessageRequest(string Sender, string Text);
public sealed record ChatMessageResponse(Guid Id, string DoctorName, string Sender, string Text, DateTimeOffset SentAt);

[JsonSourceGenerationOptions(
    PropertyNamingPolicy = JsonKnownNamingPolicy.CamelCase,
    PropertyNameCaseInsensitive = true)]
[JsonSerializable(typeof(string[]))]
[JsonSerializable(typeof(LoginRequest))]
[JsonSerializable(typeof(LoginResponse))]
[JsonSerializable(typeof(RegisterPatientRequest))]
[JsonSerializable(typeof(PatientResponse))]
[JsonSerializable(typeof(DoctorResponse[]))]
[JsonSerializable(typeof(CreateAppointmentRequest))]
[JsonSerializable(typeof(AppointmentResponse))]
[JsonSerializable(typeof(AppointmentResponse[]))]
[JsonSerializable(typeof(CreateChatMessageRequest))]
[JsonSerializable(typeof(ChatMessageResponse))]
internal sealed partial class MedicalApiJsonContext : JsonSerializerContext;
