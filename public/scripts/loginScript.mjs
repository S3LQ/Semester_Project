// loginScript.mjs

import * as userScript from "./userScript.mjs";
import loggerMiddleware from "./loggerMiddleware.mjs";

const showCreateUserButton = document.getElementById("showCreateUserButton");
const backToLoginButton = document.getElementById("backToLoginButton");

showCreateUserButton.addEventListener("click", function () {
  // Show the "Lag bruker" section and hide the "Logg inn" section
  document.getElementById("createUserSection").style.display = "block";
  document.getElementById("loginSection").style.display = "none";
});

backToLoginButton.addEventListener("click", function () {
  // Show the "Logg inn" section and hide the "Lag bruker" section
  document.getElementById("createUserSection").style.display = "none";
  document.getElementById("loginSection").style.display = "block";
});

const loginButton = document.getElementById("loginButton");

loginButton.addEventListener("click", userScript.loginUser);

const createUserButton = document.getElementById("createUserButton");

createUserButton.addEventListener("click", function () {
  // Opprett bruker uten å kreve gyldige verdier for navn og passord
  userScript.createUser();
  // Logg inn brukeren (du kan endre dette avhengig av dine krav)
  userScript.loggInn("TemporaryUser");
  console.log("Bruker opprettet, omdirigerer...");
  window.location.href = "recipes.html";
});
