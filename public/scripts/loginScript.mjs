// loginScript.mjs

import * as userScript from "./userScript.mjs";

const createUserButton = document.getElementById("createUserButton");

createUserButton.addEventListener("click", async function () {
  const navn = document.getElementById("navn").value;
  const email = document.getElementById("email").value;
  const pswHash = document.getElementById("pswHash").value;

  console.log("Navn:", navn);
  console.log("Email:", email);
  console.log("Passord:", pswHash);

  const user = { navn, email, pswHash };

  console.log("Creating user:", user);

  try {
    // Assuming you have an endpoint for creating users on the server
    const response = await postTo("/user", user);

    if (response.ok) {
      // Log in the user after successful user creation
      userScript.loggInn(navn);
      console.log("Bruker opprettet, omdirigerer...");
      window.location.href = "recipes.html";
    } else {
      console.error("Opprettelse av bruker mislyktes.");
    }
  } catch (error) {
    console.error("Nettverksfeil:", error);
  }
});

async function postTo(url, data) {
  const header = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(url, header);
  return response;
}
