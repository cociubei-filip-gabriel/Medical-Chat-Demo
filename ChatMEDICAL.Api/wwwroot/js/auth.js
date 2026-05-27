/* LOGIN CHECK */

const isLoggedIn =

    localStorage.getItem(
        "isLoggedIn"
    );

/* REDIRECT */

if (!isLoggedIn) {

    window.location.href =
        "login.html";

}
