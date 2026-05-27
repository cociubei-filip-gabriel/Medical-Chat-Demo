/* ========================= */
/* INFO MODAL */
/* ========================= */

const infoModal =
    document.getElementById(
        "infoModal"
    );

const infoTitle =
    document.getElementById(
        "infoTitle"
    );

const infoText =
    document.getElementById(
        "infoText"
    );

const closeInfo =
    document.getElementById(
        "closeInfo"
    );

const backInfoBtn =
    document.getElementById(
        "backInfoBtn"
    );

/* OPEN */

function openInfoModal(
    title,
    text
) {

    infoTitle.innerText =
        title;

    infoText.innerText =
        text;

    infoModal.classList.add(
        "active"
    );

}

/* CLOSE */

function closeModal() {

    infoModal.classList.remove(
        "active"
    );

}

/* EVENTS */

closeInfo.addEventListener(

    "click",

    closeModal

);

backInfoBtn.addEventListener(

    "click",

    closeModal

);

/* CLICK OUTSIDE */

infoModal.addEventListener(

    "click",

    (e) => {

        if (

            e.target === infoModal

        ) {

            closeModal();

        }

    }

);

/* ========================= */
/* PROFILE */
/* ========================= */

const profileBtn =
    document.getElementById("profileBtn");

if (profileBtn) {

    profileBtn.addEventListener("click", () => {

        const role =
            localStorage.getItem("role");

        if (role === "doctor") {

            window.location.href =
                "doctor.html";

        }

        else {

            window.location.href =
                "profile.html";

        }

    });

}

/* ========================= */
/* LOGOUT */
/* ========================= */

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

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

        alert("Te-ai delogat!");

        window.location.href =
            "login.html";

    });

}

/* ========================= */
/* AUTH NAVBAR */
/* ========================= */

const authButtons =

    document.getElementById(
        "authButtons"
    );

/* CHECK LOGIN */

const isLoggedIn =

    localStorage.getItem(
        "isLoggedIn"
    );

/* USER LOGGED */

