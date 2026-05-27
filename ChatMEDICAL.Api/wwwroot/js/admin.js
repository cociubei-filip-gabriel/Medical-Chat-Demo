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

// Append theme button to admin sidebar links
const sidebarContainer = document.querySelector(".sidebar-links");
if (sidebarContainer) {
    const adminThemeLink = document.createElement("a");
    adminThemeLink.href = "#";
    adminThemeLink.id = "sidebarThemeToggleBtn";
    adminThemeLink.style.marginTop = "20px";
    adminThemeLink.style.borderTop = "1px solid var(--border-color)";
    adminThemeLink.style.paddingTop = "15px";
    adminThemeLink.style.borderRadius = "0";
    adminThemeLink.innerHTML = `<i class="fa-regular fa-moon"></i><span>Mod Întunecat</span>`;
    sidebarContainer.appendChild(adminThemeLink);
}

// Add the standard theme toggling logic
window.updateThemeToggleButton = function() {
    const sidebarThemeBtn = document.getElementById("sidebarThemeToggleBtn");
    const currentTheme = document.documentElement.getAttribute("data-theme");
    
    const iconClass = currentTheme === "dark" ? "fa-sun" : "fa-moon";
    const textLabel = currentTheme === "dark" ? "Mod Luminos" : "Mod Întunecat";
    
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

if (sidebarContainer) {
    const sidebarThemeBtn = document.getElementById("sidebarThemeToggleBtn");
    if (sidebarThemeBtn) {
        sidebarThemeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            window.toggleTheme();
        });
    }
}

window.updateThemeToggleButton();