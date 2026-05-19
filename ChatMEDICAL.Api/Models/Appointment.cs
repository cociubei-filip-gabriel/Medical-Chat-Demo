namespace ChatMEDICAL.Api.Models;

public sealed class Appointment
{
    public Guid Id { get; set; }

    public Guid PatientId { get; set; }
    public Patient? Patient { get; set; }

    public Guid DoctorId { get; set; }
    public Doctor? Doctor { get; set; }

    public string Specialty { get; set; } = string.Empty;
    public DateOnly Date { get; set; }
    public TimeOnly Time { get; set; }
    public string Reason { get; set; } = string.Empty;

    // pending = programarea a fost ceruta de pacient
    // confirmed = doctorul a confirmat-o
    // cancelled = programarea a fost anulata/refuzata
    public string Status { get; set; } = AppointmentStatus.Pending;

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? ConfirmedAt { get; set; }
    public DateTimeOffset? CancelledAt { get; set; }
}

public static class AppointmentStatus
{
    public const string Pending = "pending";
    public const string Confirmed = "confirmed";
    public const string Cancelled = "cancelled";
}
