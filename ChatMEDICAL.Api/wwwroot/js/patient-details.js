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
/* MEDICAL CARDS */
/* ========================= */

const medicalCards =
    document.querySelectorAll(
        ".medical-card"
    );

/* ACTIVE */

medicalCards.forEach(card => {

    card.addEventListener("click", () => {

        medicalCards.forEach(item => {

            item.classList.remove(
                "active-medical"
            );

        });

        card.classList.add(
            "active-medical"
        );

    });

});

/* ========================= */
/* APPOINTMENT CARDS */
/* ========================= */

const appointmentCards =
    document.querySelectorAll(
        ".appointment-card"
    );

/* ACTIVE */

appointmentCards.forEach(card => {

    card.addEventListener("click", () => {

        appointmentCards.forEach(item => {

            item.classList.remove(
                "active-appointment"
            );

        });

        card.classList.add(
            "active-appointment"
        );

    });

});

/* ========================= */
/* PDF BUTTONS */
/* ========================= */

const pdfButtons =
    document.querySelectorAll(
        ".analysis-card button"
    );

/* DOWNLOAD */

pdfButtons.forEach(button => {

    button.addEventListener("click", () => {

        alert(

            "Descărcare PDF începută 📄"

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
/* BACK BUTTON */
/* ========================= */

const backBtn =
    document.querySelector(
        ".back-btn"
    );

/* CLICK */

backBtn.addEventListener("click", () => {

    window.location.href =
        "patients.html";

});

/* ========================= */
/* CONSOLE */
/* ========================= */

console.log(

    "Patient details page loaded 💙"

);