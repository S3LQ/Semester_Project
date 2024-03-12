import "dotenv/config";
import express from "express";
import SuperLogger from "./modules/SuperLogger.mjs";
import printDeveloperStartupInportantInformationMSG from "./modules/developerHelpers.mjs";
import USER_API from "./routes/usersRoute.mjs";
import RECIPE_API from "./routes/recipeRoute.mjs";
import DBManager from "./modules/storageManager.mjs";

// Print important startup information for developers
printDeveloperStartupInportantInformationMSG();

// Create an instance of Express server
const server = express();

// Define the port number from environment variable or use 8080 as default
const port = process.env.PORT || 8080;
server.set("port", port);

// Create an instance of SuperLogger for logging
const logger = new SuperLogger();

// Use the auto HTTP request logger middleware provided by SuperLogger
server.use(logger.createAutoHTTPRequestLogger());

// Serve static files from the "public" directory
server.use(express.static("public"));

// Define routes for user-related operations
server.use("/user", USER_API);

// Define routes for recipe-related operations
server.use("/recipes", RECIPE_API);

// Define a basic route handler for the root path
server.get("/", (req, res, next) => {
  res
    .status(200)
    .send(JSON.stringify({ msg: "These are not the droids...." }))
    .end();
});

// Define a route handler for updating a recipe by its ID
server.put("/recipes/:id", async (req, res) => {
  const recipeId = req.params.id;
  const updatedRecipeData = req.body;

  try {
    // Update the recipe in the database using the provided data
    const updatedRecipe = await DBManager.updateRecipe(
      recipeId,
      updatedRecipeData
    );

    // Respond with a success message
    res.status(200).json({ message: "Recipe updated successfully" });
  } catch (error) {
    // Handle errors and respond with an error message
    console.error("Error updating recipe:", error);
    res.status(500).json({ error: "Failed to update recipe" });
  }
});

// Define a route handler for deleting a recipe by its ID
server.delete("/recipes/:id", (req, res) => {
  const recipeId = req.params.id;

  // Respond with a success message
  res.status(200).json({ message: "Recipe deleted successfully" });
});

// Start the server and listen on the specified port
server.listen(port, () => {});
