import express from "express";
import User from "../modules/user.mjs";
import { HTTPCodes, HTTPMethods } from "../modules/httpConstants.mjs";

const USER_API = express.Router();
USER_API.use(express.json()); // <-- Parentheses were missing

const users = [];

USER_API.get("/:id", (req, res, next) => {
  //To do:
});

USER_API.post("/", (req, res, next) => {
  const { name, email, pswHash, creator } = req.body;
  console.log("User data:", { name, email, pswHash });
  if (name && email && pswHash) {
    const userExists = users.some((user) => user.email === email);

    if (!userExists) {
      const newUser = new User();
      newUser.id = btoa(name + email);
      newUser.name = name;
      newUser.email = email;
      newUser.pswHash = pswHash;

      users.push(newUser);

      console.log("User created successfully:", newUser);

      res.status(HTTPCodes.SuccesfullRespons.Ok).json({ userId: newUser.id });
    } else {
      console.log("User already exists");
      res
        .status(HTTPCodes.ClientSideErrorRespons.BadRequest)
        .send("User already exists")
        .end();
    }
  } else {
    console.log("Incomplete data fields");
    res
      .status(HTTPCodes.ClientSideErrorRespons.BadRequest)
      .send("Incomplete data fields")
      .end();
  }
});

USER_API.put("/:id", (req, res) => {
  // TODO: Edit user
});

USER_API.delete("/:id", (req, res) => {
  // TODO: Delete user.
});

export default USER_API;
