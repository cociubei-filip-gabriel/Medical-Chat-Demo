import { initializeApp }

    from

    "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

import {

    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    doc,
    setDoc,
    where,
    updateDoc

}

    from

    "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

/* ========================= */
/* FIREBASE CONFIG */
/* ========================= */

const firebaseConfig = {

    apiKey:
        "AIzaSyDooyZeUHMY_PQsTQvLcsKs2_eLmX-KwxY",

    authDomain:
        "chatmedical-a68a4.firebaseapp.com",

    projectId:
        "chatmedical-a68a4",

    storageBucket:
        "chatmedical-a68a4.firebasestorage.app",

    messagingSenderId:
        "898480535614",

    appId:
        "1:898480535614:web:e523f9f82563ad30e9f96f"

};

/* ========================= */
/* INITIALIZE */
/* ========================= */

const app =
    initializeApp(firebaseConfig);

/* DATABASE */

const db =
    getFirestore(app);

/* EXPORTS */

export {

    db,
    collection,
    addDoc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    doc,
    setDoc,
    where,
    updateDoc

};