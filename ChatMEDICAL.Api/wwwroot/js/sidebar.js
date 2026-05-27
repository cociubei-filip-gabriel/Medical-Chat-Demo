/* ========================= */
/* REALTIME NOTIFICATIONS */
/* ========================= */

import {

    db,
    collection,
    query,
    where,
    onSnapshot

}

    from "./firebase.js";


/* ========================= */
/* THEME SYSTEM (DARK/LIGHT) */
/* ========================= */

// Dynamically inject theme.css if not already present
if (!document.querySelector('link[href*="theme.css"]')) {
    const themeLink = document.createElement("link");
    themeLink.rel = "stylesheet";
    themeLink.href = "css/theme.css";
    document.head.appendChild(themeLink);
}

// Load theme from localStorage or system preference
const savedTheme = localStorage.getItem("theme") || 
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

document.documentElement.setAttribute("data-theme", savedTheme);

window.updateThemeToggleButton = function() {
    const themeBtn = document.getElementById("themeToggleBtn");
    const sidebarThemeBtn = document.getElementById("sidebarThemeToggleBtn");
    const currentTheme = document.documentElement.getAttribute("data-theme");
    
    const iconClass = currentTheme === "dark" ? "fa-sun" : "fa-moon";
    const textLabel = currentTheme === "dark" ? "Mod Luminos" : "Mod Întunecat";
    
    if (themeBtn) {
        themeBtn.innerHTML = `<i class="fa-regular ${iconClass}"></i>`;
    }
    if (sidebarThemeBtn) {
        sidebarThemeBtn.innerHTML = `<i class="fa-regular ${iconClass}"></i><span>${textLabel}</span>`;
    }
}

window.toggleTheme = function() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    window.updateThemeToggleButton();
}

/* ========================= */
/* CURRENT USER */
/* ========================= */

const currentUser = JSON.parse(

    localStorage.getItem(
        "currentUser"
    )

);

/* ========================= */
/* SIDEBAR */
/* ========================= */

const sideLinks =
    document.getElementById(
        "sideLinks"
    );

/* NO SIDEBAR */

if (!sideLinks) {

    console.log(
        "Sidebar not found"
    );

}

/* NO USER */

else if (!currentUser) {

    sideLinks.innerHTML = `
    <a href="index.html"><i class="fa-solid fa-house"></i>Acasă</a>
    <a href="doctors.html"><i class="fa-solid fa-user-doctor"></i>Doctori</a>
    <a href="specialities.html"><i class="fa-solid fa-stethoscope"></i>Specialități</a>
    <a href="login.html"><i class="fa-solid fa-right-to-bracket"></i>Login</a>
    <a href="register.html"><i class="fa-solid fa-user-plus"></i>Register</a>
    `;

}

/* ========================= */
/* PATIENT */
/* ========================= */

else if (

    currentUser.role === "patient"

    ||

    !currentUser.role

) {

    sideLinks.innerHTML = `
    <a href="index.html"><i class="fa-solid fa-house"></i>Acasă</a>
    <a href="doctors.html"><i class="fa-solid fa-user-doctor"></i>Doctori</a>
    <a href="specialities.html"><i class="fa-solid fa-stethoscope"></i>Specialități</a>
    <a href="appointments.html"><i class="fa-solid fa-calendar-check"></i>Programări</a>
    <a href="analyses.html"><i class="fa-solid fa-file-waveform"></i>Analize</a>
    <a href="chat.html"><i class="fa-solid fa-comments"></i>Chat</a>
    <a href="settings.html"><i class="fa-solid fa-gear"></i>Setări</a>
    `;

}

/* ========================= */
/* DOCTOR */
/* ========================= */

else if (

    currentUser.role ===
    "doctor"

) {

    sideLinks.innerHTML = `
    <a href="doctor.html"><i class="fa-solid fa-chart-line"></i>Dashboard</a>
    <a href="patients.html"><i class="fa-solid fa-user-group"></i>Pacienți</a>
    <a href="appointments.html"><i class="fa-solid fa-calendar-check"></i>Programări</a>
    <a href="#" id="sidebarChatBtn"><i class="fa-solid fa-comments"></i>Mesaje</a>
    <a href="settings.html"><i class="fa-solid fa-gear"></i>Setări</a>
    `;

}

/* ========================= */
/* ADMIN */
/* ========================= */

else if (

    currentUser.role ===
    "admin"

) {

    sideLinks.innerHTML = `
    <a href="index.html"><i class="fa-solid fa-house"></i>Acasă</a>
    <a href="admin.html"><i class="fa-solid fa-chart-line"></i>Admin Panel</a>
    <a href="settings.html"><i class="fa-solid fa-gear"></i>Setări</a>
    `;

}

/* ========================= */
/* ACTIVE LINK */
/* ========================= */

const links =
    sideLinks.querySelectorAll(
        "a"
    );

/* CURRENT PAGE */

const currentPage =
    window.location.pathname
        .split("/")
        .pop();

/* LOOP */

links.forEach(link => {

    const href =
        link.getAttribute(
            "href"
        );

    if (

        href === currentPage

    ) {

        link.classList.add(
            "active"
        );

    }

});

// Append theme button to sidebar if sideLinks exists
if (sideLinks) {
    const sidebarThemeLink = document.createElement("a");
    sidebarThemeLink.href = "#";
    sidebarThemeLink.id = "sidebarThemeToggleBtn";
    sidebarThemeLink.style.marginTop = "20px";
    sidebarThemeLink.style.borderTop = "1px solid var(--border-color)";
    sidebarThemeLink.style.paddingTop = "15px";
    sidebarThemeLink.style.borderRadius = "0";
    sidebarThemeLink.innerHTML = `<i class="fa-regular fa-moon"></i><span>Mod Întunecat</span>`;
    sideLinks.appendChild(sidebarThemeLink);
}