if (

    isLoggedIn === "true"

) {

    authButtons.innerHTML =

        `
        <button id="logoutBtn"
                class="logout-btn">

            <i class="fa-solid fa-right-from-bracket"></i>

            Logout

        </button>
        `;

    /* LOGOUT */

    document.getElementById(

        "logoutBtn"

    ).addEventListener(

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

}

/* USER NOT LOGGED */

else {

    authButtons.innerHTML =

        `
        <button id="loginBtn"
                class="nav-btn">

            <i class="fa-solid fa-right-to-bracket"></i>

            Login

        </button>

        <button id="registerBtn"
                class="nav-btn">

            <i class="fa-solid fa-user-plus"></i>

            Sign Up

        </button>
        `;

    /* LOGIN */

    document.getElementById(

        "loginBtn"

    ).addEventListener(

        "click",

        () => {

            window.location.href =
                "login.html";

        }

    );

    /* REGISTER */

    document.getElementById(

        "registerBtn"

    ).addEventListener(

        "click",

        () => {

            window.location.href =
                "register.html";

        }

    );

}

/* ========================= */
/* FEATURES LOOP */
/* ========================= */

const featuresGrid =
    document.getElementById(
        "featuresGrid"
    );

const featureNextBtn =
    document.getElementById(
        "featureNextBtn"
    );

const featurePrevBtn =
    document.getElementById(
        "featurePrevBtn"
    );

if (

    featuresGrid &&

    featureNextBtn &&

    featurePrevBtn

) {

    const scrollAmount = 350;

    /* NEXT */

    featureNextBtn.addEventListener(

        "click",

        () => {

            /* LAST */

            if (

                featuresGrid.scrollLeft +

                featuresGrid.clientWidth >=

                featuresGrid.scrollWidth - 10

            ) {

                /* LOOP START */

                featuresGrid.scrollTo({

                    left: 0,

                    behavior: "smooth"

                });

            }

            else {

                featuresGrid.scrollBy({

                    left: scrollAmount,

                    behavior: "smooth"

                });

            }

        }

    );

    /* PREV */

    featurePrevBtn.addEventListener(

        "click",

        () => {

            /* FIRST */

            if (

                featuresGrid.scrollLeft <= 0

            ) {

                /* LOOP END */

                featuresGrid.scrollTo({

                    left:
                        featuresGrid.scrollWidth,

                    behavior: "smooth"

                });

            }

            else {

                featuresGrid.scrollBy({

                    left: -scrollAmount,

                    behavior: "smooth"

                });

            }

        }

    );

}

/* ========================= */
/* SPECIALITIES LOOP */
/* ========================= */

const specialitiesGrid =
    document.getElementById(
        "specialitiesGrid"
    );

const nextBtn =
    document.getElementById(
        "nextBtn"
    );

const prevBtn =
    document.getElementById(
        "prevBtn"
    );

if (

    specialitiesGrid &&

    nextBtn &&

    prevBtn

) {

    const specialityScroll = 300;

    /* NEXT */

    nextBtn.addEventListener(

        "click",

        () => {

            if (

                specialitiesGrid.scrollLeft +

                specialitiesGrid.clientWidth >=

                specialitiesGrid.scrollWidth - 10

            ) {

                specialitiesGrid.scrollTo({

                    left: 0,

                    behavior: "smooth"

                });

            }

            else {

                specialitiesGrid.scrollBy({

                    left: specialityScroll,

                    behavior: "smooth"

                });

            }

        }

    );

    /* PREV */

    prevBtn.addEventListener(

        "click",

        () => {

            if (

                specialitiesGrid.scrollLeft <= 0

            ) {

                specialitiesGrid.scrollTo({

                    left:
                        specialitiesGrid.scrollWidth,

                    behavior: "smooth"

                });

            }

            else {

                specialitiesGrid.scrollBy({

                    left: -specialityScroll,

                    behavior: "smooth"

                });

            }

        }

    );

}

/* ========================= */
/* FEATURE ACCESS */
/* ========================= */

const chatCard =
    document.getElementById(
        "chatCard"
    );

const appointmentsCard =
    document.getElementById(
        "appointmentsCard"
    );

const analysisCard =
    document.getElementById(
        "analysisCard"
    );

const videoCard =
    document.getElementById(
        "videoCard"
    );

const doctorCard =
    document.getElementById(
        "doctorCard"
    );

const securityCard =
    document.getElementById(
        "securityCard"
    );

/* LOGIN STATUS */

const userLogged =

    localStorage.getItem(
        "isLoggedIn"
    );

/* ========================= */
/* CHAT */
/* ========================= */

if (chatCard) {

    chatCard.addEventListener(

        "click",

        () => {

            if (

                userLogged === "true"

            ) {

                window.location.href =
                    "chat.html";

            }

            else {

                openInfoModal(

                    "Chat medical",

                    "Discută rapid și sigur cu medicii specialiști direct din aplicație."

                );

            }

        }

    );

}

/* ========================= */
/* APPOINTMENTS */
/* ========================= */

if (appointmentsCard) {

    appointmentsCard.addEventListener(

        "click",

        () => {

            if (

                userLogged === "true"

            ) {

                window.location.href =
                    "appointments.html";

            }

            else {

                openInfoModal(

                    "Programări online",

                    "Programează rapid consultații medicale direct din aplicație. Conectează-te pentru acces complet."

                );

            }

        }

    );

}

/* ========================= */
/* ANALYSES */
/* ========================= */

if (analysisCard) {

    analysisCard.addEventListener(

        "click",

        () => {

            if (

                userLogged === "true"

            ) {

                window.location.href =
                    "analyses.html";

            }

            else {

                openInfoModal(

                    "Rezultate analize",

                    "Vizualizează online rezultatele analizelor medicale în siguranță."

                );

            }

        }

    );

}

/* ========================= */
/* VIDEO */
/* ========================= */

if (videoCard) {

    videoCard.addEventListener(

        "click",

        () => {

            if (

                userLogged === "true"

            ) {

                window.location.href =
                    "video.html";

            }

            else {

                openInfoModal(

                    "Consultații video",

                    "Intră în apel video în timp real cu medicii direct din browser."

                );

            }

        }

    );

}

/* ========================= */
/* DOCTORS */
/* ========================= */

if (doctorCard) {

    doctorCard.addEventListener(

        "click",

        () => {

            window.location.href =
                "doctors.html";

        }

    );

}

/* ========================= */
/* SECURITY */
/* ========================= */

if (securityCard) {

    securityCard.addEventListener(

        "click",

        () => {

            openInfoModal(

                "Securitate",

                "Datele medicale sunt criptate și protejate conform standardelor moderne GDPR."

            );

        }

    );

}

/* ========================= */
/* SPECIALITY REDIRECT */
/* ========================= */

const specialityCards =
    document.querySelectorAll(
        ".speciality-card"
    );

specialityCards.forEach(

    (card) => {

        card.addEventListener(

            "click",

            () => {

                const speciality =

                    card.dataset.speciality;

                /* REDIRECT */

                window.location.href =

                    `doctors.html?speciality=${speciality}`;

            }

        );

    }

);

