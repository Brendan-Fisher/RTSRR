const express = require("express");
require("dotenv").config();
const router = express.Router();
const Stop = require("./stop.model");

router.route("/").get(function (req, res) {
  Stop.find(function (err, stops) {
    if (err) {
      console.log(err);
    } else {
      res.json(stops);
    }
  });
});

router.route("/:id").get(function (req, res) {
  let id = req.params.id;
  Stop.findById(id, function (err, stop) {
    res.json(stop);
  });
});

router.route("/add").post(function (req, res) {
  let stop = new Stop(req.body);
  stop
    .save()
    .then((stop) => {
      res.status(200).send("stop added successfully");
    })
    .catch((err) => {
      res.status(400).send("adding new stop failed");
    });
});

module.exports = router;
