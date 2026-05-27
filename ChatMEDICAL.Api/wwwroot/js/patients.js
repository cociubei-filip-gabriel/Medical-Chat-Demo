/* ========================= */
/* LOGOUT */
/* ========================= */

const logoutBtn =
    document.getElementById("logoutBtn");

/* LOGOUT */

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem(
        "isLoggedIn"
    );

    alert(
        "Te-ai delogat!"
    );

    window.location.href =
        "login.html";

});

/* ========================= */
/* SEARCH */
/* ========================= */

const searchInput =
    document.getElementById(
        "searchInput"
    );

const patientCards =
    document.querySelectorAll(
        ".patient-card"
    );

/* SEARCH FUNCTION */

searchInput.addEventListener("keyup", () => {

    const value =
        searchInput.value.toLowerCase();

    patientCards.forEach(card => {

        const text =
            card.innerText.toLowerCase();

        if (text.includes(value)) {

            card.style.display =
                "block";
        }

        else {

            card.style.display =
                "none";
        }

    });

});

/* ========================= */
/* ACTIVE CARD */
/* ========================= */

patientCards.forEach(card => {

    card.addEventListener("click", () => {

        patientCards.forEach(item => {

            item.classList.remove(
                "active-patient"
            );

        });

        card.classList.add(
            "active-patient"
        );

    });

});

/* ========================= */
/* FILTERS */
/* ========================= */

const filters =
    document.querySelectorAll(
        ".filters select"
    );

/* EFFECT */

filters.forEach(filter => {

    filter.addEventListener("change", () => {

        filter.style.border =
            "2px solid #4A90E2";

    });

});

/* ========================= */
/* DETAILS BUTTON */
/* ========================= */

const detailButtons =
    document.querySelectorAll(
        ".details-btn"
    );

/* REDIRECT */

detailButtons.forEach(button => {

    button.addEventListener("click", () => {

        alert(

            "Deschidere fișă pacient 👨‍⚕️"

        );

    });

});

/* ========================= */
/* HOME BUTTON */
/* ========================= */

const homeBtn =
    document.querySelector(
        ".home-btn"
    );

/* CLICK */

homeBtn.addEventListener("click", () => {

    window.location.href =
        "index.html";

});

/* ========================= */
/* CONSOLE */
/* ========================= */

console.log(

    "Patients page loaded successfully 💙"

);

/* ========================= */
/* REQUESTS */
/* ========================= */

const requestsList =
    document.getElementById(
        "requestsList"
    );

/* APPOINTMENTS */

const appointments = JSON.parse(

    localStorage.getItem(
        "appointments"
    )

) || [];

/* RENDER */

function renderAppointments() {

    /* NO LIST */

    if (!requestsList) {

        return;
    }

    /* CLEAR */

    requestsList.innerHTML = "";

    /* LOOP */

    appointments.forEach(

        (appointment, index) => {

            /* CARD */

            const card =
                document.createElement(
                    "div"
                );

            card.classList.add(
                "request-card"
            );

            /* HTML */

            card.innerHTML =

                `
            <div class="request-info">

                <h3>

                    ${appointment.doctor}

                </h3>

                <p>

                    ${appointment.speciality}

                </p>

                <p>

                    ${appointment.date}
                    -
                    ${appointment.hour}

                </p>

                <span class="request-status ${appointment.status}">

                    ${appointment.status}

                </span>

            </div>

            <div class="request-actions">

                <button
                    class="confirm-btn">

                    Confirmă

                </button>

                <button
                    class="reject-btn">

                    Refuză

                </button>

            </div>
            `;

            /* BUTTONS */

            const confirmBtn =
                card.querySelector(
                    ".confirm-btn"
                );

            const rejectBtn =
                card.querySelector(
                    ".reject-btn"
                );

            /* CONFIRM */

            confirmBtn.addEventListener(

                "click",

                () => {

                    /* STATUS */

                    appointments[index].status =
                        "confirmed";
                    /* PATIENT NOTIFICATION */

                    localStorage.setItem(

                        "appointmentNotification",

                        "Programarea ta a fost confirmată ✅"

                    );

                    /* APPOINTMENT */

                    const appointment =
                        appointments[index];

                    /* SLOT */

                    const bookedSlot =

                        appointment.date +
                        "_" +
                        appointment.hour;

                    /* DOCTOR */

                    const doctorEmail =
                        appointment.doctor;

                    /* EXISTING */

                    const bookedSlots =

                        JSON.parse(

                            localStorage.getItem(

                                "bookedSlots_" +
                                doctorEmail

                            )

                        )

                        ||

                        [];

                    /* ADD */

                    bookedSlots.push(
                        bookedSlot
                    );

                    /* SAVE BOOKED */

                    localStorage.setItem(

                        "bookedSlots_" +
                        doctorEmail,

                        JSON.stringify(
                            bookedSlots
                        )

                    );

                    /* SAVE APPOINTMENTS */

                    localStorage.setItem(

                        "appointments",

                        JSON.stringify(
                            appointments
                        )

                    );

                    /* REFRESH */

                    renderAppointments();

                }

            );

            /* REJECT */

            rejectBtn.addEventListener(

                "click",

                () => {

                    appointments[index].status =
                        "rejected";

                    localStorage.setItem(

                        "appointments",

                        JSON.stringify(
                            appointments
                        )

                    );

                    renderAppointments();

                }

            );

            /* APPEND */

            requestsList.appendChild(
                card
            );