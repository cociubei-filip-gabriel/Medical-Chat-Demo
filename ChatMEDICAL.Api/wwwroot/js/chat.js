import {

    db,
    collection,
    addDoc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp

} from "./firebase.js";

/* ========================= */
/* USER */
/* ========================= */

const currentUser = JSON.parse(

    localStorage.getItem(
        "currentUser"
    )

);

if (!currentUser) {

    window.location.href =
        "login.html";

}

/* ========================= */
/* ELEMENTS */
/* ========================= */

const chatForm =
    document.getElementById(
        "chatForm"
    );

const emojiBtn =

    document.getElementById(
        "emojiBtn"
    );

const attachBtn =

    document.getElementById(
        "attachBtn"
    );

const imageBtn =

    document.getElementById(
        "imageBtn"
    );

const audioBtn =

    document.getElementById(
        "audioBtn"
    );

const fileInput =

    document.getElementById(
        "fileInput"
    );

const imageInput =

    document.getElementById(
        "imageInput"
    );

const messageInput =
    document.getElementById(
        "messageInput"
    );

const chatBox =
    document.getElementById(
        "chatBox"
    );

/* ========================= */
/* EMOJIS */
/* ========================= */

const emojis = [

    "😀",
    "😂",
    "😍",
    "🥰",
    "😎",
    "❤️",
    "👍",
    "🙏",
    "👨‍⚕️",
    "💊",
    "🩺"

];

/* ========================= */
/* EMOJI BUTTON */
/* ========================= */

emojiBtn.addEventListener(

    "click",

    () => {

        const randomEmoji =

            emojis[

            Math.floor(

                Math.random() *
                emojis.length

            )

            ];

        messageInput.value +=
            randomEmoji;

    }

);

/* ========================= */
/* ATTACH BUTTON */
/* ========================= */

attachBtn.addEventListener(

    "click",

    () => {

        fileInput.click();

    }

);
/* ========================= */
/* IMAGE BUTTON */
/* ========================= */

imageBtn.addEventListener(

    "click",

    () => {

        imageInput.click();

    }

);
/* ========================= */
/* FILE SELECT */
/* ========================= */

fileInput.addEventListener(

    "change",

    () => {

        const file =
            fileInput.files[0];

        if (!file) {

            return;

        }

        alert(

            `Fișier selectat:
${file.name}`

        );

    }

);

/* ========================= */
/* IMAGE SELECT */
/* ========================= */

imageInput.addEventListener(

    "change",

    () => {

        const image =
            imageInput.files[0];

        if (!image) {

            return;

        }

        alert(

            `Imagine selectată:
${image.name}`

        );

    }

);

/* ========================= */
/* FORMAT TIME */
/* ========================= */

function formatMessageTime(timestamp) {

    if (!timestamp) {

        return "";
    }

    const date =
        timestamp.toDate();

    const now =
        new Date();

    const yesterday =
        new Date();

    yesterday.setDate(
        now.getDate() - 1
    );

    /* TODAY */

    if (

        date.toDateString() ===
        now.toDateString()

    ) {

        return date.toLocaleTimeString(

            "ro-RO",

            {
                hour: "2-digit",
                minute: "2-digit"
            }

        );

    }

    /* YESTERDAY */

    if (

        date.toDateString() ===
        yesterday.toDateString()

    ) {

        return "Ieri";

    }

    /* OTHER DAY */

    return date.toLocaleDateString(

        "ro-RO",

        {
            day: "2-digit",
            month: "2-digit"
        }

    );

}

/* ========================= */
/* CHAT USER */
/* ========================= */

const otherUser =

    currentUser.role === "doctor"

        ?

        "patient@gmail.com"

        :

        "doctor@gmail.com";

/* ========================= */
/* CHAT ID */
/* ========================= */

const chatId =

    [currentUser.email, otherUser]

        .sort()

        .join("-");

console.log(chatId);

/* ========================= */
/* COLLECTION */
/* ========================= */

const messagesRef =

    collection(

        db,
        "chats",
        chatId,
        "messages"

    );

/* ========================= */
/* QUERY */
/* ========================= */

const q = query(

    messagesRef,

    orderBy("createdAt")

);

/* ========================= */
/* LOAD */
/* ========================= */

onSnapshot(q, (snapshot) => {

    chatBox.innerHTML = "";

    snapshot.forEach((doc) => {

        const data = doc.data();

        const message =
            document.createElement(
                "div"
            );

        message.classList.add(
            "message"
        );

        if (

            data.sender ===
            currentUser.email

        ) {

            message.classList.add(
                "my-message"
            );

        }

        else {

            message.classList.add(
                "other-message"
            );

        }
        message.innerHTML = `

<div class="message-text">

    ${data.text}

</div>

<div class="message-time">

    ${formatMessageTime(data.createdAt)}

</div>

`;


        chatBox.appendChild(
            message
        );

        chatBox.scrollTop =
            chatBox.scrollHeight;

    });

});

/* ========================= */
/* SEND */
/* ========================= */

chatForm.addEventListener(

    "submit",

    async (e) => {

        e.preventDefault();

        const text =
            messageInput.value.trim();

        if (!text) {

            return;

        }

        await addDoc(

            messagesRef,

            {

                text:
                    text,

                sender:
                    currentUser.email,


                receiver:
                    otherUser,

                createdAt:
                    serverTimestamp()

            }

        );

        localStorage.setItem(

            "newMessage",

            "true"

        );

        messageInput.value = "";

    }

);