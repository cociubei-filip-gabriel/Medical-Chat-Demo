import {

    db,
    collection,
    query,
    where,
    onSnapshot,
    updateDoc,
    doc

} from "./firebase.js";

/* ========================= */
/* CURRENT USER */
/* ========================= */

const currentUser = JSON.parse(

    localStorage.getItem(
        "currentUser"
    )

);

if (

    !currentUser ||

    currentUser.role !== "doctor"

) {

    window.location.href =
        "login.html";

}

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

        localStorage.removeItem(
            "role"
        );

        window.location.href =
            "login.html";

    }

);

/* ========================= */
/* SAVE PROFILE */
/* ========================= */

const saveDoctorBtn =
    document.getElementById(
        "saveDoctorBtn"
    );

saveDoctorBtn.addEventListener(

    "click",

    () => {

        const doctorData = {

            name:
                document.getElementById(
                    "doctorName"
                ).value,

            speciality:
                document.getElementById(
                    "doctorSpeciality"
                ).value,

            experience:
                document.getElementById(
                    "doctorExperience"
                ).value,

            phone:
                document.getElementById(
                    "doctorPhone"
                ).value

        };

        localStorage.setItem(

            "doctorProfile_" +
            currentUser.email,

            JSON.stringify(
                doctorData
            )

        );

        alert(
            "Profil salvat ✅"
        );

    }

);

/* ========================= */
/* LOAD PROFILE */
/* ========================= */

const savedDoctor = JSON.parse(

    localStorage.getItem(

        "doctorProfile_" +
        currentUser.email

    )

);

if (savedDoctor) {

    document.getElementById(
        "doctorName"
    ).value =
        savedDoctor.name;

    document.getElementById(
        "doctorSpeciality"
    ).value =
        savedDoctor.speciality;

    document.getElementById(
        "doctorExperience"
    ).value =
        savedDoctor.experience;

    document.getElementById(
        "doctorPhone"
    ).value =
        savedDoctor.phone;

}

/* ========================= */
/* SAVE SCHEDULE */
/* ========================= */

const saveScheduleBtn =
    document.getElementById(
        "saveScheduleBtn"
    );

saveScheduleBtn.addEventListener(

    "click",

    () => {

        const schedule = {

            mondayStart:
                document.getElementById(
                    "mondayStart"
                ).value,

            mondayEnd:
                document.getElementById(
                    "mondayEnd"
                ).value

        };

        if (

            !schedule.mondayStart ||

            !schedule.mondayEnd

        ) {

            alert(
                "Completează programul!"
            );

            return;

        }

        localStorage.setItem(

            "doctorSchedule_" +
            currentUser.email,

            JSON.stringify(
                schedule
            )

        );

        alert(
            "Program salvat ✅"
        );

    }

);

/* ========================= */
/* LOAD SCHEDULE */
/* ========================= */

const savedSchedule = JSON.parse(

    localStorage.getItem(

        "doctorSchedule_" +
        currentUser.email

    )

);

if (savedSchedule) {

    document.getElementById(
        "mondayStart"
    ).value =
        savedSchedule.mondayStart;

    document.getElementById(
        "mondayEnd"
    ).value =
        savedSchedule.mondayEnd;

}

/* ========================= */
/* APPOINTMENTS */
/* ========================= */

const appointmentsList =
    document.getElementById(
        "appointmentsList"
    );

const appointmentsQuery = query(

    collection(
        db,
        "appointments"
    ),

    where(

        "doctor",

        "==",

        currentUser.email

    )

);

onSnapshot(

    appointmentsQuery,

    (snapshot) => {

        appointmentsList.innerHTML = "";

        snapshot.forEach(

            (appointment) => {

                const data =
                    appointment.data();

                appointmentsList.innerHTML += `

                <div class="appointment-card">

                    <h3>
                        👤 ${data.patient}
                    </h3>

                    <p>
                        📅 ${data.date}
                    </p>

                    <p>
                        ⏰ ${data.time}
                    </p>

                    <p>
                        Status: ${data.status}
                    </p>

                    <button

class="accept-btn
${data.status === "accepted"
                        ? "accepted"
                        : ""
                    }"

data-id="${appointment.id}"

${data.status === "accepted"
                        ? "disabled"
                        : ""
                    }>

${data.status === "accepted"
                        ? "Confirmată"
                        : "Acceptă"}

</button>

                </div>
                `;

            }

        );

        const acceptButtons =

            document.querySelectorAll(
                ".accept-btn"
            );

        acceptButtons.forEach(

            button => {

                button.addEventListener(

                    "click",

                    async () => {

                        await updateDoc(

                            doc(

                                db,
                                "appointments",
                                button.dataset.id

                            ),

                            {

                                status:
                                    "accepted"

                            }

                        );

                        alert(
                            "Programare acceptată ✅"
                        );
                        button.classList.add(
                            "accepted"
                        );

                        button.innerHTML =
                            "Confirmată";

                        button.disabled = true;
                    }

                );

            }

        );

    }

);

/* ========================= */
/* NOTIFICATIONS */
/* ========================= */

const notificationBtn =
    document.getElementById(
        "notificationBtn"
    );

notificationBtn.addEventListener(

    "click",

    () => {

        alert(
            "Ai notificări noi 🔔"
        );

    }

);