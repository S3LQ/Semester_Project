import express from "express";
import DBManager from "../modules/storageManager.mjs";
import Recipe from "../modules/recipe.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";

// Create a router for handling recipe-related API endpoints
const RECIPE_API = express.Router();
RECIPE_API.use(express.json());

// Endpoint to handle creation of a new recipe
RECIPE_API.post("/", async (req, res) => {
  // Extract data from request body
  const { title, ingredients, instructions, userId } = req.body;

  // Check if all required fields are provided
  if (title && ingredients && instructions && userId) {
    // Create a new Recipe instance with provided data
    const recipe = new Recipe();
    recipe.title = title;
    recipe.ingredients = ingredients;
    recipe.instructions = instructions;
    recipe.creatorID = userId;

    try {
      // Call DBManager to create the recipe in the database
      await DBManager.createRecipe(recipe);

      // Send success response with the created recipe data
      res.status(HTTPCodes.SuccesfullRespons.Ok).json(recipe);
    } catch (error) {
      // Handle and log errors if any occurred during recipe creation
      console.error("Error creating recipe:", error);
      res.status(HTTPCodes.ServerErrorRespons.InternalError).end();
    }
  } else {
    // Send bad request response if any required field is missing
    res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).end();
  }
});

// Endpoint to retrieve all recipes
RECIPE_API.get("/", async (req, res) => {
  try {
    // Retrieve all recipes from the database using DBManager
    const recipes = await DBManager.getAllRecipes();

    // Send success response with the retrieved recipes
    res.status(HTTPCodes.SuccesfullRespons.Ok).json(recipes);
  } catch (error) {
    // Handle and log errors if any occurred during retrieval of recipes
    console.error("Error getting recipes:", error);
    res.status(HTTPCodes.ServerErrorRespons.InternalError).end();
  }
});

// Endpoint to delete a recipe by its ID
RECIPE_API.delete("/:id", async (req, res) => {
  // Extract recipe ID from request parameters
  const recipeId = req.params.id;

  try {
    // Call DBManager to delete the recipe from the database
    await DBManager.deleteRecipe(recipeId);

    // Send success response indicating successful deletion
    res
      .status(HTTPCodes.SuccesfullRespons.Ok)
      .json({ message: "Recipe deleted successfully" });
  } catch (error) {
    // Handle and log errors if any occurred during deletion of recipe
    console.error("Error deleting recipe:", error);
    res.status(HTTPCodes.ServerErrorRespons.InternalError).end();
  }
});

// Endpoint to update a recipe by its ID
RECIPE_API.put("/:id", async (req, res) => {
  // Extract recipe ID and updated recipe data from request parameters and body
  const recipeId = req.params.id;
  const updatedRecipeData = req.body;

  try {
    // Call DBManager to update the recipe in the database
    await DBManager.updateRecipe(recipeId, updatedRecipeData);

    // Send success response indicating successful update
    res
      .status(HTTPCodes.SuccesfullRespons.Ok)
      .json({ message: "Recipe updated successfully" });
  } catch (error) {
    // Handle and log errors if any occurred during update of recipe
    console.error("Error updating recipe:", error);
    res.status(HTTPCodes.ServerErrorRespons.InternalError).end();
  }
});

// Export the router for use in other parts of the application
export default RECIPE_API;
