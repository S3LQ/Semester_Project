// userScript.mjs

let userList = [];

export function createUser() {
  const navn = document.getElementById("navn").value;
  const password = document.getElementById("password").value;

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
  const navn = document.getElementById("loginnavn").value;
  const password = document.getElementById("loginPassword").value;

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
  const userForm = document.getElementById("userForm");
  userForm.reset();
}

function resetLoginForm() {
  const loginForm = document.getElementById("loginForm");
  loginForm.reset();
}

// Placeholder for loggInn function
export function loggInn(navn) {
  // Implement the login logic or redirect the user to the recipes page
  console.log(`${navn} is now logged in.`);
}
