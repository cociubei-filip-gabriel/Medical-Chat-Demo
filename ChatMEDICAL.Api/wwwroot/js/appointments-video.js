import {

    db,
    collection,
    addDoc,
    serverTimestamp

}

    from "./firebase.js";

const saveAppointmentBtn =
    document.getElementById(
        "saveAppointmentBtn"
    );

saveAppointmentBtn.addEventListener(

    "click",

    async () => {

        const date =
            document.getElementById(
                "appointmentDate"
            ).value;

        const time =
            document.getElementById(
                "appointmentTime"
            ).value;

        await addDoc(

            collection(
                db,
                "videoAppointments"
            ),

            {

                date,

                time,

                createdAt:
                    serverTimestamp()

            }

        );

        alert(
            "Programare salvată ✅"
        );

    }

);

await addDoc(

    collection(
        db,
        "notifications"
    ),

    {

        userEmail:
            "pacient@gmail.com",

        title:
            "Programare acceptată",

        message:
            "Consultația video a fost acceptată de doctor.",

        type:
            "appointment",

        read:
            false,

        createdAt:
            serverTimestamp()

    }

);

await addDoc(

    collection(
        db,
        "notifications"
    ),

    {

        userEmail:
            "doctor@gmail.com",

        title:
            "Mesaj nou",

        message:
            "Ai primit un mesaj nou în chat.",

        type:
            "chat",

        read:
            false,

        createdAt:
            serverTimestamp()

    }

);

await addDoc(

    collection(
        db,
        "notifications"
    ),

    {

        userEmail:
            "doctor@gmail.com",

        title:
            "Consultație video",

        message:
            "Pacientul a intrat în apel.",

        type:
            "video",

        read:
            false,

        createdAt:
            serverTimestamp()

    }

);