const express = require("express");
const User = require("../models/User");
const { SAFE_VARIABLES } = require("../utils/constant");

const userRouter = express.Router();
const validateAuth = require("../middlewares/validate.auth.middleware");
const preventUnallowedUpdates = require("../middlewares/preventUnallowedUpdates.middleware");

userRouter.get("/", validateAuth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId }).select(SAFE_VARIABLES);
    res.send(user);
  } catch (e) {
    console.error(e.message);
    res.status(401).send(e.message);
  }
});

userRouter.patch(
  "/",
  validateAuth,
  preventUnallowedUpdates,
  async (req, res) => {
    try {
      const obj = await User.findById(req.userId);
      // const obj = await User.findOneAndUpdate({ _id: req.userId }, req.body, {
      //   new: true,
      // });
      Object.keys(req.body).forEach((key) => (obj[key] = req.body[key]));
      await obj.save();

      res.send(obj);
    } catch (e) {
      console.error(e);
    }
  }
);

module.exports = userRouter;
