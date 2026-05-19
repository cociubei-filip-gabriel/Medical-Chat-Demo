namespace ChatMEDICAL.Api.Models;

public sealed class ChatMessage
{
    public Guid Id { get; set; }
    public Guid DoctorId { get; set; }
    public Doctor? Doctor { get; set; }
    public Guid? PatientId { get; set; }
    public Patient? Patient { get; set; }
    public string Sender { get; set; } = string.Empty;
    public string Text { get; set; } = string.Empty;
    public DateTimeOffset SentAt { get; set; } = DateTimeOffset.UtcNow;
}
