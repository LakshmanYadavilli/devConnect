const express = require("express");

const app = express();
app.use("/dev", (req, res) => {
  res.send("Hello from /dev route");
});
app.use("/", (req, res) => res.send("Hello World from Express!"));

app.listen(3000, () => console.log("Server is running on port 3000"));
