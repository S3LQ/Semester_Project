// Function to create a user
async function postToUsers(user) {
  try {
    // Create a user object with the provided data

    // Send a POST request to your backend endpoint to store the user data
    const response = await fetch("/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    // Check if the request was successful

    if (!response.ok) {
      throw new Error("Failed to connect to server");
    }

    // Return the created user object
    return response;
  } catch (error) {
    console.error("Error connecting:", error.message);
    // Throw the error to be handled by the caller
    throw error;
  }
}

export default postToUsers;
