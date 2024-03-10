import { renderRecipeCard } from "./recipesScript.mjs";

// Function to fetch all recipes from the server
async function fetchAllRecipes() {
  try {
    const response = await fetch("/recipes");
    if (response.ok) {
      const recipes = await response.json();
      console.log("Retrieved recipes:", recipes); // Log the retrieved recipes
      return recipes;
    } else {
      throw new Error("Failed to fetch recipes");
    }
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
}

// Function to display all recipes on the UI
export async function displayAllRecipes() {
  try {
    const response = await fetch("/recipes");
    if (!response.ok) {
      throw new Error("Failed to fetch recipes.");
    }
    const recipes = await response.json();
    recipes.forEach((recipe) => {
      renderRecipeCard(recipe);
    });
  } catch (error) {
    console.error("Error fetching all recipes:", error);
    // Handle error
  }
}

document.addEventListener("DOMContentLoaded", function () {
  displayAllRecipes();

  // Get reference to the form
  const leggTilSkjema = document.getElementById("leggTilSkjema");

  // Get reference to the "legg til oppskrift" button
  const leggTilKnapp = document.getElementById("leggTilKnapp");

  // Add event listener to the button to toggle the form display
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
