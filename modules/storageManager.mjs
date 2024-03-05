import pg from "pg";
import SuperLogger from "./SuperLogger.mjs";
import Recipe from "./recipe.mjs";

class DBManager {
  #credentials = {};

  constructor(connectionString) {
    this.#credentials = {
      connectionString,
      ssl: process.env.DB_SSL === "true" ? process.env.DB_SSL : false,
    };
  }

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

  async updateRecipe(recipe) {
    const client = new pg.Client(this.#credentials);

    try {
      await client.connect();
      await client.query(
        'Update "public"."Recipes" set "title" = $1, "ingredients" = $2, "instructions" = $3 where id = $4;',
        [recipe.title, recipe.ingredients, recipe.instructions, recipe.id]
      );
    } catch (error) {
      console.error(error);
    } finally {
      client.end();
    }

    return recipe;
  }

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

  async createRecipe(recipe) {
    const client = new pg.Client(this.#credentials);

    try {
      await client.connect();
      const output = await client.query(
        'INSERT INTO "public"."Recipes"("title", "ingredients", "instructions") VALUES($1::Text, $2::Text, $3::Text) RETURNING id;',
        [recipe.title, recipe.ingredients, recipe.instructions]
      );

      if (output.rows.length == 1) {
        recipe.id = output.rows[0].id;
      }
    } catch (error) {
      console.error(error);
    } finally {
      client.end();
    }

    return recipe;
  }

  async getRecipe(id) {
    const client = new pg.Client(this.#credentials);

    try {
      await client.connect();
      const output = await client.query(
        'SELECT * FROM "public"."Recipes" WHERE id = $1',
        [id]
      );
      return output.rows;
    } catch (error) {
      console.error(error);
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
