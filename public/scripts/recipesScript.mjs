// Function to create a new recipe
export async function createRecipe() {
  // Retrieve user data from local storage
  const userData = JSON.parse(localStorage.getItem("userData"));
  // Check if user data exists and if it's an array with at least one element
  if (!userData || !userData[0]) {
    // Alert user to log in if not authenticated
    alert("You need to log in to add recipes.");
    return;
  }

  // Retrieve input values for title, ingredients, and instructions
  const title = document.getElementById("tittel").value;
  const ingredients = document.getElementById("ingredienser").value;
  const instructions = document.getElementById("instruksjoner").value;
  const userId = userData[0].id;

  // Check if all required fields are filled
  if (title && ingredients && instructions) {
    // Prepare recipe data object
    const recipeData = {
      title: title,
      ingredients: ingredients,
      instructions: instructions,
      userId: userId,
    };

    try {
      // Send POST request to create a new recipe
      const response = await fetch("/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeData),
      });
      // Check if the response is ok
      if (response.ok) {
        // Reload the page to display the new recipe
        location.reload();
      } else {
        // Throw an error if failed to add the recipe
        throw new Error("Failed to add recipe.");
      }
    } catch (error) {
      // Log and alert if there's an error adding the recipe
      console.error("Error adding recipe:", error);
      alert("Failed to add recipe. Please try again.");
    }
  } else {
    // Alert user to fill out all required fields
    alert("Fill out all required fields.");
  }
}

// Event listener to execute createRecipe function when the DOM content is loaded
document.addEventListener("DOMContentLoaded", function () {
  const leggTilKnapp = document.getElementById("leggTilKnapp");
  leggTilKnapp.addEventListener("click", createRecipe);
});

// Function to enlarge a recipe card
function enlargeRecipeCard(recipe) {
  // Hide the button container
  const buttonContainer = document.querySelector(".button-container");
  buttonContainer.style.display = "none";

  // Clear the container holding the recipe cards
  const kortContainer = document.getElementById("kortContainer");
  kortContainer.innerHTML = "";

  // Hide the add recipe button and page title
  const addRecipeButton = document.getElementById("addRecipeButton");
  addRecipeButton.style.display = "none";
  const h1Element = document.querySelector("h1");
  h1Element.style.display = "none";

  // Create an enlarged recipe card
  const enlargedCard = document.createElement("div");
  enlargedCard.classList.add("enlarged-card");

  // Create and append image element
  const image = document.createElement("img");
  image.src = "./IMG/FoodImage.jpg";
  image.alt = "Stock Image";
  enlargedCard.appendChild(image);

  // Create and append elements for title, ingredients, and instructions
  const tittel = document.createElement("h3");
  tittel.innerText = " " + recipe.title;
  const ingredienser = document.createElement("p");
  ingredienser.innerText = "Ingredienser: " + recipe.ingredients;
  const instruksjoner = document.createElement("p");
  instruksjoner.innerText = "Instruksjoner: " + recipe.instructions;
  enlargedCard.appendChild(tittel);
  enlargedCard.appendChild(ingredienser);
  enlargedCard.appendChild(instruksjoner);

  // Check if the user is the creator of the recipe to show edit and delete buttons
  const userData = JSON.parse(localStorage.getItem("userData"));
  if (userData && userData[0] && recipe.creatorID === userData[0].id) {
    // Create and append delete button
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("actionButton");
    deleteButton.innerText = "Slett";
    deleteButton.onclick = () => deleteRecipe(recipe.id);

    // Create and append edit button
    const editButton = document.createElement("button");
    editButton.innerText = "Rediger";
    editButton.classList.add("edit-button");
    editButton.onclick = () => {
      // Hide edit and delete buttons
      editButton.style.display = "none";
      deleteButton.style.display = "none";

      // Replace title, ingredients, and instructions with input fields for editing
      tittel.innerHTML =
        '<input type="text" id="editedTitle" value="' + recipe.title + '">';
      ingredienser.innerHTML =
        '<textarea id="editedIngredients">' +
        recipe.ingredients +
        "</textarea>";
      instruksjoner.innerHTML =
        '<textarea id="editedInstructions">' +
        recipe.instructions +
        "</textarea>";

      // Create and append save button
      const saveButton = document.createElement("button");
      saveButton.innerText = "Lagre";
      saveButton.onclick = () => saveEditedRecipe(recipe.id);

      // Create and append cancel button
      const cancelButton = document.createElement("button");
      cancelButton.classList.add("actionButton");
      cancelButton.innerText = "Avbryt";
      cancelButton.onclick = () => {
        // Reset title, ingredients, and instructions
        tittel.innerText = " " + recipe.title;
        ingredienser.innerText = "Ingredienser: " + recipe.ingredients;
        instruksjoner.innerText = "Instruksjoner: " + recipe.instructions;

        // Remove save and cancel buttons
        saveButton.remove();
        cancelButton.remove();

        // Show edit and delete buttons
        editButton.style.display = "block";
        deleteButton.style.display = "block";
        backButton.style.display = "block";
      };

      backButton.style.display = "none";

      // Append save and cancel buttons
      enlargedCard.appendChild(saveButton);
      enlargedCard.appendChild(cancelButton);
    };

    // Append delete and edit buttons
    enlargedCard.appendChild(deleteButton);
    enlargedCard.appendChild(editButton);
  }

  // Create and append back button
  const backButton = document.createElement("button");
  backButton.innerText = "Tilbake til alle oppskrifter";
  backButton.onclick = () => {
    // Display all recipes and remove the enlarged card
    displayAllRecipes();
    enlargedCard.remove();
    window.location.reload();
  };

  enlargedCard.appendChild(backButton);

  // Append the enlarged card to the container
  kortContainer.appendChild(enlargedCard);
}

