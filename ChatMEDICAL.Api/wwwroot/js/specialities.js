/* ========================= */
/* SEARCH SPECIALITY */
/* ========================= */

const searchSpeciality =

    document.getElementById(
        "searchSpeciality"
    );

const specialityCards =

    document.querySelectorAll(
        ".speciality-card"
    );

/* SEARCH */

searchSpeciality.addEventListener(

    "input",

    () => {

        const value =

            searchSpeciality.value
                .toLowerCase();

        specialityCards.forEach(card => {

            const specialityName =

                card.dataset.name
                    .toLowerCase();

            /* MATCH */

            if (

                specialityName.includes(
                    value
                )

            ) {

                card.style.display =
                    "block";

            }

            else {

                card.style.display =
                    "none";

            }

        });

    }

);

console.log(

    "Specialities loaded 🩺"

);