const buttons =

    document.querySelectorAll(
        ".recommendation-card button"
    );

buttons.forEach((button) => {

    button.addEventListener(

        "click",

        () => {

            const textarea =

                button.parentElement
                    .querySelector("textarea");

            const text =
                textarea.value.trim();

            if (!text) {

                alert(
                    "Scrie o recomandare 👨‍⚕️"
                );

                return;

            }

            alert(
                "Recomandarea a fost salvată ✅"
            );

        }

    );

});