const validator = require("validator");
const User = require("../models/User");
const { message } = require("../valdiations/signupReqBodySchema");
const validationConnectionRoute = async (req, res, next) => {
  const { status, toUserId } = req.params;
  const statusArr = ["pass", "interested"];
  if (!statusArr.includes(status)) {
    return res
      .status(400)
      .json({ message: "Status must be in either pass/intersted!" });
  }
  if (!validator.isMongoId(toUserId)) {
    return res.status(400).json({ message: "To UserID is not MongoDB ID!" });
  }
  if (req.userId === toUserId) {
    return res
      .status(400)
      .json({ message: "from and To User shouldn't be same!" });
  }
  if (toUserId) {
    try {
      const user = await User.findById(toUserId);
      if (!user) {
        return res.status(400).json({ message: "To User is not existed !!" });
      }
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
  next();
};

module.exports = validationConnectionRoute;
