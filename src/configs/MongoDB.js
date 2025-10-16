const mongoose = require("mongoose");
const DBConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB Connected Successfully!...");
  } catch (e) {
    console.error(e);
  }
};

module.exports = DBConnection;
