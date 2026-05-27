/* FORM */

const registerForm =
    document.getElementById("registerForm");

/* SUBMIT */

registerForm.addEventListener("submit", (e) => {

    e.preventDefault();

    /* VALUES */

    const username =
        document.getElementById("username")
            .value
            .trim();

    const email =
        document.getElementById("email")
            .value
            .trim();

    const password =
        document.getElementById("password")
            .value
            .trim();

    const confirmPassword =
        document.getElementById("confirmPassword")
            .value
            .trim();

    const role =
        document.getElementById("role")
            .value;

    /* EMPTY CHECK */

    if (

        username === "" ||

        email === "" ||

        password === "" ||

        confirmPassword === ""

    ) {

        alert("Completează toate câmpurile!");

        return;
    }

    /* USERNAME */

    if (username.length < 3) {

        alert("Username prea scurt!");

        return;
    }

    /* EMAIL */

    if (!email.includes("@")) {

        alert("Email invalid!");

        return;
    }

    /* PASSWORD */

    if (password.length < 4) {

        alert("Parola trebuie să aibă minim 4 caractere!");

        return;
    }

    /* PASSWORD CHECK */

    if (password !== confirmPassword) {

        alert("Parolele nu coincid!");

        return;
    }

    /* USER */

    const user = {

        username,
        email,
        password,
        role

    };

    /* SAVE */

    localStorage.setItem(

        "chatmedicalUser",

        JSON.stringify(user)

    );

    alert("Cont creat cu succes!");

    /* REDIRECT */

    window.location.href =
        "login.html";

});