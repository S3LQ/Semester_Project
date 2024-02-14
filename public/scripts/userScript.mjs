// userScript.mjs

let userList = [];

export function createUser() {
  const navn = document.getElementById("navn").value;
  const password = document.getElementById("pswHash").value;

  if (navn && password) {
    const user = { navn, password };
    userList.push(user);

    // You can add additional logic like storing users in a database here

    // Reset the form
    resetUserForm();
  } else {
    alert("Fill out all fields.");
  }
}

export function loginUser() {
  const navn = document.getElementById("loginUserNavn").value;
  const password = document.getElementById("loginPassord").value;

  const user = userList.find((u) => u.navn === navn && u.password === password);

  if (user) {
    loggInn(user.navn);
  } else {
    alert("Invalid navn or password.");
  }

  // Reset the form
  resetLoginForm();
}

function resetUserForm() {
  const userForm = document.getElementById("createUserSection");

  // Sjekk om userForm er et skjemaelement
  if (userForm.tagName.toLowerCase() === "form") {
    // Bruk reset-metoden for skjemaelementer
    userForm.reset();
  } else {
    // Tilpasset reset for andre elementer
    document.getElementById("navn").value = "";
    document.getElementById("email").value = "";
    document.getElementById("pswHash").value = "";
  }
}

function resetLoginForm() {
  const loginForm = document.getElementById("loginSection");

  // Sjekk om loginForm er et skjemaelement
  if (loginForm.tagName.toLowerCase() === "form") {
    // Bruk reset-metoden for skjemaelementer
    loginForm.reset();
  } else {
    // Tilpasset reset for andre elementer
    document.getElementById("loginUserNavn").value = "";
    document.getElementById("loginPassord").value = "";
  }
}

// Placeholder for loggInn function
export function loggInn(navn) {
  // Implement the login logic or redirect the user to the recipes page
  console.log(`${navn} is now logged in.`);
}
