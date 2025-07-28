const JWT = require("jsonwebtoken");
const User = require("../models/User");
const validateAuth = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    res.status(401).send("Authentication Token Missing");
  } else {
    JWT.verify(token, "devconnect21@", (err, decoded) => {
      if (err) {
        res.status(401).send("Invalid Token");
      } else {
        req.userId = decoded.userId;
        next();
      }
    });
  }
};

module.exports = validateAuth;
