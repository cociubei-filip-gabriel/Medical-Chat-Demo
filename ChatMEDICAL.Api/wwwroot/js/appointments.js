/* ========================= */
/* CURRENT USER */
/* ========================= */

const currentUser = JSON.parse(

    localStorage.getItem(
        "currentUser"
    )

);

/* ========================= */
/* LOGOUT */
/* ========================= */

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );

logoutBtn.addEventListener(

    "click",

    () => {

        localStorage.removeItem(
            "isLoggedIn"
        );

        localStorage.removeItem(
            "currentUser"
        );

        window.location.href =
            "login.html";

    }

);

/* ========================= */
/* ELEMENTS */
/* ========================= */

const specialitySelect =
    document.getElementById(
        "specialitySelect"
    );

const doctorSelect =
    document.getElementById(
        "doctorSelect"
    );

const appointmentDate =
    document.getElementById(
        "appointmentDate"
    );

const hoursGrid =
    document.getElementById(
        "hoursGrid"
    );

const confirmBtn =
    document.querySelector(
        ".confirm-btn"
    );

const appointmentsHistory =
    document.getElementById(
        "appointmentsHistory"
    );

const notificationBadge =
    document.getElementById(
        "notificationBadge"
    );

/* ========================= */
/* DATE MIN */
/* ========================= */

const todayDate =
    new Date()
        .toISOString()
        .split("T")[0];

appointmentDate.min =
    todayDate;

/* ========================= */
/* DOCTOR SCHEDULE */
/* ========================= */

let doctorSchedule = null;

/* LOAD SCHEDULE */

doctorSelect.addEventListener(

    "change",

    () => {

        const selectedDoctor =
            doctorSelect.value;

        doctorSchedule = JSON.parse(

            localStorage.getItem(

                "doctorSchedule_" +
                selectedDoctor

            )

        );

    }

);

/* ========================= */
/* GENERATE HOURS */
/* ========================= */

appointmentDate.addEventListener(

    "change",

    () => {

        hoursGrid.innerHTML = "";

        if (!doctorSchedule) {

            hoursGrid.innerHTML =

                "<p>Doctor indisponibil</p>";

            return;
        }

        /* DATE */

        const selectedDate =
            new Date(
                appointmentDate.value
            );

        /* DAY */

        const days = [

            "sunday",

            "monday",

            "tuesday",

            "wednesday",

            "thursday",

            "friday",

            "saturday"

        ];

        const selectedDay =
            days[
            selectedDate.getDay()
            ];

        /* SCHEDULE */

        const schedule =
            doctorSchedule[selectedDay];

        if (

            !schedule ||

            !schedule.start ||

            !schedule.end

        ) {

            hoursGrid.innerHTML =

                "<p>Doctor indisponibil în această zi</p>";

            return;
        }

        /* HOURS */

        const startHour =
            parseInt(
                schedule.start.split(":")[0]
            );

        const endHour =
            parseInt(
                schedule.end.split(":")[0]
            );

        /* GENERATE */

        for (

            let hour = startHour;

            hour < endHour;

            hour++

        ) {

            const button =
                document.createElement(
                    "button"
                );

            button.innerText =
                hour + ":00";

            /* BOOKED SLOTS */

            const bookedSlots =

                JSON.parse(

                    localStorage.getItem(

                        "bookedSlots_" +
                        doctorSelect.value

                    )

                )

                ||

                [];

            /* CURRENT SLOT */

            const currentSlot =

                appointmentDate.value +
                "_" +
                button.innerText;

            /* OCCUPIED */

            if (

                bookedSlots.includes(
                    currentSlot
                )

            ) {

                continue;
            }

            /* CLICK */

            button.addEventListener(

                "click",

                () => {

                    const allButtons =
                        hoursGrid.querySelectorAll(
                            "button"
                        );

                    allButtons.forEach(btn => {

                        btn.classList.remove(
                            "active-hour"
                        );

                    });

                    button.classList.add(
                        "active-hour"
                    );

                }

            );

            hoursGrid.appendChild(
                button
            );

        }

    }

);

/* ========================= */
/* CONFIRM APPOINTMENT */
/* ========================= */

