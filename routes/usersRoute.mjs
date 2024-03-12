import express from "express";
import User from "../modules/user.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";
import DBManager from "../modules/storageManager.mjs";
import { createHashPassword } from "../modules/userAuth.mjs";

// Create a router for handling user-related API endpoints
const USER_API = express.Router();
USER_API.use(express.json());

// Endpoint to demonstrate logging functionality
USER_API.get("/", (req, res) => {
  // Log a demo message using SuperLogger
  SuperLogger.log("Demo of logging tool");
  SuperLogger.log("An important message", SuperLogger.LOGGING_LEVELS.CRITICAL);
});

// Endpoint to handle user creation or login
USER_API.post("/", async (req, res) => {
  // Extract data from request body
  const { name, email, authString, type } = req.body;

  // Check if the request is for creating a new user
  if (name != "" && email != "" && authString != "" && type === "createUser") {
    // Create a new User instance and set properties
    let user = new User();
    user.name = name;
    user.email = email;

    // Hash the password for security
    user.pswHash = createHashPassword(authString);

    let exists = false;

    // Check if the user already exists (example code, actual implementation may vary)
    if (!exists) {
      // Save the user to the database
      user = await user.save();
      // Send success response with the created user data
      res
        .status(HTTPCodes.SuccesfullRespons.Ok)
        .json(JSON.stringify(user))
        .end();
    } else {
      // Send bad request response if user already exists
      res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).end();
    }
  } else {
    // Check if the request is for user login
    if (email != "" && authString != "" && type === "login") {
      // Get existing user data from the database based on hashed password
      const getExistingUserData = await DBManager.getUser(
        createHashPassword(authString)
      );

      // Check if user data exists and send appropriate response
      if (getExistingUserData.length > 0) {
        res
          .status(HTTPCodes.SuccesfullRespons.Ok)
          .json(JSON.stringify(getExistingUserData))
          .end();
      } else {
        res
          .status(HTTPCodes.ClientSideErrorRespons.BadRequest)
          .send("feil")
          .end();
      }
    } else {
      // Send bad request response if required data fields are missing
      res
        .status(HTTPCodes.ClientSideErrorRespons.BadRequest)
        .send("Missing data fields")
        .end();
    }
  }
});

// Endpoint to delete a user by ID (example code, actual implementation may vary)
USER_API.delete("/:id", (req, res) => {
  // Create a new User instance
  const user = new User();
  // Call delete method to delete the user (example code, actual implementation may vary)
  user.delete();
});

// Export the router for use in other parts of the application
export default USER_API;
