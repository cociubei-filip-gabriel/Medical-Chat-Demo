/* FORM */

const loginForm =
    document.getElementById(
        "loginForm"
    );

/* SUBMIT */

loginForm.addEventListener(

    "submit",

    (e) => {

        e.preventDefault();

        /* VALUES */

        const email =
            document.getElementById(
                "email"
            ).value.trim();

        const password =
            document.getElementById(
                "password"
            ).value.trim();

        /* EMPTY CHECK */

        if (

            email === "" ||

            password === ""

        ) {

            alert(

                "Completează toate câmpurile!"

            );

            return;
        }

        /* EMAIL CHECK */

        if (

            !email.includes("@")

        ) {

            alert(

                "Email invalid!"

            );

            return;
        }

        /* PASSWORD */

        if (

            password.length < 4

        ) {

            alert(

                "Parola este prea scurtă!"

            );

            return;
        }

        /* ADMIN */

        if (

            email ===
            "admin@chatmedical.ro"

            &&

            password ===
            "admin123"

        ) {

            /* ADMIN USER */

            const adminUser = {

                email:
                    email,

                role:
                    "admin"

            };

            /* SAVE */

            localStorage.setItem(

                "currentUser",

                JSON.stringify(
                    adminUser
                )

            );

            localStorage.setItem(

                "isLoggedIn",

                "true"

            );

            alert(

                "Admin login reușit!"

            );

            window.location.href =
                "admin.html";

            return;

        }

        /* GET USER */

        const savedUser = JSON.parse(

            localStorage.getItem(
                "chatmedicalUser"
            )

        );

        /* NO ACCOUNT */

        if (!savedUser) {

            alert(

                "Nu există cont!"

            );

            return;
        }

        /* LOGIN */

        if (

            email ===
            savedUser.email

            &&

            password ===
            savedUser.password

        ) {

            /* CURRENT USER */

            const currentUser = {

                email:
                    savedUser.email,

                username:
                    savedUser.username,

                role:
                    savedUser.role

            };

            /* SAVE */

            localStorage.setItem(

                "currentUser",

                JSON.stringify(
                    currentUser
                )

            );

            localStorage.setItem(

                "isLoggedIn",

                "true"

            );

            /* ROLE */

            localStorage.setItem(

                "role",

                savedUser.role

            );

            alert(

                "Login reușit!"

            );

            /* REDIRECT */

            if (

                savedUser.role ===
                "doctor"

            ) {

                window.location.href =
                    "doctor.html";

            }

            else {

                window.location.href =
                    "index.html";

            }

        }

        else {

            alert(

                "Email sau parolă greșită!"

            );

        }

    }

);