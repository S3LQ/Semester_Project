import postToUsers from "./postToUsers.mjs";

const loginButton = document.getElementById("loginButton");

// Event listener for login button click
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

  // Send POST request to authenticate user
  postToUsers(user)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((data) => {
      // Store user data in local storage upon successful login
      localStorage.setItem("userData", data);
      // Redirect to recipes page
      window.location.href = "recipes.html";
    });
});
