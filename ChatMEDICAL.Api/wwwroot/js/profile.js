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

    localStorage.removeItem(
        "currentUser"
    );

    localStorage.removeItem(
        "role"
    );

    alert(
        "Te-ai delogat!"
    );

    window.location.href =
        "login.html";

});
/* ========================= */
/* PROFILE IMAGE */
/* ========================= */

const imageUpload =
    document.getElementById("imageUpload");

const profilePreview =
    document.getElementById("profilePreview");

/* IMAGE CHANGE */

imageUpload.addEventListener("change", (e) => {

    const file =
        e.target.files[0];

    if (file) {

        const reader =
            new FileReader();

        reader.onload = function (event) {

            profilePreview.src =
                event.target.result;

            localStorage.setItem(

                "profileImage",

                event.target.result

            );

        };

        reader.readAsDataURL(file);

    }

});

/* LOAD IMAGE */

const savedImage =
    localStorage.getItem(
        "profileImage"
    );

if (savedImage) {

    profilePreview.src =
        savedImage;
}

/* ========================= */
/* SAVE PROFILE */
/* ========================= */

const saveBtn =
    document.getElementById(
        "saveProfileBtn"
    );

/* SAVE */

saveBtn.addEventListener("click", () => {

    const profileData = {

        firstName:
            document.getElementById(
                "firstName"
            ).value,

        lastName:
            document.getElementById(
                "lastName"
            ).value,

        email:
            document.getElementById(
                "profileEmail"
            ).value,

        phone:
            document.getElementById(
                "phone"
            ).value

    };

    const currentUser = JSON.parse(

        localStorage.getItem(
            "currentUser"
        )

    );

    localStorage.setItem(

        "patientProfile_" +
        currentUser.email,

        JSON.stringify(profileData)

    );

    alert(
        "Profil salvat cu succes!"
    );

});

/* LOAD PROFILE */

/* LOAD PROFILE */

const currentUser = JSON.parse(

    localStorage.getItem(
        "currentUser"
    )

);

const savedProfile = JSON.parse(

    localStorage.getItem(

        "patientProfile_" +
        currentUser.email

    )

);

if (savedProfile) {

    document.getElementById(
        "firstName"
    ).value =
        savedProfile.firstName;

    document.getElementById(
        "lastName"
    ).value =
        savedProfile.lastName;

    document.getElementById(
        "profileEmail"
    ).value =
        savedProfile.email;

    document.getElementById(
        "phone"
    ).value =
        savedProfile.phone;
}

/* ========================= */
/* SAVE MEDICAL */
/* ========================= */

const saveMedicalBtn =
    document.getElementById(
        "saveMedicalBtn"
    );

/* SAVE */

saveMedicalBtn.addEventListener("click", () => {

    const medicalData = {

        allergies:
            document.getElementById(
                "allergies"
            ).value,

        history:
            document.getElementById(
                "history"
            ).value,

        medications:
            document.getElementById(
                "medications"
            ).value,

        bloodType:
            document.getElementById(
                "bloodType"
            ).value,

        interventions:
            document.getElementById(
                "interventions"
            ).value,

        notes:
            document.getElementById(
                "notes"
            ).value

    };

    /* SAVE */

    localStorage.setItem(

        "medicalPreferences",

        JSON.stringify(medicalData)

    );

    alert(

        "Preferințe medicale salvate ✅"

    );

});

/* LOAD */

const savedMedical = JSON.parse(

    localStorage.getItem(
        "medicalPreferences"
    )

);

if (savedMedical) {

    document.getElementById(
        "allergies"
    ).value =
        savedMedical.allergies;

    document.getElementById(
        "history"
    ).value =
        savedMedical.history;

    document.getElementById(
        "medications"
    ).value =
        savedMedical.medications;

    document.getElementById(
        "bloodType"
    ).value =
        savedMedical.bloodType;

    document.getElementById(
        "interventions"
    ).value =
        savedMedical.interventions;

    document.getElementById(
        "notes"
    ).value =
        savedMedical.notes;
}

/* ========================= */
/* MODAL */
/* ========================= */

const modal =

    document.getElementById(
        "detailsModal"
    );

const closeModal =

    document.getElementById(
        "closeModal"
    );

const modalBody =

    document.getElementById(
        "modalBody"
    );

/* ========================= */
/* DETAILS */
/* ========================= */

const detailsButtons =

    document.querySelectorAll(
        ".details-btn"
    );

detailsButtons.forEach(button => {

    button.addEventListener(

        "click",

        () => {

            const doctor =

                button.dataset.doctor;

            const speciality =

                button.dataset.speciality;

            const date =

                button.dataset.date;

            const hour =

                button.dataset.hour;

            modal.style.display =
                "flex";

            modalBody.innerHTML =

                `
                <p>

                    👨‍⚕️ Doctor:
                    <b>${doctor}</b>

                </p>

                <p>

                    🩺 Specializare:
                    <b>${speciality}</b>

                </p>

                <p>

                    📅 Data:
                    <b>${date}</b>

                </p>

                <p>

                    🕒 Ora:
                    <b>${hour}</b>

                </p>
                `;

        }

    );

});

/* ========================= */
/* ANALYSIS */
/* ========================= */

const pdfButtons =

    document.querySelectorAll(
        ".pdf-btn"
    );

pdfButtons.forEach(button => {

    button.addEventListener(

        "click",

        () => {

            const analysis =

                button.dataset.analysis;

            const doctor =

                button.dataset.doctor;

            modal.style.display =
                "flex";

            modalBody.innerHTML =

                `
                <h3>

                    ${analysis}

                </h3>

                <p>

                    👨‍⚕️ ${doctor}

                </p>

                <p>

                    ✅ Analiza este disponibilă.

                </p>

                <button
                class="pdf-btn">

                    Download PDF

                </button>
                `;

        }

    );

});

/* ========================= */
/* CLOSE */
/* ========================= */

closeModal.addEventListener(

    "click",

    () => {

        modal.style.display =
            "none";

    }

);

window.addEventListener(

    "click",

    event => {

        if (

            event.target === modal

        ) {

            modal.style.display =
                "none";

        }

    }

);