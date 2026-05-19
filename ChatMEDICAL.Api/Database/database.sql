-- Script orientativ pentru baza de date Medical Chat.
-- In proiect baza este creata automat cu Entity Framework Core + SQLite.

CREATE TABLE Patients (
    Id TEXT PRIMARY KEY,
    FullName TEXT NOT NULL,
    Cnp TEXT NOT NULL UNIQUE,
    Email TEXT NOT NULL UNIQUE,
    Password TEXT NOT NULL,
    PhoneNumber TEXT NOT NULL,
    CreatedAt TEXT NOT NULL
);

CREATE TABLE Doctors (
    Id TEXT PRIMARY KEY,
    FullName TEXT NOT NULL,
    Email TEXT NOT NULL UNIQUE,
    Password TEXT NOT NULL,
    Specialty TEXT NOT NULL,
    PhoneNumber TEXT NOT NULL,
    CreatedAt TEXT NOT NULL
);

CREATE TABLE Admins (
    Id TEXT PRIMARY KEY,
    FullName TEXT NOT NULL,
    Email TEXT NOT NULL UNIQUE,
    Password TEXT NOT NULL,
    CreatedAt TEXT NOT NULL
);

CREATE TABLE Appointments (
    Id TEXT PRIMARY KEY,
    PatientId TEXT NOT NULL,
    DoctorId TEXT NOT NULL,
    Specialty TEXT NOT NULL,
    Date TEXT NOT NULL,
    Time TEXT NOT NULL,
    Reason TEXT,
    Status TEXT NOT NULL,
    CreatedAt TEXT NOT NULL,
    ConfirmedAt TEXT NULL,
    CancelledAt TEXT NULL,
    FOREIGN KEY (PatientId) REFERENCES Patients(Id),
    FOREIGN KEY (DoctorId) REFERENCES Doctors(Id)
);

-- Reguli email folosite in cod:
-- Admin:   admin@admin
-- Pacient: nume.prenume@pacient
-- Doctor:  nume.prenume@doctor
