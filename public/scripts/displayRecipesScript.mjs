import { renderRecipeCard } from "./recipesScript.mjs";

// Function to fetch and display all recipes
export async function displayAllRecipes() {
  try {
    // Fetch recipes from the server
    const response = await fetch("/recipes");

    // Check if the response is successful
    if (!response.ok) {
      // If not successful, throw an error
      throw new Error("Failed to fetch recipes.");
    }

    // Parse the response as JSON
    const recipes = await response.json();

    // Render each recipe card on the page
    recipes.forEach((recipe) => {
      renderRecipeCard(recipe);
    });
  } catch (error) {
    // Catch any errors that occur during fetching or rendering
    console.error("Error fetching all recipes:", error);
  }
}

// Event listener for when the DOM content is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Call the function to display all recipes
  displayAllRecipes();

  // Get the elements for adding a new recipe
  const leggTilSkjema = document.getElementById("leggTilSkjema");
  const leggTilKnapp = document.getElementById("leggTilKnapp");

  // Event listener for toggling the display of the add recipe form
  leggTilKnapp.addEventListener("click", function () {
    if (
      leggTilSkjema.style.display === "none" ||
      leggTilSkjema.style.display === ""
    ) {
      leggTilSkjema.style.display = "block";
    } else {
      leggTilSkjema.style.display = "none";
    }
  });
});
