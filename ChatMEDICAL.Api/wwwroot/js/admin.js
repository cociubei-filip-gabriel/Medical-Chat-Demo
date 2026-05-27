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

    alert("Te-ai delogat!");

    window.location.href =
        "login.html";

});

/* ========================= */
/* SIDEBAR ACTIVE */
/* ========================= */

const sidebarLinks =
    document.querySelectorAll(".sidebar-links a");

/* ACTIVE */

sidebarLinks.forEach(link => {

    link.addEventListener("click", () => {

        sidebarLinks.forEach(item => {

            item.classList.remove("active");

        });

        link.classList.add("active");

    });

});

/* ========================= */
/* QUICK ACTIONS */
/* ========================= */

const actionButtons =
    document.querySelectorAll(".actions-grid button");

/* CLICK */

actionButtons.forEach(button => {

    button.addEventListener("click", () => {

        const text =
            button.textContent.trim();

        alert(

            text +
            " deschis!"

        );

    });

});

/* ========================= */
/* TABLE ROWS */
/* ========================= */

const tableRows =
    document.querySelectorAll(".table-row");

/* EFFECT */

tableRows.forEach(row => {

    row.addEventListener("click", () => {

        tableRows.forEach(item => {

            item.classList.remove(
                "active-row"
            );

        });

        row.classList.add(
            "active-row"
        );

    });

});

/* ========================= */
/* ICON BUTTONS */
/* ========================= */

const topbarButtons =
    document.querySelectorAll(".icon-btn");

/* EFFECT */

topbarButtons.forEach(button => {

    button.addEventListener("click", () => {

        button.classList.add(
            "clicked-btn"
        );

        setTimeout(() => {

            button.classList.remove(
                "clicked-btn"
            );

        }, 300);

    });

});

/* ========================= */
/* WELCOME */
/* ========================= */

window.addEventListener("load", () => {

    setTimeout(() => {

        alert(

            "Bun venit în Admin Dashboard 👑"

        );

    }, 500);

});

/* ========================= */
/* CONSOLE */
/* ========================= */

console.log(

    "Admin dashboard loaded successfully 💙"

);