confirmBtn.addEventListener(

    "click",

    () => {

        /* ACTIVE HOUR */

        const activeHour =
            document.querySelector(
                ".active-hour"
            );

        /* VALIDATION */

        if (

            specialitySelect.selectedIndex === 0 ||

            doctorSelect.selectedIndex === 0 ||

            appointmentDate.value === "" ||

            !activeHour

        ) {

            alert(

                "Completează toate datele programării!"

            );

            return;

        }

        /* APPOINTMENT */
        /* SAVE CHAT DOCTOR */

        localStorage.setItem(

            "selectedDoctor",

            doctorSelect.value

        );

        const appointment = {

            patient:
                currentUser.email,

            speciality:
                specialitySelect.value,

            doctor:
                doctorSelect.value,

            date:
                appointmentDate.value,

            hour:
                activeHour.innerText,

            status:
                "pending"

        };

        /* LOAD */

        const appointments = JSON.parse(

            localStorage.getItem(
                "appointments"
            )

        ) || [];

        /* SAVE */

        appointments.push(
            appointment
        );

        localStorage.setItem(

            "appointments",

            JSON.stringify(
                appointments
            )

        );
        /* DOCTOR NOTIFICATION */

        localStorage.setItem(

            "doctorNotification",

            "Ai o nouă programare 🔔"

        );

        /* SUCCESS */

        alert(

            "Programare trimisă ✅"

        );

        /* RESET */

        specialitySelect.selectedIndex = 0;

        doctorSelect.selectedIndex = 0;

        appointmentDate.value = "";

        hoursGrid.innerHTML = "";

        renderHistory();

    }

);

/* ========================= */
/* HISTORY */
/* ========================= */

function renderHistory() {

    if (!appointmentsHistory) {

        return;
    }

    appointmentsHistory.innerHTML = "";

    /* LOAD */

    const appointments = JSON.parse(

        localStorage.getItem(
            "appointments"
        )

    ) || [];

    /* FILTER */

    const patientAppointments =

        appointments.filter(

            appointment =>

                appointment.patient ===
                currentUser.email

        );

    /* LOOP */

    patientAppointments.forEach(

        appointment => {

            const card =
                document.createElement(
                    "div"
                );

            card.classList.add(
                "history-card"
            );

            card.innerHTML =

                `
            <div class="history-info">

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

            </div>

            <span class="history-status ${appointment.status}">

                ${appointment.status}

            </span>
            `;

            appointmentsHistory.appendChild(
                card
            );

        }

    );

}

/* ========================= */
/* NOTIFICATIONS */
/* ========================= */

const appointmentNotification =
    localStorage.getItem(
        "appointmentNotification"
    );

if (

    appointmentNotification &&
    notificationBadge

) {

    notificationBadge.innerText =
        "1";

    notificationBadge.addEventListener(

        "click",

        () => {

            alert(
                appointmentNotification
            );

            notificationBadge.innerText =
                "0";

            localStorage.removeItem(
                "appointmentNotification"
            );

        }

    );

}

/* ========================= */
/* INIT */
/* ========================= */

renderHistory();

/* ========================= */
/* CONSOLE */
/* ========================= */

console.log(

    "Appointments loaded successfully 💙"

);

/* ========================= */
/* FILTER APPOINTMENTS */
/* ========================= */

const specialityFilter =

    document.getElementById(
        "specialityFilter"
    );

const doctorFilter =

    document.getElementById(
        "doctorFilter"
    );

const doctorCards =

    document.querySelectorAll(
        ".doctor-card"
    );

/* FILTER FUNCTION */

function filterDoctors() {

    const specialityValue =

        specialityFilter.value
            .toLowerCase();

    const doctorValue =

        doctorFilter.value
            .toLowerCase();

    doctorCards.forEach(card => {

        const speciality =

            card.dataset.speciality
                .toLowerCase();

        const doctor =

            card.dataset.doctor
                .toLowerCase();

        /* MATCH */

        const matchSpeciality =

            specialityValue === ""

            ||

            speciality.includes(
                specialityValue
            );

        const matchDoctor =

            doctorValue === ""

            ||

            doctor.includes(
                doctorValue
            );

        /* SHOW */

        if (

            matchSpeciality

            &&

            matchDoctor

        ) {

            card.style.display =
                "block";

        }

        else {

            card.style.display =
                "none";

        }

    });

}

/* EVENTS */

specialityFilter.addEventListener(

    "change",

    filterDoctors

);

doctorFilter.addEventListener(

    "change",

    filterDoctors

);