// Bind theme toggle events
document.addEventListener("DOMContentLoaded", () => {
    window.updateThemeToggleButton();
    
    const themeBtn = document.getElementById("themeToggleBtn");
    const sidebarThemeBtn = document.getElementById("sidebarThemeToggleBtn");
    
    if (themeBtn) {
        themeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            window.toggleTheme();
        });
    }
    
    if (sidebarThemeBtn) {
        sidebarThemeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            window.toggleTheme();
        });
    }
});

// Run immediate update
window.updateThemeToggleButton();
/* ========================= */
/* MENU OPEN/CLOSE */
/* ========================= */

const menuBtn =
    document.getElementById(
        "menuBtn"
    );

const closeMenu =
    document.getElementById(
        "closeMenu"
    );

const sideMenu =
    document.getElementById(
        "sideMenu"
    );

const overlay =
    document.getElementById(
        "overlay"
    );

if (
    menuBtn &&
    closeMenu &&
    sideMenu &&
    overlay
) {

    menuBtn.addEventListener(
        "click",
        () => {

            sideMenu.classList.add(
                "active"
            );

            overlay.classList.add(
                "active"
            );

        }
    );

    closeMenu.addEventListener(
        "click",
        () => {

            sideMenu.classList.remove(
                "active"
            );

            overlay.classList.remove(
                "active"
            );

        }
    );

    overlay.addEventListener(
        "click",
        () => {

            sideMenu.classList.remove(
                "active"
            );

            overlay.classList.remove(
                "active"
            );

        }
    );

}

/* ========================= */
/* FOOTER SUBMENU */
/* ========================= */

const footerItems =
    document.querySelectorAll(
        ".footer-item"
    );

footerItems.forEach(item => {

    item.addEventListener(
        "click",
        () => {

            const submenu =
                item.nextElementSibling;

            submenu.classList.toggle(
                "show"
            );

        }
    );

});


/* ========================= */
/* NOTIFICATIONS */
/* ========================= */

const notificationBtn =
    document.getElementById(
        "notificationBtn"
    );

if (notificationBtn) {

    notificationBtn.addEventListener(

        "click",

        () => {

            window.location.href =
                "notifications.html";

        }

    );

}



/* ELEMENTS */

const notificationCount =
    document.getElementById(
        "notificationCount"
    );

const notificationSound =
    document.getElementById(
        "notificationSound"
    );

/* LAST COUNT */

let lastNotificationCount = 0;

/* USER CHECK */

if (

    currentUser &&
    notificationCount

) {

    const q = query(

        collection(
            db,
            "notifications"
        ),

        where(
            "userEmail",
            "==",
            currentUser.email
        )

    );

    /* REALTIME */

    onSnapshot(

        q,

        snapshot => {

            const count =
                snapshot.size;

            /* UPDATE UI */

            notificationCount.innerText =
                count;

            /* SOUND */

            if (

                count >
                lastNotificationCount

            ) {

                notificationSound.play();

            }

            lastNotificationCount =
                count;

        }

    );

}


/* ========================= */
/* SEARCH SYSTEM */
/* ========================= */

const searchBtn =
    document.getElementById(
        "searchBtn"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

if (
    searchBtn &&
    searchInput
) {



    /* ========================= */
    /* SEARCH MODAL */
    /* ========================= */


    const searchModal =
        document.getElementById(
            "searchModal"
        );

    const closeSearch =
        document.getElementById(
            "closeSearch"
        );

    /* OPEN */

    if (
        searchBtn &&
        searchModal
    ) {

        searchBtn.addEventListener(
            "click",
            () => {

                searchModal.classList.add(
                    "active"
                );

                searchInput.focus();

            }
        );

    }

    /* CLOSE */

    if (
        closeSearch
    ) {

        closeSearch.addEventListener(
            "click",
            () => {

                searchModal.classList.remove(
                    "active"
                );

            }
        );

    }

    if (
        searchModal
    ) {

        searchModal.addEventListener(
            "click",
            (e) => {

                if (e.target === searchModal) {

                    searchModal.classList.remove(
                        "active"
                    );

                }

            }
        );

    }
    /* SEARCH */


    /* SEARCH */

    searchInput.addEventListener(

        "keydown",

        (e) => {

            if (

                e.key === "Enter"

            ) {

                const value =

                    searchInput.value
                        .toLowerCase();

                /* CARDIO */

                if (

                    value.includes(
                        "cardio"
                    )

                ) {

                    window.location.href =

                        "doctors.html?speciality=cardiologie";

                }

                /* NEURO */

                else if (

                    value.includes(
                        "neuro"
                    )

                ) {

                    window.location.href =

                        "doctors.html?speciality=neurologie";

                }

                /* ORL */

                else if (

                    value.includes(
                        "orl"
                    )

                ) {

                    window.location.href =

                        "doctors.html?speciality=orl";

                }

                /* DERMATO */

                else if (

                    value.includes(
                        "derma"
                    )

                ) {

                    window.location.href =

                        "doctors.html?speciality=dermatologie";

                }

                /* DOCTOR */

                else if (

                    value.includes(
                        "doctor"
                    )

                ) {

                    window.location.href =

                        "doctors.html";

                }

                else {

                    alert(

                        "Nu s-au găsit rezultate."

                    );

                }

            }

        }

    );

}

