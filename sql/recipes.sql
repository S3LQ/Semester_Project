CREATE TABLE "Recipes" (
    recipeID integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tittel text,
    ingredients text,
    instructions text,
    image bytea,
);

