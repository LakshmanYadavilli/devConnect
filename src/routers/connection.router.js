const express = require("express");
const connectionRouter = express.Router();
const validateAuth = require("../middlewares/validate.auth.middleware");
const validationConnection = require("../middlewares/validationConnection.middleware");
const ConnectionModel = require("../models/Connection");
const UserModel = require("../models/User");
const { SAFE_VARIABLES } = require("../utils/constant");
connectionRouter.post(
  "/:status/:toUserId",
  validateAuth,
  validationConnection,
  async (req, res) => {
    try {
      const isAlreadyExisted = !!(await ConnectionModel.findOne({
        fromUserId: req.userId,
        toUserId,
      }));
      // return res.send("everything is fine!")
      const reqUser = await UserModel.findById(toUserId);
      console.log({ reqUser });

      if (isAlreadyExisted) {
        return res.status(400).json({ message: "Already Requested" });
      }
      const details = await ConnectionModel.findOne({
        fromUserId: toUserId,
        toUserId: req.userId,
      }).populate([{ path: "fromUserId", select: ["firstName", "lastName"] }]);
      if (details) {
        console.log("details:::", details);

        if (details.status === "pass") {
          return res.status(400).json({
            message: `${details.fromUserId.firstName} ${details.fromUserId.lastName} Already shown Not Intrested!! `,
          });
        } else if (details.status === "interested") {
          details.status = "accepted";
          await details.save();
          return res.status(200).json({
            message: `${details.fromUserId.firstName} ${details.fromUserId.lastName} Already shown Intrested Now You both are Connected! `,
          });
        }
      }

      const newObj = await ConnectionModel({
        fromUserId: req.userId,
        toUserId,
        status,
      });
      console.log("newObj:::", newObj);

      await newObj.save();
      const toUser = await UserModel.findById(toUserId);
      const message =
        status === "interest"
          ? "Connection Sent to " + toUser.firstName + " " + toUser.lastName
          : "You have Ignored " + toUser.firstName + " " + toUser.lastName;

      return res.json({
        message,
      });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
);

connectionRouter.post(
  "/review/:status/:toUserId",
  validateAuth,
  async (req, res) => {
    try {
      const { status, toUserId } = req.params;
      const validStatus = ["accepted", "rejected"];
      if (!validStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid Status" });
      }
      const ConnectionObj = await ConnectionModel.findOne({
        fromUserId: toUserId,
        toUserId: req.userId,
      }).populate([{ path: "fromUserId", select: "firstName lastName" }]);
      if (ConnectionObj) {
        const { status: ConnectionObjStatus } = ConnectionObj;
        if (ConnectionObjStatus === "interested") {
          ConnectionObj.status = status;

          await ConnectionObj.save();
          return res.status(200).json({
            message: `You ${status} Connection of ${ConnectionObj.fromUserId.firstName} ${ConnectionObj.fromUserId.lastName} `,
          });
        } else if (ConnectionObjStatus === "pass") {
          res.status(400).json({
            messsage: `${ConnectionObj.fromUserId.firstName} ${ConnectionObj.fromUserId.lastName} Already Ignored Your Profile!`,
          });
        } else if (ConnectionObjStatus === "rejected") {
          res
            .status(400)
            .json({ message: "You Already Rejected the Connection!" });
        } else {
          res
            .status(400)
            .json({ message: "You Already Connected Each Other!" });
        }
      }
      res.status(404).json({ message: "You didn't recieved connection!" });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
);

connectionRouter.get("/connections", validateAuth, async (req, res) => {
  try {
    const obj = await ConnectionModel.find({
      $or: [
        { fromUserId: req.userId, status: "accepted" },
        { toUserId: req.userId, status: "accepted" },
      ],
    }).populate([
      { path: "toUserId", select: SAFE_VARIABLES },
      { path: "fromUserId", select: SAFE_VARIABLES },
    ]);
    const connectionRes = obj.map((item) => {
      if (item.fromUserId._id.toString() === req.userId.toString()) {
        return item.toUserId;
      }
      return item.fromUserId;
    });
    res.json({ data: connectionRes });
  } catch (e) {
    res.json({ message: e.message });
  }
});

connectionRouter.get("/requests", validateAuth, async (req, res) => {
  try {
    const obj = await ConnectionModel.find({
      toUserId: req.userId,
      status: "interested",
    }).populate([{ path: "fromUserId", select: SAFE_VARIABLES }]);

    res.json({ data: obj });
  } catch (e) {
    res.json({ message: e.message });
  }
});

module.exports = connectionRouter;
