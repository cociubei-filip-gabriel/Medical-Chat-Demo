const state = {
  user: null,
  specialties: [],
  doctors: [],
  appointments: []
};

const $ = (id) => document.getElementById(id);

function showMessage(text, type = "success") {
  const box = $("message");
  box.textContent = text;
  box.className = `message ${type}`;
  box.classList.remove("hidden");
  setTimeout(() => box.classList.add("hidden"), 4200);
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options
  });

  if (!response.ok) {
    let errorMessage = `Eroare API ${response.status}`;
    try {
      const data = await response.json();
      errorMessage = data.message || errorMessage;
    } catch { }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  return await response.json();
}

function setDefaultDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  $("appointmentDate").value = tomorrow.toISOString().slice(0, 10);
}

function showDashboard() {
  $("authSection").classList.add("hidden");
  $("dashboardSection").classList.remove("hidden");
  $("welcomeTitle").textContent = `Bun venit, ${state.user.displayName}`;
  $("roleInfo").textContent = `Rol: ${state.user.role} | Email: ${state.user.email}`;
  $("patientPanel").classList.toggle("hidden", state.user.role !== "patient");
  $("tableTitle").textContent = state.user.role === "patient" ? "Programările mele" : "Programări din baza de date";
}

function showAuth() {
  state.user = null;
  $("authSection").classList.remove("hidden");
  $("dashboardSection").classList.add("hidden");
}

async function login() {
  try {
    const email = $("loginEmail").value.trim();
    const password = $("loginPassword").value;

    state.user = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });

    showDashboard();

    if (state.user.role === "patient") {
      await loadPatientForm();
    }

    await loadAppointments();
    showMessage("Login reușit.");
  } catch (error) {
    showMessage(error.message, "error");
  }
}

async function registerPatient() {
  try {
    const request = {
      fullName: $("registerFullName").value.trim(),
      cnp: $("registerCnp").value.trim(),
      email: $("registerEmail").value.trim(),
      phoneNumber: $("registerPhone").value.trim(),
      password: $("registerPassword").value
    };

    await api("/api/auth/register-patient", {
      method: "POST",
      body: JSON.stringify(request)
    });

    $("loginEmail").value = request.email;
    $("loginPassword").value = request.password;
    showMessage("Pacientul a fost creat. Te poți loga cu emailul nou.");
  } catch (error) {
    showMessage(error.message, "error");
  }
}

async function loadPatientForm() {
  state.specialties = await api("/api/specialties");
  const specialtySelect = $("specialtySelect");
  specialtySelect.innerHTML = state.specialties.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join("");

  setDefaultDate();
  await loadDoctorsForSelectedSpecialty();
}

async function loadDoctorsForSelectedSpecialty() {
  const specialty = $("specialtySelect").value;
  state.doctors = await api(`/api/doctors?specialty=${encodeURIComponent(specialty)}`);
  $("doctorSelect").innerHTML = state.doctors
    .map(d => `<option value="${escapeHtml(d.name)}">${escapeHtml(d.name)} - ${escapeHtml(d.email)}</option>`)
    .join("");
}

async function bookAppointment() {
  try {
    const request = {
      patientEmail: state.user.email,
      doctorName: $("doctorSelect").value,
      specialty: $("specialtySelect").value,
      date: $("appointmentDate").value,
      time: `${$("appointmentTime").value}:00`,
      reason: $("appointmentReason").value.trim()
    };

    await api("/api/appointments", {
      method: "POST",
      body: JSON.stringify(request)
    });

    await loadAppointments();
    showMessage("Programarea a fost salvată cu status pending.");
  } catch (error) {
    showMessage(error.message, "error");
  }
}

async function loadAppointments() {
  try {
    let path = "/api/appointments";

    if (state.user.role === "patient") {
      path += `?patientEmail=${encodeURIComponent(state.user.email)}`;
    }

    if (state.user.role === "doctor") {
      path += `?doctorEmail=${encodeURIComponent(state.user.email)}`;
    }

    state.appointments = await api(path);
    renderAppointments();
  } catch (error) {
    showMessage(error.message, "error");
  }
}

function renderAppointments() {
  const body = $("appointmentsBody");

  if (state.appointments.length === 0) {
    body.innerHTML = `<tr><td colspan="8" class="muted">Nu există programări de afișat.</td></tr>`;
    return;
  }

  body.innerHTML = state.appointments.map(item => `
    <tr>
      <td>${escapeHtml(item.patientName)}</td>
      <td>${escapeHtml(item.patientEmail)}</td>
      <td>${escapeHtml(item.doctorName)}</td>
      <td>${escapeHtml(item.specialty)}</td>
      <td>${escapeHtml(item.date)}</td>
      <td>${String(item.time).slice(0, 5)}</td>
      <td><span class="status ${escapeHtml(item.status)}">${escapeHtml(item.status)}</span></td>
      <td>${renderActions(item)}</td>
    </tr>
  `).join("");
}

function renderActions(item) {
  if (state.user.role !== "doctor") {
    return "-";
  }

  return `
    <button class="small" onclick="confirmAppointment('${item.id}')">Confirmă</button>
    <button class="small danger" onclick="cancelAppointment('${item.id}')">Anulează</button>
  `;
}

async function confirmAppointment(id) {
  try {
    await api(`/api/appointments/${id}/confirm`, { method: "PUT" });
    await loadAppointments();
    showMessage("Programarea a fost confirmată.");
  } catch (error) {
    showMessage(error.message, "error");
  }
}

async function cancelAppointment(id) {
  try {
    await api(`/api/appointments/${id}/cancel`, { method: "PUT" });
    await loadAppointments();
    showMessage("Programarea a fost anulată.");
  } catch (error) {
    showMessage(error.message, "error");
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

$("loginBtn").addEventListener("click", login);
$("registerBtn").addEventListener("click", registerPatient);
$("logoutBtn").addEventListener("click", showAuth);
$("refreshBtn").addEventListener("click", loadAppointments);
$("bookBtn").addEventListener("click", bookAppointment);
$("specialtySelect").addEventListener("change", loadDoctorsForSelectedSpecialty);
setDefaultDate();
