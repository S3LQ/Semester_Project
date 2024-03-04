import DBManager from "./storageManager.mjs";

class Recipe {
  constructor() {
    this.title;
    this.ingredients;
    this.instructions;
    this.recipeID;
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
