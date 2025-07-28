const mongoose = require("mongoose");
const DBConnection = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://VenkatYadavilli:Venkat21%40@venkat-nodejs.bywux40.mongodb.net/devConnect"
    );
    console.log("DB Connected Successfully!...");
  } catch (e) {
    console.error(e);
  }
};

module.exports = DBConnection;
