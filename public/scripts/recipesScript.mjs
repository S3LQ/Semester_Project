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
  const time = document.getElementById("tid").value;
  const userId = userData[0].id;

  // Retrieve selected skill level
  let skillLevel = null;
  const selectedSkillButton = document.querySelector(
    ".skill-level-button.selected"
  );
  if (selectedSkillButton) {
    skillLevel = selectedSkillButton.value;
  }

  // Check if all required fields are filled
  if (title && ingredients && instructions && skillLevel) {
    // Prepare recipe data object
    const recipeData = {
      title: title,
      ingredients: ingredients,
      instructions: instructions,
      time: time,
      userId: userId,
      skillLevel: skillLevel,
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
  image.src = "./IMG/FoodImage.jpeg";
  image.alt = "Stock Image";
  enlargedCard.appendChild(image);

  // Create and append elements for title, ingredients, and instructions
  const tittel = document.createElement("h3");
  tittel.innerHTML = "<b>" + recipe.title + "</b>";

  const ingredienser = document.createElement("p");
  ingredienser.innerHTML = "<b>Ingredienser:</b> " + recipe.ingredients;

  const instruksjoner = document.createElement("p");
  instruksjoner.innerHTML = "<b>Instruksjoner:</b> " + recipe.instructions;

  const tid = document.createElement("p");
  tid.innerHTML = "<b>Tid:</b> " + recipe.time + " minutter";

  const vanskelighetsgrad = document.createElement("p");
  vanskelighetsgrad.innerHTML =
    "<b>Vanskelighetsgrad:</b> " + recipe.skill_level;

  enlargedCard.appendChild(tittel);
  enlargedCard.appendChild(ingredienser);
  enlargedCard.appendChild(instruksjoner);
  enlargedCard.appendChild(tid);
  enlargedCard.appendChild(vanskelighetsgrad);

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
      tid.innerHTML =
        '<textarea id="editedTime">' + recipe.time + "</textarea>";

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
        tid.innerText = "Tid: " + recipe.time;

        // Remove save and cancel buttons
        saveButton.remove();
        cancelButton.remove();

        // Show edit and delete buttons
        editButton.style.display = "block";
        deleteButton.style.display = "block";
        backButton.style.display = "block";
      };

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
    window.location.reload();
  };

  enlargedCard.appendChild(backButton);
  kortContainer.appendChild(enlargedCard);
}

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

  // Create an element for the skill level
  const skillLevelText = document.createElement("p");
  skillLevelText.innerText = "Vanskelighetsgrad: " + recipe.skill_level;

  // Assign color based on skill level
  let color = "";
  switch (recipe.skill_level.toLowerCase()) {
    case "lett":
      color = "green";
      break;
    case "medium":
      color = "orange";
      break;
    case "avansert":
      color = "red";
      break;
    default:
      color = "black"; // Default color
  }
  skillLevelText.style.color = color;

  // Create elements for title, ingredients, and time
  const tittel = document.createElement("h3");
  tittel.innerText = " " + recipe.title;
  tittel.classList.add("tittel");
  tittel.id = `tittel-${recipe.id}`;
  const tid = document.createElement("p");
  tid.innerText = "Tid: " + recipe.time + " minutter";
  tid.classList.add("tid");
  tid.id = `tid-${recipe.id}`;

  // Create and append image element
  const image = document.createElement("img");
  image.src = "./IMG/FoodImage.jpeg";
  image.alt = "Stock Image";
  kort.appendChild(image);

  // Append skill level, title, ingredients, and time to the card
  kort.appendChild(tittel);
  kort.appendChild(tid);
  kort.appendChild(skillLevelText);

  // Add event listener to enlarge the card when clicked
  kort.addEventListener("click", () => enlargeRecipeCard(recipe));

  // Append the card to the container
  kortContainer.appendChild(kort);
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

  // Prompt the user to enter new values for each category
  const title = prompt("Enter new title:", recipe.title);
  const ingredients = prompt("Enter new ingredients:", recipe.ingredients);
  const instructions = prompt("Enter new instructions:", recipe.instructions);
  const time = prompt("Enter new time (in minutes):", recipe.time);

  // Get user ID
  const userId = userData.id;

  // Check if all required fields are filled
  if (title && ingredients && instructions && time) {
    // Prepare updated recipe data object
    const updatedRecipeData = {
      title: title,
      ingredients: ingredients,
      instructions: instructions,
      time: time,
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
async function saveEditedRecipe(recipeId, originalSkillLevel) {
  // Retrieve edited title, ingredients, instructions, and time from input fields
  const editedTitle = document.getElementById("editedTitle").value;
  const editedIngredients = document.getElementById("editedIngredients").value;
  const editedInstructions =
    document.getElementById("editedInstructions").value;
  const editedTime = document.getElementById("editedTime").value;

  try {
    // Prepare updated recipe data object
    const updatedRecipeData = {
      title: editedTitle,
      ingredients: editedIngredients,
      instructions: editedInstructions,
      time: editedTime,
      skill_level: originalSkillLevel, // Use the original skill level
    };

    // Send PUT request to update the recipe
    const updateResponse = await fetch(`/recipes/${recipeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedRecipeData),
    });

    // Check if the response is ok
    if (updateResponse.ok) {
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
