import DBManager from "./storageManager.mjs";

class Recipe {
  constructor(
    title,
    ingredients,
    instructions,
    time,
    skillLevel,
    id,
    creatorID
  ) {
    this.title = title;
    this.ingredients = ingredients;
    this.instructions = instructions;
    this.time = time;
    this.skillLevel = skillLevel;
    this.id = id;
    this.creatorID = creatorID;
  }

  async save() {
    if (this.id == null) {
      return await DBManager.createRecipe(this);
    } else {
      return await DBManager.updateRecipe(this.id, this);
    }
  }

  async delete() {
    await DBManager.deleteRecipe(this.id);
  }
}

export default Recipe;
