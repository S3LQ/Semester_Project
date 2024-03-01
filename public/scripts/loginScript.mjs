import postToUsers from "./postToUsers.mjs";

const loginButton = document.getElementById("loginButton");

loginButton.addEventListener("click", async function () {
  const email = document.getElementById("loginUserNavn").value;
  const password = document.getElementById("loginPassord").value;
  const authString = email + password;
  const type = "login";
  const user = {
    email,
    authString,
    type,
  };
  postToUsers(user)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((data) => {
      console.log(data);
      localStorage.setItem("userData", data);
      window.location.href = "recipes.html";
    });
});
