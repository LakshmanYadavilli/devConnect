const { Schema, model } = require("mongoose");
const User = require("./User");

const Connection = Schema(
  {
    fromUserId: {
      type: String,
      ref: User,
      require: true,
    },
    toUserId: {
      type: String,
      ref: User,
      require: true,
    },
    status: {
      type: String,
      enum: {
        values: ["pass", "interested", "accepted", "rejected"],
        message: "{VALUE} is not Valid Status Role!.",
      },
    },
  },
  {
    timestamps: true,
  }
);

const ConectionModel = model("Connection", Connection);

module.exports = ConectionModel;
