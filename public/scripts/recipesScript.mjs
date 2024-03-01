// recipesscript.mjs
let oppskriftsListe = [];
const userData = JSON.parse(localStorage.getItem("userData"));

export function leggTilOppskrift() {
  // Check if a user is logged in
  console.log(userData);
  if (!userData) {
    alert("You need to log in to add recipes.");
    return;
  }

  const tittel = document.getElementById("tittel").value;
  const ingredienser = document.getElementById("ingredienser").value;
  const instruksjoner = document.getElementById("instruksjoner").value;

  if (tittel && ingredienser && instruksjoner) {
    const oppskrift = { tittel, ingredienser, instruksjoner };
    oppskriftsListe.push(oppskrift);

    // Update cards
    oppdaterKortene();

    // Reset the form
    nullstillSkjema();
  } else {
    alert("Fill out all fields.");
  }
}

export function oppdaterKortene() {
  const kortContainer = document.getElementById("kortContainer");
  kortContainer.innerHTML = "";

  oppskriftsListe.forEach((oppskrift, index) => {
    const kort = lagOppskriftsKort(oppskrift, index);
    kortContainer.appendChild(kort);
  });
}

export function redigerOppskrift(index) {
  const tittelElement = document.getElementById(`tittel-${index}`);
  const tittelMarker = document.createElement("span");
  tittelMarker.className = "tittel-marker";
  tittelMarker.innerText = "Tittel:";
  tittelElement.insertBefore(tittelMarker, tittelElement.firstChild);

  const tittelInput = document.createElement("input");
  tittelInput.type = "text";
  tittelInput.value = oppskriftsListe[index].tittel;
  tittelInput.id = `redigertTittel-${index}`;

  tittelElement.innerHTML = "";
  tittelElement.appendChild(tittelMarker);
  tittelElement.appendChild(tittelInput);

  const kort = document.getElementById(`kort-${index}`);

  const ingredienserInput = document.createElement("textarea");
  ingredienserInput.value = oppskriftsListe[index].ingredienser;
  ingredienserInput.id = `redigertIngredienser-${index}`;

  const instruksjonerInput = document.createElement("textarea");
  instruksjonerInput.value = oppskriftsListe[index].instruksjoner;
  instruksjonerInput.id = `redigertInstruksjoner-${index}`;

  kort.querySelector(`#ingredienser-${index}`).innerHTML = "";
  kort.querySelector(`#ingredienser-${index}`).appendChild(ingredienserInput);

  kort.querySelector(`#instruksjoner-${index}`).innerHTML = "";
  kort.querySelector(`#instruksjoner-${index}`).appendChild(instruksjonerInput);

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
  const tittelMarker = document.querySelector(
    `#tittel-${index} .tittel-marker`
  );
  tittelMarker.parentNode.removeChild(tittelMarker);

  const redigertIngredienser = document.getElementById(
    `redigertIngredienser-${index}`
  ).value;
  const redigertInstruksjoner = document.getElementById(
    `redigertInstruksjoner-${index}`
  ).value;

  // Update the recipe in the recipe list
  oppskriftsListe[index].tittel = redigertTittel;
  oppskriftsListe[index].ingredienser = redigertIngredienser;
  oppskriftsListe[index].instruksjoner = redigertInstruksjoner;

  // Hide the update button and show the edit button
  document.getElementById(`oppdaterKnapp-${index}`).style.display = "none";
  document.getElementById(`redigerKnapp-${index}`).style.display = "inline";

  // Update the cards
  oppdaterKortene();
}

export function fjernOppskrift(index) {
  const kortContainer = document.getElementById("kortContainer");
  const kortElement = document.getElementById(`kort-${index}`);

  kortContainer.removeChild(kortElement);
  oppskriftsListe.splice(index, 1);
}

export function nullstillSkjema() {
  const skjema = document.getElementById("leggTilSkjema");
  skjema.reset();
}

function lagOppskriftsKort(oppskrift, index) {
  const kort = document.createElement("div");
  kort.id = `kort-${index}`;
  kort.className = "kort";
  kort.innerHTML = `
        <h3 id="tittel-${index}">${oppskrift.tittel}</h3>
        <p><strong>Ingredienser:</strong> <span id="ingredienser-${index}">${oppskrift.ingredienser}</span></p>
        <p><strong>Instruksjoner:</strong> <span id="instruksjoner-${index}">${oppskrift.instruksjoner}</span></p>
        <button type="button" id="redigerKnapp-${index}" class="rediger-knapp" onclick="redigerOppskrift(${index})">Edit</button>
        <button type="button" id="oppdaterKnapp-${index}" style="display: none;">Update</button>
        <button type="button" id="fjernKnapp-${index}" onclick="fjernOppskrift(${index})">Remove</button>
    `;

  // Add event listener for the edit button
  kort
    .querySelector(`#redigerKnapp-${index}`)
    .addEventListener("click", () => redigerOppskrift(index));

  return kort;
}
