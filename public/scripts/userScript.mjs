// userScript.mjs

export async function loginUser() {
  const email = document.getElementById("loginUserNavn").value;
  const password = document.getElementById("loginPassord").value;

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      // Login successful, redirect the user or perform any other action
      window.location.href = "/recipes.html"; // Redirect to recipes.html upon successful login
    } else {
      // Login failed, display an error message to the user
      alert("Invalid email or password.");
    }
  } catch (error) {
    console.error("Error during login:", error.message);
    // Handle any errors that occurred during the login process
    alert("An error occurred during login. Please try again later.");
  }
}
