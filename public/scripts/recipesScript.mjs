// recipesScript.mjs

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

  // Check if title, ingredients, and instructions are filled
  if (title && ingredients && instructions) {
    const recipeData = {
      title: title,
      ingredients: ingredients,
      instructions: instructions,
      image: image,
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
  tittel.innerText = recipe.title;

  const ingredienser = document.createElement("p");
  ingredienser.innerText = "Ingredienser: " + recipe.ingredients;

  const instruksjoner = document.createElement("p");
  instruksjoner.innerText = "Instruksjoner: " + recipe.instructions;

  const editButton = document.createElement("button");
  editButton.innerText = "Edit";
  editButton.onclick = () => redigerOppskrift(recipe.id);

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Delete";
  deleteButton.onclick = () => fjernOppskrift(recipe.id);

  kort.appendChild(tittel);
  kort.appendChild(ingredienser);
  kort.appendChild(instruksjoner);
  kort.appendChild(editButton);
  kort.appendChild(deleteButton);

  kortContainer.appendChild(kort);
}

export function fjernOppskrift(recipeId) {
  // Send a DELETE request to the server to delete the recipe
  fetch(`/recipes/${recipeId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        // Remove the recipe card from the UI
        const kort = document.getElementById(`kort-${recipeId}`);
        kort.remove();
      } else {
        throw new Error("Failed to delete recipe.");
      }
    })
    .catch((error) => {
      console.error("Error deleting recipe:", error);
      alert("Failed to delete recipe. Please try again.");
    });
}

let oppskriftsListe = [];

export function redigerOppskrift(index) {
  const titleElement = document.getElementById(`title-${index}`);
  const titleMarker = document.createElement("span");
  titleMarker.className = "title-marker";
  titleMarker.innerText = "title:";
  titleElement.insertBefore(titleMarker, titleElement.firstChild);

  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.value = oppskriftsListe[index].title;
  titleInput.id = `redigertTittel-${index}`;

  titleElement.innerHTML = "";
  titleElement.appendChild(titleMarker);
  titleElement.appendChild(titleInput);

  const oppdaterKnapp = document.getElementById(`oppdaterKnapp-${index}`);
  const fjernKnapp = document.getElementById(`fjernKnapp-${index}`);

  // Hide the edit button and show the update button
  oppdaterKnapp.style.display = "inline";
  oppdaterKnapp.classList.add("oppdater-gronn");
  fjernKnapp.style.display = "none";
  document.getElementById(`redigerKnapp-${index}`).style.display = "none";

  // Add event listener for the update button
  oppdaterKnapp.addEventListener("click", () => oppdaterOppskrift(index));
}

export function oppdaterOppskrift(index) {
  const redigertTittel = document.getElementById(
    `redigertTittel-${index}`
  ).value;
  const titleMarker = document.querySelector(`#title-${index} .title-marker`);
  titleMarker.parentNode.removeChild(titleMarker);

  const redigertIngredienser = document.getElementById(
    `redigertIngredienser-${index}`
  ).value;
  const redigertInstruksjoner = document.getElementById(
    `redigertInstruksjoner-${index}`
  ).value;

  // Update the recipe in the recipe list
  oppskriftsListe[index].title = redigertTittel;
  oppskriftsListe[index].ingredients = redigertIngredienser;
  oppskriftsListe[index].instructions = redigertInstruksjoner;

  // Hide the update button and show the edit button
  document.getElementById(`oppdaterKnapp-${index}`).style.display = "none";
  document.getElementById(`redigerKnapp-${index}`).style.display = "inline";

  // Update the cards
  leggTilOppskrift();
}
