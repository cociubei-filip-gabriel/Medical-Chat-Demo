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
        BaseAddress = new Uri("https://chatmedical-api.jollystone-9c72cad8.swedencentral.azurecontainerapps.io")
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
        DateOnly date)
    {
        var request = new CreateAppointmentRequest(patientEmail, doctorName, specialty, date);
        var response = await _httpClient.PostAsJsonAsync(
            "/api/appointments",
            request,
            MedicalApiJsonContext.Default.CreateAppointmentRequest);
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
    public static string PatientEmail { get; set; } = "patient@example.com";
}

public sealed record LoginRequest(string Email, string Password);

public sealed record LoginResponse(Guid UserId, string Email, string DisplayName, string Role);

public sealed record DoctorResponse(string Name, string Specialty);

public sealed record CreateAppointmentRequest(string PatientEmail, string DoctorName, string Specialty, DateOnly Date);

public sealed record AppointmentResponse(
    Guid Id,
    string PatientEmail,
    string DoctorName,
    string Specialty,
    DateOnly Date,
    string Status,
    DateTimeOffset CreatedAt);

public sealed record CreateChatMessageRequest(string Sender, string Text);

public sealed record ChatMessageResponse(Guid Id, string DoctorName, string Sender, string Text, DateTimeOffset SentAt);

[JsonSerializable(typeof(string[]))]
[JsonSerializable(typeof(LoginRequest))]
[JsonSerializable(typeof(LoginResponse))]
[JsonSerializable(typeof(DoctorResponse[]))]
[JsonSerializable(typeof(CreateAppointmentRequest))]
[JsonSerializable(typeof(AppointmentResponse))]
[JsonSerializable(typeof(CreateChatMessageRequest))]
[JsonSerializable(typeof(ChatMessageResponse))]
internal sealed partial class MedicalApiJsonContext : JsonSerializerContext;