// Function to render a recipe card
export function renderRecipeCard(recipe) {
  const kortContainer = document.getElementById("kortContainer");

  // Create a new card element
  const kort = document.createElement("div");
  kort.classList.add("kort");
  kort.id = `kort-${recipe.id}`;

  // Check if the user is the creator of the recipe to display a trademark
  const userData = JSON.parse(localStorage.getItem("userData"));
  if (userData && userData[0] && recipe.creatorID === userData[0].id) {
    const trademark = document.createElement("div");
    trademark.classList.add("trademark");
    trademark.innerHTML = "Din Oppskrift";
    kort.appendChild(trademark);
  }

  // Create elements for title, ingredients, and instructions
  const tittel = document.createElement("h3");
  tittel.innerText = " " + recipe.title;
  tittel.classList.add("tittel");
  tittel.id = `tittel-${recipe.id}`;
  const ingredienser = document.createElement("p");
  ingredienser.innerText = "Ingredienser: " + recipe.ingredients;
  ingredienser.classList.add("ingredienser");
  ingredienser.id = `ingredienser-${recipe.id}`;
  const instruksjoner = document.createElement("p");
  instruksjoner.innerText = "Instruksjoner: " + recipe.instructions;
  instruksjoner.classList.add("instruksjoner");
  instruksjoner.id = `instruksjoner-${recipe.id}`;

  // Create and append image element
  const image = document.createElement("img");
  image.src = "./IMG/FoodImage.jpg";
  image.alt = "Stock Image";
  kort.appendChild(image);

  // Append title, ingredients, and instructions to the card
  kort.appendChild(tittel);
  kort.appendChild(ingredienser);
  kort.appendChild(instruksjoner);

  // Add event listener to enlarge the card when clicked
  kort.addEventListener("click", () => enlargeRecipeCard(recipe));

  // Append the card to the container
  kortContainer.appendChild(kort);
}

