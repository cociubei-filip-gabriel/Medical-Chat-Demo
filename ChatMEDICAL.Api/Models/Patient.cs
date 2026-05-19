namespace ChatMEDICAL.Api.Models;

public sealed class Patient
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Cnp { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public List<Appointment> Appointments { get; set; } = new();
}
