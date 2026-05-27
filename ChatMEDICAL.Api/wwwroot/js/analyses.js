/* ========================= */
/* UPLOAD */
/* ========================= */

const analysisUpload =
    document.getElementById(
        "analysisUpload"
    );

/* CHANGE */

analysisUpload.addEventListener(

    "change",

    (e) => {

        const file =
            e.target.files[0];

        /* NO FILE */

        if (!file) {

            return;
        }

        /* FILE TYPE */

        const allowedTypes = [

            "application/pdf",

            "image/png",

            "image/jpeg"

        ];

        if (

            !allowedTypes.includes(
                file.type
            )

        ) {

            alert(

                "Poți încărca doar PDF sau imagini!"

            );

            return;
        }

        /* SIZE */

        if (file.size > 5000000) {

            alert(

                "Fișierul este prea mare!"

            );

            return;
        }

        /* SUCCESS */

        alert(

            "Analiză adăugată cu succes ✅"

        );

    }

);

/* ========================= */
/* FILTERS */
/* ========================= */

const specializationFilter =
    document.getElementById(
        "specializationFilter"
    );

const doctorFilter =
    document.getElementById(
        "doctorFilter"
    );

const periodFilter =
    document.getElementById(
        "periodFilter"
    );

/* CHANGE */

specializationFilter.addEventListener(

    "change",

    () => {

        console.log(

            "Filtrare specializare"

        );

    }

);

doctorFilter.addEventListener(

    "change",

    () => {

        console.log(

            "Filtrare doctor"

        );

    }

);

periodFilter.addEventListener(

    "change",

    () => {

        console.log(

            "Filtrare perioadă"

        );

    }

);

/* ========================= */
/* BUTTONS */
/* ========================= */

const viewButtons =
    document.querySelectorAll(
        ".view-btn"
    );

const downloadButtons =
    document.querySelectorAll(
        ".download-btn"
    );

/* VIEW */

viewButtons.forEach((button) => {

    button.addEventListener(

        "click",

        () => {

            alert(

                "Deschidere analiză 🧪"

            );

        }

    );

});

/* DOWNLOAD */

downloadButtons.forEach((button) => {

    button.addEventListener(

        "click",

        () => {

            alert(

                "Descărcare analiză ⬇️"

            );

        }

    );

});

/* ========================= */
/* SEARCH */
/* ========================= */

const searchInput =
    document.querySelector(
        ".search-box input"
    );

searchInput.addEventListener(

    "input",

    () => {

        console.log(

            "Căutare analiză..."

        );

    }

);

console.log(

    "Analyses page loaded 💙"

);