import postToUsers from "./postToUsers.mjs";

document
  .getElementById("showCreateUserButton")
  .addEventListener("click", function () {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("createUserSection").style.display = "block";
  });

document;
const loginButton = document.getElementById("loginButton");
loginButton.addEventListener("click", async function () {
  document.getElementById("loginSection").style.display = "block";
  document.getElementById("createUserSection").style.display = "none";
});

const createUserButton = document.getElementById("createUserButton");

createUserButton.addEventListener("click", async function () {
  const name = document.getElementById("navn").value;
  const email = document.getElementById("email").value;
  const pswHash = document.getElementById("pswHash").value;
  const authString = email + pswHash;
  const type = "createUser";

  const user = { name, email, authString, type };

  try {
    await postToUsers(user)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to create user");
        }
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return res.json();
        } else {
          return {};
        }
      })
      .then((data) => {
        localStorage.setItem("userData", JSON.stringify(data));

        alert("User created successfully, please log in");
        window.location.href = "index.html";
      })
      .catch((error) => {
        console.error("Failed to create user:", error.message);
        // Handle the error accordingly
      });
  } catch (error) {
    console.error("Failed to create user:", error.message);
  }
});

const backToLoginButton = document.getElementById("backToLoginButton");
backToLoginButton.addEventListener("click", function () {
  document.getElementById("createUserSection").style.display = "none";
  document.getElementById("loginSection").style.display = "block";
});
