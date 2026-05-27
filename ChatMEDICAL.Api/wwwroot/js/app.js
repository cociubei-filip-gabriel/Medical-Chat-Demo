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

/* ========================= */
/* INFINITE MARQUEE SCROLL FUNCTION */
/* ========================= */

function initInfiniteScroll(grid, prevBtn, nextBtn, scrollAmount, speed = 0.5) {
    if (!grid) return;

    // Clone all children for seamless wrapping
    const originalChildren = Array.from(grid.children);
    originalChildren.forEach(child => {
        grid.appendChild(child.cloneNode(true));
    });

    let originalWidth = grid.scrollWidth / 2;

    // Recalculate original width on load and resize
    window.addEventListener("load", () => {
        originalWidth = grid.scrollWidth / 2;
    });

    if (window.ResizeObserver) {
        const ro = new ResizeObserver(() => {
            originalWidth = grid.scrollWidth / 2;
        });
        ro.observe(grid);
    }

    let isHovered = false;
    let scrollTimeout = null;

    function pauseTemporarily() {
        isHovered = true;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isHovered = false;
        }, 1200); // Pause for 1.2s after interaction
    }

    function animate() {
        if (!isHovered) {
            grid.scrollLeft += speed;
            if (grid.scrollLeft >= originalWidth) {
                grid.scrollLeft -= originalWidth;
            }
        }
        requestAnimationFrame(animate);
    }

    // Start linear loop
    animate();

    // Hover / Touch states
    grid.addEventListener("mouseenter", () => { isHovered = true; });
    grid.addEventListener("mouseleave", () => { isHovered = false; });
    grid.addEventListener("touchstart", () => { isHovered = true; });
    grid.addEventListener("touchend", () => { isHovered = false; });

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            pauseTemporarily();
            if (grid.scrollLeft >= originalWidth) {
                grid.scrollLeft -= originalWidth;
            }
            grid.scrollBy({ left: scrollAmount, behavior: "smooth" });
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            pauseTemporarily();
            if (grid.scrollLeft <= 0) {
                grid.scrollLeft += originalWidth;
            }
            grid.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        });
    }
}

// Initialize Loop 1: Features
const featuresGrid = document.getElementById("featuresGrid");
const featureNextBtn = document.getElementById("featureNextBtn");
const featurePrevBtn = document.getElementById("featurePrevBtn");
if (featuresGrid && featureNextBtn && featurePrevBtn) {
    initInfiniteScroll(featuresGrid, featurePrevBtn, featureNextBtn, 350, 0.4); // speed 0.4px per frame (slow & smooth)
}

// Initialize Loop 2: Specialties
const specialitiesGrid = document.getElementById("specialitiesGrid");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
if (specialitiesGrid && nextBtn && prevBtn) {
    initInfiniteScroll(specialitiesGrid, prevBtn, nextBtn, 300, 0.4); // speed 0.4px per frame (slow & smooth)
}

/* ========================= */
/* FEATURE ACCESS (EVENT DELEGATION) */
/* ========================= */
const userLogged = localStorage.getItem("isLoggedIn");

if (featuresGrid) {
    featuresGrid.addEventListener("click", (e) => {
        const card = e.target.closest(".feature-card");
        if (!card) return;

        if (card.id === "chatCard") {
            if (userLogged === "true") window.location.href = "chat.html";
            else openInfoModal("Chat medical", "Discută rapid și sigur cu medicii specialiști direct din aplicație.");
        }
        else if (card.id === "appointmentsCard") {
            if (userLogged === "true") window.location.href = "appointments.html";
            else openInfoModal("Programări online", "Programează rapid consultații medicale direct din aplicație. Conectează-te pentru acces complet.");
        }
        else if (card.id === "analysisCard") {
            if (userLogged === "true") window.location.href = "analyses.html";
            else openInfoModal("Rezultate analize", "Vizualizează online rezultatele analizelor medicale în siguranță.");
        }
        else if (card.id === "videoCard") {
            if (userLogged === "true") window.location.href = "video.html";
            else openInfoModal("Consultații video", "Intră în apel video în timp real cu medicii direct din browser.");
        }
        else if (card.id === "doctorCard") {
            window.location.href = "doctors.html";
        }
        else if (card.id === "securityCard") {
            openInfoModal("Securitate", "Datele medicale sunt criptate și protejate conform standardelor moderne GDPR.");
        }
    });
}

/* ========================= */
/* SPECIALITY REDIRECT (EVENT DELEGATION) */
/* ========================= */
if (specialitiesGrid) {
    specialitiesGrid.addEventListener("click", (e) => {
        const card = e.target.closest(".speciality-card");
        if (!card) return;

        const speciality = card.dataset.speciality;
        if (speciality) {
            window.location.href = `doctors.html?speciality=${speciality}`;
        }
    });
}