// Function to display all recipes
export async function displayAllRecipes() {
  try {
    // Fetch all recipes from the server
    const response = await fetch("/recipes");
    // Check if the response is ok
    if (!response.ok) {
      throw new Error("Failed to fetch recipes.");
    }
    // Extract recipes from the response
    const recipes = await response.json();
    // Get the container for recipe cards
    const kortContainer = document.getElementById("kortContainer");
    // Clear the container
    kortContainer.innerHTML = "";

    // Keep track of rendered recipe ids to avoid duplicates
    const renderedRecipeIds = new Set();

    // Render each recipe card
    recipes.forEach((recipe) => {
      if (!renderedRecipeIds.has(recipe.id)) {
        renderRecipeCard(recipe);
        renderedRecipeIds.add(recipe.id);
      }
    });
  } catch (error) {
    console.error("Error fetching all recipes:", error);
  }
}

// Function to delete a recipe
export function deleteRecipe(recipeId) {
  // Send a DELETE request to delete the specified recipe
  fetch(`/recipes/${recipeId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        // Reload the page after successful deletion
        window.location.reload();
        // Show the button container, add recipe button, and page title
        document.getElementById("button-container").style.display = "block";
        document.getElementById("addRecipeButton").style.display = "block";
        document.getElementById("h1").style.display = "block";
      } else {
        // Throw an error if failed to delete the recipe
        throw new Error("Failed to delete recipe.");
      }
    })
    .catch((error) => {
      console.error("Error deleting recipe:", error);
    });
}

// Function to edit a recipe
export async function editRecipe(recipe) {
  // Retrieve user data from local storage
  const userData = JSON.parse(localStorage.getItem("userData"));
  // Check if user data exists
  if (!userData) {
    // Alert user to log in if not authenticated
    alert("You need to log in to edit recipes.");
    return;
  }

  // Prompt the user to enter new title, ingredients, and instructions
  const title = prompt("Enter new title:", recipe.title);
  const ingredients = prompt("Enter new ingredients:", recipe.ingredients);
  const instructions = prompt("Enter new instructions:", recipe.instructions);

  // Get user ID
  const userId = userData.id;

  // Check if all required fields are filled
  if (title && ingredients && instructions) {
    // Prepare updated recipe data object
    const updatedRecipeData = {
      title: title,
      ingredients: ingredients,
      instructions: instructions,
      userId: userId,
    };

    try {
      // Send PUT request to update the recipe
      const response = await fetch(`/recipes/${recipe.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRecipeData),
      });
      // Check if the response is ok
      if (response.ok) {
        // Reload the page after successful update
        location.reload();
      } else {
        // Throw an error if failed to update the recipe
        throw new Error("Failed to update recipe.");
      }
    } catch (error) {
      // Log and alert if there's an error updating the recipe
      console.error("Error updating recipe:", error);
      alert("Failed to update recipe. Please try again.");
    }
  } else {
    // Alert user to fill out all required fields
    alert("Fill out all required fields.");
  }
}

// Function to save edited recipe
async function saveEditedRecipe(recipeId) {
  // Retrieve edited title, ingredients, and instructions from input fields
  const editedTitle = document.getElementById("editedTitle").value;
  const editedIngredients = document.getElementById("editedIngredients").value;
  const editedInstructions =
    document.getElementById("editedInstructions").value;

  // Prepare updated recipe data object
  const updatedRecipeData = {
    title: editedTitle,
    ingredients: editedIngredients,
    instructions: editedInstructions,
  };

  try {
    // Send PUT request to update the recipe
    const response = await fetch(`/recipes/${recipeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedRecipeData),
    });

    // Check if the response is ok
    if (response.ok) {
      // Reload the page after successful update
      location.reload();
    } else {
      // Throw an error if failed to update the recipe
      throw new Error("Failed to update recipe.");
    }
  } catch (error) {
    // Log and alert if there's an error updating the recipe
    console.error("Error updating recipe:", error);
    alert("Failed to update recipe. Please try again.");
  }
}
