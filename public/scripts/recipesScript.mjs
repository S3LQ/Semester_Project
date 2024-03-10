export function leggTilOppskrift() {
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
    fetch("/recipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recipeData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Failed to add recipe.");
      })
      .then((recipe) => {
        // Handle the response from the server (if needed)
        console.log("Recipe added successfully:", recipe);

        // Call the displayAllRecipes function to render the newly added recipe
        import("./displayRecipesScript.mjs").then((module) => {
          module.displayAllRecipes();
        });

        // Reset the form
        document.getElementById("tittel").value = "";
        document.getElementById("ingredienser").value = "";
        document.getElementById("instruksjoner").value = "";
      })
      .catch((error) => {
        console.error("Error adding recipe:", error);
        alert("Failed to add recipe. Please try again.");
      });
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

document.addEventListener("DOMContentLoaded", function () {
  // Add event listener to the "legg til oppskrift" button
  const leggTilKnapp = document.getElementById("leggTilKnapp");
  leggTilKnapp.addEventListener("click", leggTilOppskrift);
});

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

  const editButton = document.createElement("button");
  editButton.innerText = "Rediger";
  editButton.classList.add("edit-button");
  editButton.onclick = () => redigerOppskrift(`kort-${recipe.id}`, recipe); // Link to redigerOppskrift with recipe data
  enlargedCard.appendChild(editButton);

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Slett";
  deleteButton.classList.add("delete-button");
  deleteButton.onclick = () => fjernOppskrift(recipe.id);
  // Pass recipe ID as argument

  // Add back button
  const backButton = document.createElement("button");
  backButton.innerText = "Tilbake til alle oppskrifter";
  backButton.onclick = () => {
    // Call displayAllRecipes to render all recipes again
    displayAllRecipes();
    // Clear the enlarged card
    enlargedCard.remove();
    window.location.reload();
  };

  enlargedCard.appendChild(tittel);
  enlargedCard.appendChild(ingredienser);
  enlargedCard.appendChild(instruksjoner);
  enlargedCard.appendChild(editButton);
  enlargedCard.appendChild(deleteButton);
  enlargedCard.appendChild(backButton);

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

export function redigerOppskrift(recipeCardId, recipe) {
  const tittelContainer = document.getElementById(`tittel-${recipe.id}`);
  const ingredienserContainer = document.getElementById(
    `ingredienser-${recipe.id}`
  );
  const instruksjonerContainer = document.getElementById(
    `instruksjoner-${recipe.id}`
  );

  if (!tittelContainer || !ingredienserContainer || !instruksjonerContainer) {
    console.error(`Recipe elements not found.`);
    return;
  }

  // Replace recipe title with input field
  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.value = recipe.title;
  tittelContainer.innerHTML = ""; // Clear existing content
  tittelContainer.appendChild(titleInput);

  // Replace recipe ingredients with textarea
  const ingredientsTextarea = document.createElement("textarea");
  ingredientsTextarea.value = recipe.ingredients;
  ingredienserContainer.innerHTML = ""; // Clear existing content
  ingredienserContainer.appendChild(ingredientsTextarea);

  // Replace recipe instructions with textarea
  const instructionsTextarea = document.createElement("textarea");
  instructionsTextarea.value = recipe.instructions;
  instruksjonerContainer.innerHTML = ""; // Clear existing content
  instruksjonerContainer.appendChild(instructionsTextarea);

  // Create and append update button
  const updateButton = document.createElement("button");
  updateButton.innerText = "Oppdater";
  updateButton.classList.add("oppdater-gronn");
  updateButton.addEventListener("click", () => {
    // Retrieve updated values from input fields and textareas
    const updatedTitle = titleInput.value;
    const updatedIngredients = ingredientsTextarea.value;
    const updatedInstructions = instructionsTextarea.value;

    // Create an updated recipe object
    const updatedRecipe = {
      id: recipe.id,
      title: updatedTitle,
      ingredients: updatedIngredients,
      instructions: updatedInstructions,
    };

    // Call the update function with the updated recipe
    oppdaterOppskrift(updatedRecipe);
  });

  const buttonsContainer = document.createElement("div");
  buttonsContainer.appendChild(updateButton);
  instruksjonerContainer.appendChild(buttonsContainer);
}

export function oppdaterOppskrift(recipeId) {
  const titleInput = document
    .getElementById(`tittel-${recipeId}`)
    .querySelector("input");
  const ingredientsTextarea = document
    .getElementById(`ingredienser-${recipeId}`)
    .querySelector("textarea");
  const instructionsTextarea = document
    .getElementById(`instruksjoner-${recipeId}`)
    .querySelector("textarea");

  const updatedRecipe = {
    id: recipeId,
    title: titleInput.value,
    ingredients: ingredientsTextarea.value,
    instructions: instructionsTextarea.value,
  };

  fetch(`/recipes/${recipeId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedRecipe),
  })
    .then((response) => {
      if (response.ok) {
        // Handle successful update
        console.log("Recipe updated successfully");
        // Call displayAllRecipes to render all recipes again
        displayAllRecipes();
      } else {
        throw new Error("Failed to update recipe.");
      }
    })
    .catch((error) => {
      console.error("Error updating recipe:", error);
      alert("Failed to update recipe. Please try again.");
    });
}
