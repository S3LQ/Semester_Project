CREATE TABLE "Recipes" (
    recipeID INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title TEXT,
    ingredients TEXT,
    instructions TEXT
);
