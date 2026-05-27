/* ========================= */
/* URL SPECIALITY FILTER */
/* ========================= */

const params =

    new URLSearchParams(
        window.location.search
    );

const selectedSpeciality =

    params.get(
        "speciality"
    );

/* DOCTOR CARDS */

const doctorCards =
    document.querySelectorAll(
        ".doctor-card"
    );

/* FILTER */

if (

    selectedSpeciality

) {

    doctorCards.forEach(

        (card) => {

            const speciality =

                card.dataset.speciality;

            if (

                speciality !==
                selectedSpeciality

            ) {

                card.style.display =
                    "none";

            }

        }

    );

}

/* ========================= */
/* PROFILE BUTTON */
/* ========================= */

const profileButtons =
    document.querySelectorAll(
        ".profile-btn"
    );

/* CLICK */

profileButtons.forEach((button) => {

    button.addEventListener(

        "click",

        () => {

            alert(

                "Deschidere profil doctor 👨‍⚕️"

            );

        }

    );

});

/* ========================= */
/* APPOINTMENT */
/* ========================= */

const appointmentButtons =
    document.querySelectorAll(
        ".appointment-btn"
    );

appointmentButtons.forEach((button) => {

    button.addEventListener(

        "click",

        () => {

            /* SAVE SELECTED DOCTOR */

            localStorage.setItem(

                "selectedDoctor",

                "doctor@gmail.com"

            );

            /* REDIRECT */

            window.location.href =
                "chat.html";

        }

    );

});



/* ========================= */
/* FILTER SYSTEM */
/* ========================= */

const searchDoctor =

    document.getElementById(
        "searchDoctor"
    );

const specialityFilter =

    document.getElementById(
        "specialityFilter"
    );

const ratingFilter =

    document.getElementById(
        "ratingFilter"
    );


/* FILTER FUNCTION */

function filterDoctors() {

    const searchValue =

        searchDoctor.value
            .toLowerCase();

    const specialityValue =

        specialityFilter.value
            .toLowerCase();

    const ratingValue =

        ratingFilter.value
            .toLowerCase();

    doctorCards.forEach(card => {

        const doctorName =

            card.dataset.name
                .toLowerCase();

        const speciality =

            card.dataset.speciality
                .toLowerCase();

        const ratingText =

            card.innerText
                .toLowerCase();

        /* SEARCH */

        const matchSearch =

            doctorName.includes(
                searchValue
            )

            ||

            speciality.includes(
                searchValue
            );

        /* SPECIALITY */

        const matchSpeciality =

            specialityValue === ""

            ||

            speciality.includes(
                specialityValue
            );

        /* RATING */

        let matchRating = true;

        /* 5 STELE */

        if (

            ratingValue ===
            "5 stele"

        ) {

            matchRating =

                ratingText.includes(
                    "5.0"
                );

        }

        /* 4+ STELE */

        if (

            ratingValue ===
            "4+ stele"

        ) {

            matchRating =

                ratingText.includes(
                    "4."
                );

        }

        /* SHOW */

        if (

            matchSearch

            &&

            matchSpeciality

            &&

            matchRating

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

/* EVENTS */

searchDoctor.addEventListener(

    "input",

    filterDoctors

);

specialityFilter.addEventListener(

    "change",

    filterDoctors

);

ratingFilter.addEventListener(

    "change",

    filterDoctors

);

// Specialty chips dynamic filtering integration
const specialityChips = document.getElementById("specialityChips");
if (specialityChips && specialityFilter) {
    const chips = specialityChips.querySelectorAll(".chip");
    chips.forEach(chip => {
        chip.addEventListener("click", () => {
            chips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            
            const value = chip.getAttribute("data-value");
            if (value === "") {
                specialityFilter.value = "";
            } else {
                const options = specialityFilter.options;
                for (let i = 0; i < options.length; i++) {
                    if (options[i].text.toLowerCase() === value.toLowerCase()) {
                        specialityFilter.selectedIndex = i;
                        break;
                    }
                }
            }
            filterDoctors();
        });
    });
}


