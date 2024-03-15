import pg from "pg";

class DBManager {
  #credentials = {};

  // Constructor to initialize the database credentials
  constructor(connectionString) {
    this.#credentials = {
      connectionString,
      ssl: process.env.DB_SSL === "true" ? true : false,
    };
  }

  // Function to update a user in the database
  async updateUser(user) {
    const client = new pg.Client(this.#credentials);

    try {
      await client.connect();
      await client.query(
        'Update "public"."Users" set "name" = $1, "email" = $2, "password" = $3 where id = $4;',
        [user.name, user.email, user.pswHash, user.id]
      );
    } catch (error) {
      console.error(error);
    } finally {
      client.end();
    }

    return user;
  }

  // Function to delete a user from the database
  async deleteUser(user) {
    const client = new pg.Client(this.#credentials);

    try {
      await client.connect();
      await client.query('Delete from "public"."Users"  where id = $1;', [
        user.id,
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      client.end();
    }

    return user;
  }

  // Function to create a new user in the database
  async createUser(user) {
    const client = new pg.Client(this.#credentials);

    try {
      await client.connect();
      const output = await client.query(
        'INSERT INTO "public"."Users"("name", "email", "password") VALUES($1::Text, $2::Text, $3::Text) RETURNING id;',
        [user.name, user.email, user.pswHash]
      );

      if (output.rows.length == 1) {
        user.id = output.rows[0].id;
      }
    } catch (error) {
      console.error(error);
    } finally {
      client.end();
    }

    return user;
  }

  // Function to get a user from the database based on password hash
  async getUser(pswHash) {
    const client = new pg.Client(this.#credentials);

    try {
      await client.connect();
      const output = await client.query(
        'SELECT * FROM "public"."Users" WHERE "password" = $1',
        [pswHash]
      );
      return output.rows;
    } catch (error) {
      console.error(error);
    } finally {
      client.end();
    }
  }

  // Function to update a recipe in the database
  async updateRecipe(recipeId, updatedRecipeData) {
    const client = new pg.Client(this.#credentials);

    try {
      await client.connect();
      await client.query(
        'UPDATE "public"."Recipes" SET "title" = $1, "ingredients" = $2, "instructions" = $3, "time" = $4, "skill_level" = $5 WHERE id = $6;',
        [
          updatedRecipeData.title,
          updatedRecipeData.ingredients,
          updatedRecipeData.instructions,
          updatedRecipeData.time,
          updatedRecipeData.skill_level,
          recipeId,
        ]
      );
    } catch (error) {
      console.error(error);
    } finally {
      client.end();
    }

    return updatedRecipeData;
  }

  // Function to delete a recipe from the database
  async deleteRecipe(recipeId) {
    const client = new pg.Client(this.#credentials);

    try {
      await client.connect();
      await client.query('DELETE FROM "public"."Recipes" WHERE id = $1;', [
        recipeId,
      ]);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      client.end();
    }
  }

  // Function to create a new recipe in the database
  async createRecipe(recipe) {
    const client = new pg.Client(this.#credentials);

    try {
      await client.connect();
      const output = await client.query(
        'INSERT INTO "public"."Recipes"("title", "ingredients", "instructions", "time", "creatorID", "skill_level") VALUES($1::Text, $2::Text, $3::Text, $4::Text, $5::Integer, $6::Text) RETURNING id;',
        [
          recipe.title,
          recipe.ingredients,
          recipe.instructions,
          recipe.time,
          recipe.creatorID,
          recipe.skillLevel,
        ]
      );

      if (output.rows.length == 1) {
        recipe.id = output.rows[0].id;
      }
    } catch (error) {
      console.error(error);
      throw error; // Ensure to throw the error for error handling in the caller function
    } finally {
      client.end();
    }

    return recipe;
  }

  // Function to get a recipe from the database by its ID
  async getRecipe(id) {
    const client = new pg.Client(this.#credentials);

    try {
      await client.connect();
      const output = await client.query(
        'SELECT * FROM "public"."Recipes" WHERE id = $1',
        [id]
      );

      if (output.rows.length > 0) {
        const recipe = output.rows[0];
        console.log("Retrieved Recipe:", recipe);
        return recipe;
      } else {
        console.log("No recipe found with ID:", id);
        return null;
      }
    } catch (error) {
      console.error("Error fetching recipe:", error);
      throw error; // Rethrow the error to handle it in the caller function
    } finally {
      client.end();
    }
  }

  // Function to get all recipes from the database
  async getAllRecipes() {
    const client = new pg.Client(this.#credentials);

    try {
      await client.connect();
      const output = await client.query('SELECT * FROM "public"."Recipes";');
      return output.rows;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      client.end();
    }
  }
}

let connectionString =
  process.env.ENVIORMENT == "local"
    ? process.env.DB_CONNECTIONSTRING_LOCAL
    : process.env.DB_CONNECTIONSTRING_PROD;

if (connectionString == undefined) {
  throw "You forgot the db connection string";
}

export default new DBManager(connectionString);
