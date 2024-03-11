export async function leggTilOppskrift() {
  // Check if a user is logged in
  const userData = JSON.parse(localStorage.getItem("userData"));
  console.log("User data:", userData);
  if (!userData) {
    alert("You need to log in to add recipes.");
    return;
  }

  // Retrieve recipe data from the form
  const title = document.getElementById("tittel").value;
  const ingredients = document.getElementById("ingredienser").value;
  const instructions = document.getElementById("instruksjoner").value;
  // You can handle the image input if needed

  // Get the user ID
  const userId = userData.id;

  // Check if title, ingredients, and instructions are filled
  if (title && ingredients && instructions) {
    const recipeData = {
      title: title,
      ingredients: ingredients,
      instructions: instructions,
      userId: userId, // Include the user ID
    };

    // Submit recipe data to the server using fetch
    try {
      const response = await fetch("/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeData),
      });
      if (response.ok) {
        const recipe = await response.json();
        console.log("Recipe added successfully:", recipe);

        // Reload the page to display the newly added recipe
        location.reload();
      } else {
        throw new Error("Failed to add recipe.");
      }
    } catch (error) {
      console.error("Error adding recipe:", error);
      alert("Failed to add recipe. Please try again.");
    }
  } else {
    alert("Fill out all required fields.");
  }
}

// Add event listener to the "Legg til oppskrift" button
document.addEventListener("DOMContentLoaded", function () {
  const leggTilKnapp = document.getElementById("leggTilKnapp");
  leggTilKnapp.addEventListener("click", leggTilOppskrift);
});

// Function to toggle the display of the "legg til oppskrift" form
function toggleAddRecipeForm() {
  const form = document.getElementById("leggTilSkjema");
  form.style.display = form.style.display === "none" ? "block" : "none";
}

function enlargeRecipeCard(recipe) {
  const buttonContainer = document.querySelector(".button-container");
  buttonContainer.style.display = "none";

  const kortContainer = document.getElementById("kortContainer");
  kortContainer.innerHTML = "";

  const addRecipeButton = document.getElementById("addRecipeButton");
  addRecipeButton.style.display = "none";

  const h1Element = document.querySelector("h1");
  h1Element.style.display = "none";

  // Create a new enlarged card
  const enlargedCard = document.createElement("div");
  enlargedCard.classList.add("enlarged-card");

  // Create and set the image element with the stock image source
  const image = document.createElement("img");
  image.src = "./IMG/FoodImage.jpg";
  image.alt = "Stock Image";
  enlargedCard.appendChild(image);

  const tittel = document.createElement("h3");
  tittel.innerText = " " + recipe.title;

  const ingredienser = document.createElement("p");
  ingredienser.innerText = "Ingredienser: " + recipe.ingredients;

  const instruksjoner = document.createElement("p");
  instruksjoner.innerText = "Instruksjoner: " + recipe.instructions;

  const backButton = document.createElement("button");
  backButton.innerText = "Tilbake til alle oppskrifter";
  backButton.onclick = () => {
    // Call displayAllRecipes to render all recipes again
    displayAllRecipes();
    // Clear the enlarged card
    enlargedCard.remove();
    window.location.reload();
  };

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("actionButton");
  deleteButton.innerText = "Slett";
  deleteButton.onclick = () => fjernOppskrift(recipe.id);

  const editButton = document.createElement("button");
  editButton.innerText = "Rediger";
  editButton.classList.add("edit-button");
  editButton.onclick = () => {
    // Remove text content and add input fields for editing
    tittel.innerHTML =
      '<input type="text" id="editedTitle" value="' + recipe.title + '">';
    ingredienser.innerHTML =
      '<textarea id="editedIngredients">' + recipe.ingredients + "</textarea>";
    instruksjoner.innerHTML =
      '<textarea id="editedInstructions">' +
      recipe.instructions +
      "</textarea>";
    // Create and append save and cancel buttons
    const saveButton = document.createElement("button");
    saveButton.innerText = "Lagre";
    saveButton.onclick = () => saveEditedRecipe(recipe.id);

    const cancelButton = document.createElement("button");
    cancelButton.classList.add("actionButton");
    cancelButton.innerText = "Avbryt";
    cancelButton.onclick = () => {
      // Restore original text content
      tittel.innerText = " " + recipe.title;
      ingredienser.innerText = "Ingredienser: " + recipe.ingredients;
      instruksjoner.innerText = "Instruksjoner: " + recipe.instructions;
      // Remove save and cancel buttons
      saveButton.remove();
      cancelButton.remove();
      // Show edit button
      editButton.style.display = "block";
      backButton.style.display = "block";
      deleteButton.style.display = "block";
    };

    // Hide back and delete buttons
    backButton.style.display = "none";
    deleteButton.style.display = "none";
    editButton.style.display = "none";

    enlargedCard.appendChild(saveButton);
    enlargedCard.appendChild(cancelButton);
  };

  enlargedCard.appendChild(tittel);
  enlargedCard.appendChild(ingredienser);
  enlargedCard.appendChild(instruksjoner);
  enlargedCard.appendChild(backButton);
  enlargedCard.appendChild(editButton);
  enlargedCard.appendChild(deleteButton);

  kortContainer.appendChild(enlargedCard);
}

