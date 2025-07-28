const express = require("express");
const AuthController = require("../controllers/AuthController");
const authRouter = express.Router();

authRouter.post("/signup", AuthController.signup);

authRouter.post("/login", AuthController.login);

authRouter.post("/logout", AuthController.logout);

module.exports = authRouter;
