import "dotenv/config";
import express from "express";
import SuperLogger from "./modules/SuperLogger.mjs";
import printDeveloperStartupInportantInformationMSG from "./modules/developerHelpers.mjs";
import USER_API from "./routes/usersRoute.mjs";
import RECIPE_API from "./routes/recipeRoute.mjs";
import DBManager from "./modules/storageManager.mjs"; // Import your database manager module

printDeveloperStartupInportantInformationMSG();

// Creating an instance of the server
const server = express();
// Selecting a port for the server to use.
const port = process.env.PORT || 8080;
server.set("port", port);

// Enable logging for server
const logger = new SuperLogger();
server.use(logger.createAutoHTTPRequestLogger()); // Will log all HTTP method requests

// Defining a folder that will contain static files.
server.use(express.static("public"));

// Telling the server to use the USER_API (all urls that use this code will have to have the /user after the base address)
server.use("/user", USER_API);

server.use("/recipes", RECIPE_API);

// A GET request handler example
server.get("/", (req, res, next) => {
  res
    .status(200)
    .send(JSON.stringify({ msg: "These are not the droids...." }))
    .end();
});

// PUT endpoint to update a recipe
server.put("/recipes/:id", async (req, res) => {
  const recipeId = req.params.id;
  const updatedRecipeData = req.body;

  try {
    console.log("Recipe ID:", recipeId); // Log recipe ID
    console.log("Updated Recipe Data:", updatedRecipeData); // Log updated recipe data

    // Update the recipe in the database
    const updatedRecipe = await DBManager.updateRecipe(
      recipeId,
      updatedRecipeData
    );

    console.log("Recipe updated successfully:", updatedRecipe); // Log successful update

    // Send a success response
    res.status(200).json({ message: "Recipe updated successfully" });
  } catch (error) {
    console.error("Error updating recipe:", error);
    // Send an error response if something goes wrong
    res.status(500).json({ error: "Failed to update recipe" });
  }
});

// DELETE endpoint to delete a recipe
server.delete("/recipes/:id", (req, res) => {
  // Here you can handle the deletion of a recipe using the recipe ID
  const recipeId = req.params.id;

  // Implement your logic to delete the recipe from the database

  res.status(200).json({ message: "Recipe deleted successfully" });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