// Function to render a single recipe card in its original format with edit and delete buttons
export function renderRecipeCard(recipe) {
  const kortContainer = document.getElementById("kortContainer");

  const kort = document.createElement("div");
  kort.classList.add("kort");
  kort.id = `kort-${recipe.id}`;

  const tittel = document.createElement("h3");
  tittel.innerText = " " + recipe.title;
  tittel.classList.add("tittel"); // Add class for title
  tittel.id = `tittel-${recipe.id}`;

  const ingredienser = document.createElement("p");
  ingredienser.innerText = "Ingredienser: " + recipe.ingredients;
  ingredienser.classList.add("ingredienser"); // Add class for ingredients
  ingredienser.id = `ingredienser-${recipe.id}`;

  const instruksjoner = document.createElement("p");
  instruksjoner.innerText = "Instruksjoner: " + recipe.instructions;
  instruksjoner.classList.add("instruksjoner"); // Add class for instructions
  instruksjoner.id = `instruksjoner-${recipe.id}`;

  // Create and set the image element with the stock image source
  const image = document.createElement("img");
  image.src = "./IMG/FoodImage.jpg";
  image.alt = "Stock Image";
  kort.appendChild(image);

  kort.appendChild(tittel);
  kort.appendChild(ingredienser);
  kort.appendChild(instruksjoner);

  // Add event listener to the recipe card
  kort.addEventListener("click", () => enlargeRecipeCard(recipe));

  kortContainer.appendChild(kort);
}

export async function displayAllRecipes() {
  try {
    const response = await fetch("/recipes");
    if (!response.ok) {
      throw new Error("Failed to fetch recipes.");
    }
    const recipes = await response.json();
    const kortContainer = document.getElementById("kortContainer");
    kortContainer.innerHTML = ""; // Clear existing cards before rendering

    const renderedRecipeIds = new Set(); // Track rendered recipe IDs

    recipes.forEach((recipe) => {
      // Check if recipe has already been rendered
      if (!renderedRecipeIds.has(recipe.id)) {
        renderRecipeCard(recipe);
        renderedRecipeIds.add(recipe.id);
      }
    });
  } catch (error) {
    console.error("Error fetching all recipes:", error);
    // Handle error
  }
}

// Function to remove a recipe by its ID
export function fjernOppskrift(recipeId) {
  fetch(`/recipes/${recipeId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        console.log("Recipe deleted successfully:", recipeId);
        // Reload the page after successful deletion
        window.location.reload();
        // Additionally, show the add recipe button, h1, and back button
        document.getElementById("button-container").style.display = "block";
        document.getElementById("addRecipeButton").style.display = "block";
        document.getElementById("h1").style.display = "block";
      } else {
        throw new Error("Failed to delete recipe.");
      }
    })
    .catch((error) => {
      console.error("Error deleting recipe:", error);
    });
}

export async function redigerOppskrift(recipe) {
  // Check if a user is logged in
  const userData = JSON.parse(localStorage.getItem("userData"));
  console.log("User data:", userData);
  if (!userData) {
    alert("You need to log in to edit recipes.");
    return;
  }

  // Retrieve recipe data from the form
  const title = prompt("Enter new title:", recipe.title);
  const ingredients = prompt("Enter new ingredients:", recipe.ingredients);
  const instructions = prompt("Enter new instructions:", recipe.instructions);
  // You can handle the image input if needed

  // Get the user ID
  const userId = userData.id;

  // Check if title, ingredients, and instructions are filled
  if (title && ingredients && instructions) {
    const updatedRecipeData = {
      title: title,
      ingredients: ingredients,
      instructions: instructions,
      userId: userId, // Include the user ID
    };

    // Submit updated recipe data to the server using fetch
    try {
      const response = await fetch(`/recipes/${recipe.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRecipeData),
      });
      if (response.ok) {
        const updatedRecipe = await response.json();
        console.log("Recipe updated successfully:", updatedRecipe);

        // Reload the page to display the updated recipe
        location.reload();
      } else {
        throw new Error("Failed to update recipe.");
      }
    } catch (error) {
      console.error("Error updating recipe:", error);
      alert("Failed to update recipe. Please try again.");
    }
  } else {
    alert("Fill out all required fields.");
  }
}

async function saveEditedRecipe(recipeId) {
  // Retrieve edited data from input fields
  const editedTitle = document.getElementById("editedTitle").value;
  const editedIngredients = document.getElementById("editedIngredients").value;
  const editedInstructions =
    document.getElementById("editedInstructions").value;

  // Construct updated recipe object
  const updatedRecipeData = {
    title: editedTitle,
    ingredients: editedIngredients,
    instructions: editedInstructions,
  };

  try {
    // Send PUT request to update the recipe in the database
    const response = await fetch(`/recipes/${recipeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedRecipeData),
    });

    if (response.ok) {
      const updatedRecipe = await response.json();
      console.log("Recipe updated successfully:", updatedRecipe);

      // Reload the page to display the updated recipe
      location.reload();
    } else {
      throw new Error("Failed to update recipe.");
    }
  } catch (error) {
    console.error("Error updating recipe:", error);
    alert("Failed to update recipe. Please try again.");
  }
}
