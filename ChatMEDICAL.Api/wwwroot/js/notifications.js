import {

    db,
    collection,
    query,
    where,
    onSnapshot,
    orderBy

}

    from "./firebase.js";

/* USER */

const currentUser = JSON.parse(

    localStorage.getItem(
        "currentUser"
    )

);

/* CONTAINER */

const notificationsList =
    document.getElementById(
        "notificationsList"
    );

/* QUERY */

const q = query(

    collection(
        db,
        "notifications"
    ),

    where(
        "userEmail",
        "==",
        currentUser.email
    ),

    orderBy(
        "createdAt",
        "desc"
    )

);

/* REALTIME */

onSnapshot(

    q,

    snapshot => {

        notificationsList.innerHTML =
            "";

        snapshot.forEach(doc => {

            const data =
                doc.data();

            notificationsList.innerHTML += `

                <div class="notification-card">

                    <h3>

                        ${data.title}

                    </h3>

                    <p>

                        ${data.message}

                    </p>

                </div>

            `;

        });

    }

);