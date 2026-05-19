using ChatMEDICAL.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace ChatMEDICAL.Api.Data;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(MedicalDbContext db)
    {
        await db.Database.EnsureCreatedAsync();

        await EnsureAdminAsync(db);

        await EnsureDoctorAsync(db, "Dr. Andrei Popescu", "andrei.popescu@doctor", "Cardiology", "0711111111");
        await EnsureDoctorAsync(db, "Dr. Maria Ionescu", "maria.ionescu@doctor", "Cardiology", "0711111112");
        await EnsureDoctorAsync(db, "Dr. Elena Marinescu", "elena.marinescu@doctor", "Dermatology", "0711111113");
        await EnsureDoctorAsync(db, "Dr. Cristian Toma", "cristian.toma@doctor", "Orthopedics", "0711111114");
        await EnsureDoctorAsync(db, "Dr. Ana Preda", "ana.preda@doctor", "Neurology", "0711111115");

        await EnsurePatientAsync(db);

        await db.SaveChangesAsync();
    }

    private static async Task EnsureAdminAsync(MedicalDbContext db)
    {
        var admin = await db.Admins.FirstOrDefaultAsync(x =>
            x.Email == "admin@admin" ||
            x.Email == "admin@medical.ro" ||
            x.FullName == "System Admin");

        if (admin is null)
        {
            db.Admins.Add(new Admin
            {
                Id = Guid.NewGuid(),
                FullName = "System Admin",
                Email = "admin@admin",
                Password = "1234"
            });
            return;
        }

        admin.FullName = "System Admin";
        admin.Email = "admin@admin";
        admin.Password = "1234";
    }

    private static async Task EnsureDoctorAsync(
        MedicalDbContext db,
        string fullName,
        string email,
        string specialty,
        string phoneNumber)
    {
        var doctor = await db.Doctors.FirstOrDefaultAsync(x =>
            x.Email == email ||
            x.FullName == fullName);

        if (doctor is null)
        {
            db.Doctors.Add(new Doctor
            {
                Id = Guid.NewGuid(),
                FullName = fullName,
                Email = email,
                Password = "1234",
                Specialty = specialty,
                PhoneNumber = phoneNumber
            });
            return;
        }

        doctor.FullName = fullName;
        doctor.Email = email;
        doctor.Password = "1234";
        doctor.Specialty = specialty;
        doctor.PhoneNumber = phoneNumber;
    }

    private static async Task EnsurePatientAsync(MedicalDbContext db)
    {
        var patient = await db.Patients.FirstOrDefaultAsync(x =>
            x.Email == "demo.patient@pacient" ||
            x.Email == "patient@medical.ro" ||
            x.Cnp == "5000101123456");

        if (patient is null)
        {
            db.Patients.Add(new Patient
            {
                Id = Guid.NewGuid(),
                FullName = "Demo Patient",
                Cnp = "5000101123456",
                Email = "demo.patient@pacient",
                Password = "1234",
                PhoneNumber = "0722222222"
            });
            return;
        }

        patient.FullName = "Demo Patient";
        patient.Cnp = "5000101123456";
        patient.Email = "demo.patient@pacient";
        patient.Password = "1234";
        patient.PhoneNumber = "0722222222";
    }
}
