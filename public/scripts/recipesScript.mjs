// recipeScript.mjs

export function leggTilOppskrift() {
  // Check if a user is logged in
  const userData = JSON.parse(localStorage.getItem("userData"));
  if (!userData) {
    alert("You need to log in to add recipes.");
    return;
  }

  // Retrieve recipe data from the form
  const title = document.getElementById("tittel").value;
  const ingredients = document.getElementById("ingredienser").value;
  const instructions = document.getElementById("instruksjoner").value;
  const imageInput = document.getElementById("image");
  const image = imageInput.files.length > 0 ? imageInput.files[0] : null;

  // Get the user ID
  const userId = userData.id;

  // Check if title, ingredients, and instructions are filled
  if (title && ingredients && instructions) {
    const recipeData = {
      title: title,
      ingredients: ingredients,
      instructions: instructions,
      image: image,
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

        // Render the newly added recipe card
        renderRecipeCard(recipe);

        // Reset the form
        document.getElementById("tittel").value = "";
        document.getElementById("ingredienser").value = "";
        document.getElementById("instruksjoner").value = "";
        document.getElementById("image").value = null;
      })
      .catch((error) => {
        console.error("Error adding recipe:", error);
        alert("Failed to add recipe. Please try again.");
      });
  } else {
    alert("Fill out all required fields.");
  }
}

function renderRecipeCard(recipe) {
  const kortContainer = document.getElementById("kortContainer");

  const kort = document.createElement("div");
  kort.classList.add("kort");
  kort.id = `kort-${recipe.id}`;

  const tittel = document.createElement("h3");
  tittel.innerText = "Title: " + recipe.title;
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

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  const editButton = document.createElement("button");
  editButton.innerText = "Rediger";
  editButton.id = `redigerKnapp-${recipe.id}`; // Set the correct ID for the edit button
  editButton.classList.add("edit-button"); // Add a class for styling
  editButton.onclick = () => redigerOppskrift(recipe.id, recipe); // Pass the recipe ID here

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Slett";
  deleteButton.classList.add("deleteButton"); // Add the correct class name here
  deleteButton.id = `fjernKnapp-${recipe.id}`;
  deleteButton.onclick = () => fjernOppskrift(`kort-${recipe.id}`);

  buttonContainer.appendChild(editButton);
  buttonContainer.appendChild(deleteButton);

  kort.appendChild(tittel);
  kort.appendChild(ingredienser);
  kort.appendChild(instruksjoner);
  kort.appendChild(buttonContainer);

  kortContainer.appendChild(kort);
}

