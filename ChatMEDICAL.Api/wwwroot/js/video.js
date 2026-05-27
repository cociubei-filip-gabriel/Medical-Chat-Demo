
import {

    db,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp

}


    from "./firebase.js";

/* ========================= */
/* ELEMENTS */
/* ========================= */

const localVideo =
    document.getElementById(
        "localVideo"
    );

const remoteVideo =
    document.getElementById(
        "remoteVideo"
    );

const startCameraBtn =
    document.getElementById(
        "startCameraBtn"
    );

const toggleMicBtn =
    document.getElementById(
        "toggleMicBtn"
    );

const joinCallBtn =
    document.getElementById(
        "joinCallBtn"
    );

const endCallBtn =
    document.getElementById(
        "endCallBtn"
    );

const backBtn =
    document.getElementById(
        "backBtn"
    );

/* ========================= */
/* VARIABLES */
/* ========================= */

let localStream;

let remoteStream;

let micEnabled = true;

/* ========================= */
/* PEER */
/* ========================= */

const peerConnection =

    new RTCPeerConnection({

        iceServers: [

            {

                urls:
                    "stun:stun.l.google.com:19302"

            }

        ]

    });

/* ========================= */
/* START CAMERA */
/* ========================= */

startCameraBtn.addEventListener(

    "click",

    async () => {

        localStream =

            await navigator.mediaDevices
                .getUserMedia({

                    video: true,

                    audio: true

                });

        remoteStream =
            new MediaStream();

        /* LOCAL */

        localVideo.srcObject =
            localStream;

        /* TRACKS */

        localStream.getTracks()
            .forEach(track => {

                peerConnection.addTrack(

                    track,

                    localStream

                );

            });

        /* REMOTE */

        peerConnection.ontrack =
            event => {

                event.streams[0]
                    .getTracks()
                    .forEach(track => {

                        remoteStream.addTrack(
                            track
                        );

                    });

            };

        remoteVideo.srcObject =
            remoteStream;

    }

);

/* ========================= */
/* MICROPHONE */
/* ========================= */

toggleMicBtn.addEventListener(

    "click",

    () => {

        localStream
            .getAudioTracks()
            .forEach(track => {

                track.enabled =
                    !track.enabled;

                micEnabled =
                    track.enabled;

            });

    }

);

/* ========================= */
/* CALL */
/* ========================= */

joinCallBtn.addEventListener(

    "click",

    async () => {

        const callDoc =
            doc(db, "calls", "medical-room");

        /* OFFER */

        const offerDescription =

            await peerConnection
                .createOffer();

        await peerConnection
            .setLocalDescription(
                offerDescription
            );

        const offer = {

            sdp:
                offerDescription.sdp,

            type:
                offerDescription.type

        };

        await setDoc(

            callDoc,

            {

                offer

            }

        );

        /* ANSWER */

        onSnapshot(

            callDoc,

            async snapshot => {

                const data =
                    snapshot.data();

                if (

                    !peerConnection
                        .currentRemoteDescription

                    &&

                    data?.answer

                ) {

                    const answerDescription =

                        new RTCSessionDescription(
                            data.answer
                        );

                    await peerConnection
                        .setRemoteDescription(
                            answerDescription
                        );

                }

            }

        );

    }

);

/* ========================= */
/* ICE */
/* ========================= */

peerConnection.onicecandidate =

    async event => {

        if (

            event.candidate

        ) {

            console.log(
                event.candidate
            );

        }

    };

/* ========================= */
/* END CALL */
/* ========================= */

endCallBtn.addEventListener(

    "click",

    () => {

        peerConnection.close();

        localVideo.srcObject =
            null;

        remoteVideo.srcObject =
            null;

    }

);

/* ========================= */
/* BACK */
/* ========================= */

backBtn.addEventListener(

    "click",

    () => {

        window.location.href =
            "index.html";

    }

);

/* ========================= */
/* CHAT */
/* ========================= */

const messagesDiv =
    document.getElementById(
        "messages"
    );

const messageInput =
    document.getElementById(
        "messageInput"
    );

const sendMessageBtn =
    document.getElementById(
        "sendMessageBtn"
    );

/* SEND */

sendMessageBtn.addEventListener(

    "click",

    async () => {

        const text =
            messageInput.value;

        if (

            text.trim() === ""

        ) {

            return;

        }

        await addDoc(

            collection(
                db,
                "videoChat"
            ),

            {

                text,

                createdAt:
                    serverTimestamp()

            }

        );

        messageInput.value = "";

    }

);

/* REALTIME */

const q = query(

    collection(
        db,
        "videoChat"
    ),

    orderBy(
        "createdAt"
    )

);

onSnapshot(

    q,

    snapshot => {

        messagesDiv.innerHTML = "";

        snapshot.forEach(doc => {

            const data =
                doc.data();

            messagesDiv.innerHTML += `

                <div class="message">

                    ${data.text}

                </div>

            `;

        });

        messagesDiv.scrollTop =
            messagesDiv.scrollHeight;

    }

);

/* ========================= */
/* RECORDING */
/* ========================= */

const recordBtn =
    document.getElementById(
        "recordBtn"
    );

const stopRecordBtn =
    document.getElementById(
        "stopRecordBtn"
    );

let mediaRecorder;

let recordedChunks = [];

/* START */

recordBtn.addEventListener(

    "click",

    () => {

        mediaRecorder =

            new MediaRecorder(
                localStream
            );

        recordedChunks = [];

        mediaRecorder.ondataavailable =
            event => {

                if (

                    event.data.size > 0

                ) {

                    recordedChunks.push(
                        event.data
                    );

                }

            };

        mediaRecorder.onstop =
            () => {

                const blob =

                    new Blob(

                        recordedChunks,

                        {

                            type:
                                "video/webm"

                        }

                    );

                const url =
                    URL.createObjectURL(
                        blob
                    );

                const a =
                    document.createElement(
                        "a"
                    );

                a.href = url;

                a.download =
                    "consultatie.webm";

                a.click();

            };

        mediaRecorder.start();

        alert(
            "Recording pornit 🎥"
        );

    }

);

/* STOP */

stopRecordBtn.addEventListener(

    "click",

    () => {

        mediaRecorder.stop();

        alert(
            "Recording oprit ✅"
        );

    }

);