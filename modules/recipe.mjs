import DBManager from "./storageManager.mjs";

class Recipe {
  constructor(title, ingredients, instructions, recipeID) {
    this.title = title;
    this.ingredients = ingredients;
    this.instructions = instructions;
    this.recipeID = recipeID;
  }

  async save() {
    if (this.id == null) {
      return await DBManager.createRecipe(this);
    } else {
      return await DBManager.updateRecipe(this);
    }
  }

  delete() {
    DBManager.deleteRecipe(this);
  }
}

export default Recipe;