export function fjernOppskrift(recipeCardId) {
  if (typeof recipeCardId !== "string") {
    console.error("Recipe card ID must be a string.");
    return;
  }

  const id = recipeCardId.split("-")[1];
  fetch(`/recipes/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        const kort = document.getElementById(recipeCardId);
        kort.remove();
        console.log("Recipe deleted successfully:");
      } else {
        throw new Error("Failed to delete recipe.");
      }
    })
    .catch((error) => {
      console.error("Error deleting recipe:", error);
      alert("Failed to delete recipe. Please try again.");
    });
}

let editMode = false;

export function redigerOppskrift(recipeId, recipe) {
  const tittelElement = document.getElementById(`tittel-${recipeId}`);
  const ingredienserElement = document.getElementById(
    `ingredienser-${recipeId}`
  );
  const instruksjonerElement = document.getElementById(
    `instruksjoner-${recipeId}`
  );

  if (!tittelElement || !ingredienserElement || !instruksjonerElement) {
    console.error(
      `Recipe elements with id 'tittel-${recipeId}', 'ingredienser-${recipeId}', or 'instruksjoner-${recipeId}' not found.`
    );
    return;
  }

  // Remove the edit button if it exists and if not in edit mode
  if (!editMode) {
    const editButton = document.getElementById(`redigerKnapp-${recipeId}`);
    if (editButton) {
      editButton.remove();
    }
  }

  // Remove any existing delete button
  const existingDeleteButton = document.getElementById(
    `fjernKnapp-${recipeId}`
  );
  if (existingDeleteButton) {
    existingDeleteButton.remove();
  }

  // Remove any existing buttons container
  const existingButtonsContainer = document.getElementById(
    `buttonsContainer-${recipeId}`
  );
  if (existingButtonsContainer) {
    existingButtonsContainer.remove();
  }

  const titleMarker = document.createElement("span");
  titleMarker.className = "title-marker";
  titleMarker.innerText = " ";
  tittelElement.insertBefore(titleMarker, tittelElement.firstChild);

  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.value = recipe.title;
  titleInput.id = `redigertTittel-${recipeId}`;

  tittelElement.appendChild(titleInput);

  const ingredientsInput = document.createElement("textarea");
  ingredientsInput.value = recipe.ingredients;
  ingredientsInput.id = `redigertIngredienser-${recipeId}`;

  ingredienserElement.appendChild(ingredientsInput);

  const instructionsInput = document.createElement("textarea");
  instructionsInput.value = recipe.instructions;
  instructionsInput.id = `redigertInstruksjoner-${recipeId}`;

  instruksjonerElement.appendChild(instructionsInput);

  // Create a container for delete and update buttons
  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("buttons-container");
  buttonsContainer.id = `buttonsContainer-${recipeId}`;

  // Create delete button
  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Slett";
  deleteButton.classList.add("deleteButton");
  deleteButton.id = `fjernKnapp-${recipeId}`;
  deleteButton.onclick = () => fjernOppskrift(`kort-${recipeId}`);

  // Create update button
  const oppdaterKnapp = document.createElement("button");
  oppdaterKnapp.innerText = "Oppdater";
  oppdaterKnapp.id = `oppdaterKnapp-${recipeId}`;
  oppdaterKnapp.classList.add("oppdater-gronn");
  oppdaterKnapp.addEventListener("click", () => {
    oppdaterOppskrift(recipeId, recipe.id);
    // Set edit mode to false after updating
    editMode = false;
  });

  // Append buttons to the container
  buttonsContainer.appendChild(deleteButton);
  buttonsContainer.appendChild(oppdaterKnapp);

  // Append the container to the existing recipe card
  const kort = document.getElementById(`kort-${recipeId}`);
  kort.appendChild(buttonsContainer);

  // Set the edit mode flag to true
  editMode = true;
}

export function oppdaterOppskrift(index, recipeId) {
  const redigertTittel = document.getElementById(
    `redigertTittel-${index}`
  ).value;
  const redigertIngredienser = document.getElementById(
    `redigertIngredienser-${index}`
  ).value;
  const redigertInstruksjoner = document.getElementById(
    `redigertInstruksjoner-${index}`
  ).value;

  const updatedRecipe = {
    id: recipeId,
    title: redigertTittel,
    ingredients: redigertIngredienser,
    instructions: redigertInstruksjoner,
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

        // Update the recipe card with the updated information
        const kort = document.getElementById(`kort-${index}`);
        const tittelElement = kort.querySelector(".tittel");
        const ingredienserElement = kort.querySelector(".ingredienser");
        const instruksjonerElement = kort.querySelector(".instruksjoner");

        if (tittelElement && ingredienserElement && instruksjonerElement) {
          // Update title
          tittelElement.innerText = `Tittel: ${updatedRecipe.title}`;

          // Update ingredients
          ingredienserElement.innerText = `Ingredienser: ${updatedRecipe.ingredients}`;

          // Update instructions
          instruksjonerElement.innerText = `Instruksjoner: ${updatedRecipe.instructions}`;

          // Remove the input fields
          const inputFields = kort.querySelectorAll("input, textarea");
          inputFields.forEach((field) => field.remove());

          // Remove any existing edit buttons
          const existingEditButtons = kort.querySelectorAll(".edit-button");
          existingEditButtons.forEach((button) => button.remove());

          // Remove the update button
          const existingUpdateButton = kort.querySelector(".oppdater-gronn");
          if (existingUpdateButton) {
            existingUpdateButton.remove();
          }

          // Add edit button
          const editButton = document.createElement("button");
          editButton.innerText = "Rediger";
          editButton.classList.add("edit-button");
          editButton.onclick = () => redigerOppskrift(recipeId, updatedRecipe);
          kort.appendChild(editButton);
        } else {
          console.error(
            `Recipe elements with class 'tittel', 'ingredienser', or 'instruksjoner' not found.`
          );
        }
      } else {
        throw new Error("Failed to update recipe.");
      }
    })
    .catch((error) => {
      console.error("Error updating recipe:", error);
      alert("Failed to update recipe. Please try again.");
    });
}
