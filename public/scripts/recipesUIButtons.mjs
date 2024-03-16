document
  .getElementById("addRecipeButton")
  .addEventListener("click", function () {
    const formWrapper = document.getElementById("formWrapper");
    formWrapper.style.display =
      formWrapper.style.display === "none" ? "block" : "none";

    this.style.display = "none";

    const pageTitle = document.getElementById("pageTitle");
    pageTitle.style.paddingBottom = "20px"; // Adjust as needed
  });

document.getElementById("leggTilKnapp").addEventListener("click", function () {
  const formWrapper = document.getElementById("formWrapper");
  formWrapper.style.display = "none";

  document.getElementById("addRecipeButton").style.display = "block";

  document.getElementById("pageTitle").style.paddingTop = "0";
});

function goBackToLogin() {
  localStorage.removeItem("userData");

  window.location.href = "index.html";
}

// Event listener for skill level buttons
document.querySelectorAll(".skill-level-button").forEach((button) => {
  button.addEventListener("click", function () {
    // Remove "selected" class from all buttons
    document.querySelectorAll(".skill-level-button").forEach((btn) => {
      btn.classList.remove("selected");
    });

    // Add "selected" class to the clicked button
    this.classList.add("selected");
  });
});
