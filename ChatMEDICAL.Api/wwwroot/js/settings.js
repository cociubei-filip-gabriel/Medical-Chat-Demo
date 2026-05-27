/* ========================= */
/* NOTIFICATIONS */
/* ========================= */

const notificationsToggle =
    document.getElementById(
        "notificationsToggle"
    );

/* LOAD */

const savedNotifications =
    localStorage.getItem(
        "notifications"
    );

if (savedNotifications === "true") {

    notificationsToggle.checked = true;
}

/* CHANGE */

notificationsToggle.addEventListener(

    "change",

    () => {

        localStorage.setItem(

            "notifications",

            notificationsToggle.checked

        );

    }

);

/* ========================= */
/* DARK MODE */
/* ========================= */

const darkModeToggle =
    document.getElementById(
        "darkModeToggle"
    );

/* LOAD */

const darkMode =
    localStorage.getItem(
        "darkMode"
    );

if (darkMode === "true") {

    document.body.classList.add(
        "dark-mode"
    );

    darkModeToggle.checked = true;
}

/* CHANGE */

darkModeToggle.addEventListener(

    "change",

    () => {

        document.body.classList.toggle(
            "dark-mode"
        );

        localStorage.setItem(

            "darkMode",

            darkModeToggle.checked

        );

    }

);

/* ========================= */
/* LANGUAGE */
/* ========================= */

const languageSelect =
    document.getElementById(
        "languageSelect"
    );

/* LOAD */

const savedLanguage =
    localStorage.getItem(
        "language"
    );

if (savedLanguage) {

    languageSelect.value =
        savedLanguage;
}

/* CHANGE */

languageSelect.addEventListener(

    "change",

    () => {

        localStorage.setItem(

            "language",

            languageSelect.value

        );

        alert(

            "Limbă salvată 🌍"

        );

    }

);

/* ========================= */
/* PASSWORD */
/* ========================= */

const savePasswordBtn =
    document.getElementById(
        "savePasswordBtn"
    );

/* SAVE */

savePasswordBtn.addEventListener(

    "click",

    () => {

        const newPassword =
            document.getElementById(
                "newPassword"
            ).value.trim();

        /* EMPTY */

        if (newPassword === "") {

            alert(

                "Introdu parola!"

            );

            return;
        }

        /* LENGTH */

        if (newPassword.length < 4) {

            alert(

                "Parola prea scurtă!"

            );

            return;
        }

        alert(

            "Parolă schimbată ✅"

        );

    }

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

        alert(

            "Te-ai delogat!"

        );

        window.location.href =
            "login.html";

    }

);

console.log(

    "Settings loaded ⚙️"

);