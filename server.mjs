import "dotenv/config";
import express from "express";
import SuperLogger from "/Users/tveitsindre/Documents/Skole/Applikasjonsutvikling_2/semesterProjectDemo/modules/superLogger.mjs";
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

// Start the server
server.listen(server.get("port"), function () {
  console.log("server running", server.get("port"));
});
