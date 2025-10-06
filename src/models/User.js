const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const userSchema = Schema(
  {
    firstName: {
      type: String,
      reuire: true,
      maxLength: 30,
      trim: true,
    },
    lastName: {
      type: String,
      require: true,
      maxLength: 30,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(val) {
        if (!validator.isEmail(val)) {
          throw new Error("Not in Email Format");
        }
        return true;
      },
    },
    password: {
      type: String,
      validate(val) {
        if (!validator.isStrongPassword(val)) {
          throw new Error(
            "Password length Must be 8, minimum 1 number, 1 lower,1 upper and 1 symbol "
          );
        }
      },
      require: true,
    },
    gender: {
      type: String,
    },
    age: {
      type: Number,
      min: 18,
    },
    skills: {
      type: [String],
      default: [],
    },
    about: { type: String, default: "" },
  },
  { Timestamps: true }
);
userSchema.methods.isVerifiedPassword = function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};
userSchema.methods.createJWT = function () {
  console.log("creatJWT called:::");
  const user = this;
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    "devconnect21@"
  );
  console.log("token created:::", token);
  return token;
};

const User = model("User", userSchema);

module.exports = User;
