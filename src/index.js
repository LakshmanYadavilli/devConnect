const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const User = require("./models/User");
const ConnectionModel = require("./models/Connection");
const preventUnallowedUpdates = require("./middlewares/preventUnallowedUpdates.middleware");
const userSchema = require("./valdiations/signupReqBodySchema");
const authRouter = require("./routers/auth.router");
const connectionRouter = require("./routers/connection.router");
const userRouter = require("./routers/user.router");
const DBConnection = require("./configs/MongoDB");
const cookieParser = require("cookie-parser");
const JWT = require("jsonwebtoken");
const validateAuth = require("./middlewares/validate.auth.middleware");
const validationConnectionRoute = require("./middlewares/validationConnection.middleware");
const { SAFE_VARIABLES } = require("./utils/constant");
require("dotenv").config();

const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRouter);
app.use("/connection", connectionRouter);
app.use("/user", userRouter);

app.post("/reset-password", validateAuth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.userId);
    const isPassword = user.isVerifiedPassword(oldPassword);
    if (!isPassword) {
      return res.status(401).json({ message: "Incorrect Old Password" });
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashPassword;
    await user.save();
    res.send("Password Reset Successful");
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});
app.get("/feed", validateAuth, async (req, res) => {
  let hideIds = await ConnectionModel.find({
    $or: [
      {
        fromUserId: req.userId,
      },
      {
        toUserId: req.userId,
      },
    ],
  }).populate([
    { path: "fromUserId", select: "firstName lastName" },
    { path: "toUserId", select: "firstName lastName" },
  ]);

  const uniqueIds = new Set();
  uniqueIds.add(req.userId);

  hideIds.forEach((item) => {
    if (item.fromUserId._id.toString() === req.userId.toString()) {
      uniqueIds.add(item.toUserId._id);
    } else {
      uniqueIds.add(item.fromUserId._id);
    }
  });
  const uniqueIdsArr = Array.from(uniqueIds);
  console.log({ uniqueIds });
  const response = await User.find({
    _id: { $nin: uniqueIdsArr },
  })
    .select(SAFE_VARIABLES)
    .skip(0)
    .limit(10);
  res.json({ data: response });
});
DBConnection().then(() => {
  app.listen(3000, () => console.log("Server listening on port:3000"));
});
