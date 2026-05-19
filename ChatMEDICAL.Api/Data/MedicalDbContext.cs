using ChatMEDICAL.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ChatMEDICAL.Api.Data;

public sealed class MedicalDbContext : DbContext
{
    public MedicalDbContext(DbContextOptions<MedicalDbContext> options) : base(options)
    {
    }

    public DbSet<Patient> Patients => Set<Patient>();
    public DbSet<Doctor> Doctors => Set<Doctor>();
    public DbSet<Admin> Admins => Set<Admin>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<ChatMessage> ChatMessages => Set<ChatMessage>();
    public DbSet<AccessRequest> AccessRequests => Set<AccessRequest>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Patient>(entity =>
        {
            entity.HasKey(patient => patient.Id);
            entity.HasIndex(patient => patient.Email).IsUnique();
            entity.HasIndex(patient => patient.Cnp).IsUnique();
            entity.Property(patient => patient.FullName).HasMaxLength(120).IsRequired();
            entity.Property(patient => patient.Cnp).HasMaxLength(20).IsRequired();
            entity.Property(patient => patient.Email).HasMaxLength(120).IsRequired();
            entity.Property(patient => patient.Password).HasMaxLength(200).IsRequired();
            entity.Property(patient => patient.PhoneNumber).HasMaxLength(30).IsRequired();
        });

        modelBuilder.Entity<Doctor>(entity =>
        {
            entity.HasKey(doctor => doctor.Id);
            entity.HasIndex(doctor => doctor.Email).IsUnique();
            entity.Property(doctor => doctor.FullName).HasMaxLength(120).IsRequired();
            entity.Property(doctor => doctor.Email).HasMaxLength(120).IsRequired();
            entity.Property(doctor => doctor.Password).HasMaxLength(200).IsRequired();
            entity.Property(doctor => doctor.Specialty).HasMaxLength(100).IsRequired();
            entity.Property(doctor => doctor.PhoneNumber).HasMaxLength(30).IsRequired();
        });

        modelBuilder.Entity<Admin>(entity =>
        {
            entity.HasKey(admin => admin.Id);
            entity.HasIndex(admin => admin.Email).IsUnique();
            entity.Property(admin => admin.FullName).HasMaxLength(120).IsRequired();
            entity.Property(admin => admin.Email).HasMaxLength(120).IsRequired();
            entity.Property(admin => admin.Password).HasMaxLength(200).IsRequired();
        });

        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.HasKey(appointment => appointment.Id);
            entity.Property(appointment => appointment.Specialty).HasMaxLength(100).IsRequired();
            entity.Property(appointment => appointment.Reason).HasMaxLength(500);
            entity.Property(appointment => appointment.Status).HasMaxLength(30).IsRequired();

            entity.HasOne(appointment => appointment.Patient)
                .WithMany(patient => patient.Appointments)
                .HasForeignKey(appointment => appointment.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(appointment => appointment.Doctor)
                .WithMany(doctor => doctor.Appointments)
                .HasForeignKey(appointment => appointment.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<ChatMessage>(entity =>
        {
            entity.HasKey(message => message.Id);
            entity.Property(message => message.Sender).HasMaxLength(120).IsRequired();
            entity.Property(message => message.Text).HasMaxLength(2000).IsRequired();
        });

        modelBuilder.Entity<AccessRequest>(entity =>
        {
            entity.HasKey(request => request.Id);
            entity.Property(request => request.FullName).HasMaxLength(120).IsRequired();
            entity.Property(request => request.Email).HasMaxLength(120).IsRequired();
            entity.Property(request => request.Reason).HasMaxLength(500).IsRequired();
            entity.Property(request => request.Status).HasMaxLength(30).IsRequired();
        });
    }
}
