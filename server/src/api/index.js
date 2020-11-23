const express = require("express");
const mongoose = require("mongoose");

const stops = require("./stops");
const routes = require("./routes");

const router = express.Router();

const uri = process.env.DATABASE_URL;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to RTSRR Database");
  })
  .catch((err) => console.log(err));

router.get("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/stops", stops);
router.use("/routes", routes);

module.exports = router;
