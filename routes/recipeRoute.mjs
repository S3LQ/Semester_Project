// recipeRoute.mjs
import express from "express";
import DBManager from "../modules/storageManager.mjs";
import Recipe from "../modules/recipe.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";

const RECIPE_API = express.Router();
RECIPE_API.use(express.json());

// Endpoint to create a recipe
RECIPE_API.post("/", async (req, res, next) => {
  const { title, ingredients, instructions, image } = req.body;

  // Check if all required fields are provided
  if (title && ingredients && instructions) {
    // Create a new Recipe object
    const recipe = new Recipe();
    recipe.title = title;
    recipe.ingredients = ingredients;
    recipe.instructions = instructions;
    recipe.image = image;

    try {
      // Save the recipe to the database
      await DBManager.createRecipe(recipe);

      // Send a success response with the created recipe
      res.status(HTTPCodes.SuccesfullRespons.Ok).json(recipe).end();
    } catch (error) {
      console.error("Error creating recipe:", error);
      // Send an error response if something goes wrong
      res.status(HTTPCodes.ServerErrorRespons.InternalError).end();
    }
  } else {
    // Send a bad request response if any required field is missing
    res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).end();
  }
});

// Endpoint to get recipes
RECIPE_API.get("/", async (req, res, next) => {
  try {
    const recipes = await DBManager.getRecipe();
    res.status(HTTPCodes.SuccesfullRespons.Ok).json(recipes).end();
  } catch (error) {
    console.error("Error getting recipes:", error);
    res.status(HTTPCodes.ServerErrorRespons.InternalError).end();
  }
});

// Endpoint to delete a recipe
RECIPE_API.delete("/:id", async (req, res, next) => {
  const recipeId = req.params.id;

  try {
    // Delete the recipe from the database
    await DBManager.deleteRecipe(recipeId);

    // Send a success response
    res
      .status(HTTPCodes.SuccesfullRespons.Ok)
      .json({ message: "Recipe deleted successfully" })
      .end();
  } catch (error) {
    console.error("Error deleting recipe:", error);
    // Send an error response if something goes wrong
    res.status(HTTPCodes.ServerErrorRespons.InternalError).end();
  }
});

// Endpoint to update a recipe
RECIPE_API.put("/:id", async (req, res, next) => {
  const recipeId = req.params.id;
  const updatedRecipeData = req.body;

  try {
    // Update the recipe in the database using the recipeId and updatedRecipeData
    await DBManager.updateRecipe(recipeId, updatedRecipeData);

    // Send a success response
    res
      .status(HTTPCodes.SuccesfullRespons.Ok)
      .json({ message: "Recipe updated successfully" })
      .end();
  } catch (error) {
    console.error("Error updating recipe:", error);
    // Send an error response if something goes wrong
    res.status(HTTPCodes.ServerErrorRespons.InternalError).end();
  }
});

export default RECIPE_API;
