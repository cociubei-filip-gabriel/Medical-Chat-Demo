# Backend database pentru Medical Chat

Proiectul `ChatMEDICAL.Api` salveaza datele intr-o baza de date SQLite numita `medical_chat.db`.

## Clase principale

Clasele sunt in:

```text
ChatMEDICAL.Api/Models
```

Clase create:

- `Patient` - pacientul care se poate inregistra si face programari
- `Doctor` - doctorul care se poate loga si confirma/anula programari
- `Admin` - administratorul care poate vedea toate datele
- `Appointment` - programarea facuta de pacient
- `ChatMessage` - mesajele din chat
- `AccessRequest` - cereri de acces

Tabelele sunt configurate in:

```text
ChatMEDICAL.Api/Data/MedicalDbContext.cs
```

Datele demo sunt create/actualizate automat din:

```text
ChatMEDICAL.Api/Data/DatabaseSeeder.cs
```

## Reguli pentru login/email

Am modificat conturile ca sa fie clare pe roluri:

```text
Admin:
Email: admin@admin
Parola: 1234

Pacient demo:
Email: demo.patient@pacient
Parola: 1234

Doctor demo principal:
Email: andrei.popescu@doctor
Parola: 1234
```

Reguli noi:

```text
Pacient: nume.prenume@pacient
Doctor:  nume.prenume@doctor
Admin:   admin@admin
```

Exemple doctori demo:

```text
andrei.popescu@doctor
maria.ionescu@doctor
elena.marinescu@doctor
cristian.toma@doctor
ana.preda@doctor
```

Toate conturile demo au parola:

```text
1234
```

## Aplicatia in browser

Am adaugat o interfata web simpla in:

```text
ChatMEDICAL.Api/wwwroot/index.html
ChatMEDICAL.Api/wwwroot/styles.css
ChatMEDICAL.Api/wwwroot/app.js
```

Cand pornesti proiectul `ChatMEDICAL.Api`, se deschide aplicatia web la:

```text
http://localhost:5221
```

Swagger ramane disponibil la:

```text
http://localhost:5221/swagger
```

In browser poti testa:

- login pacient / doctor / admin
- inregistrare pacient
- creare programare de catre pacient
- vizualizare programari
- confirmare/anulare programari de catre doctor
- vizualizare toate programarile de catre admin

## Cum se ruleaza

Pentru aplicatia desktop + backend:

1. Deschide solutia in Visual Studio.
2. Click dreapta pe Solution -> Properties.
3. Seteaza startup multiplu:
   - `ChatMEDICAL.Api` -> Start
   - `ChatMEDICAL` -> Start
4. Ruleaza cu F5.

Pentru aplicatia web in browser, poti porni doar:

```text
ChatMEDICAL.Api
```

Apoi intri pe:

```text
http://localhost:5221
```

## Endpoint-uri importante

```text
POST /api/auth/register-patient
POST /api/auth/login
GET  /api/patients
GET  /api/doctors
GET  /api/admins
GET  /api/specialties
POST /api/appointments
GET  /api/appointments
PUT  /api/appointments/{id}/confirm
PUT  /api/appointments/{id}/cancel
```

## Observatie importanta

Parolele sunt salvate simplu, ca text, doar pentru proiect/demo. Intr-o aplicatie reala se foloseste hashing pentru parole.
