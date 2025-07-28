const User = require("../models/User");
const bcrypt = require("bcrypt");
const userSchema = require("../valdiations/signupReqBodySchema");
const JWT = require("jsonwebtoken");
class AuthController {
  static async login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log({ user });
    if (!user) {
      res.status(404).send("User Not Found");
    } else {
      const isPasswordMatch = user.isVerifiedPassword(password);
      if (!isPasswordMatch) {
        res.status(401).send("Invalid Credentials");
      } else {
        const JWTToken = user.createJWT();
        res.cookie("token", JWTToken, {
          httpOnly: true,
        });

        res.send("Login Successful");
      }
    }
  }
  static async signup(req, res) {
    try {
      const { body } = req;

      const { error } = userSchema.validate(body);
      if (error) {
        res.status(400).send(error);
      } else {
        const hashPassword = await bcrypt.hash(body.password, 10);

        const user = new User({
          ...body,
          password: hashPassword,
        });
        await user.save();
        const JWTToken = user.createJWT();
        res.cookie("token", JWTToken, {
          httpOnly: true,
        });
        res.send("User Registration Successful!");
      }
    } catch (err) {
      console.log("err from register:::", err.name);
      if (err.name === "ValidationError") {
        res.status(400).send(err.message);
      } else if (err.code === 11000) {
        res.status(409).send(err.message);
      } else {
        res.status(500);
      }
    }
  }
  static logout(req, res) {
    res.clearCookie("token");
    res.send("Logout Successful");
  }
}
module.exports = AuthController;
