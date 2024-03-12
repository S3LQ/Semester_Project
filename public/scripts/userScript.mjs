// Function to log in a user
export async function loginUser() {
  // Retrieve email and password from input fields
  const email = document.getElementById("loginUserNavn").value;
  const password = document.getElementById("loginPassord").value;

  try {
    // Send POST request to log in
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }), // Send email and password in JSON format
    });

    // Check if the response is ok
    if (response.ok) {
      // Redirect to recipes page if login is successful
      window.location.href = "/recipes.html";
    } else {
      // Alert user if login credentials are invalid
      alert("Invalid email or password.");
    }
  } catch (error) {
    // Log and alert if there's an error during login
    console.error("Error during login:", error.message);
    alert("An error occurred during login. Please try again later.");
  }
}
