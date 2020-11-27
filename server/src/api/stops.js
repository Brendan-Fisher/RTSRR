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

router.route("/find/:id").get(function (req, res) {
  let stop_id = req.params.id;
  Stop.find({ stop_id: stop_id }, function (err, stop) {
    res.json(stop);
  });
});

router.route("/add").post(function (req, res) {
  console.log("Unable to add stops, database has been filled");
  /*
  if (req.body.batch) {
    Stop.create(req.body.batch, function (err) {
      if (err) res.send(err);
      else res.json(req.body);
    });
  } else {
    let stop = new Stop(req.body);
    stop
      .save()
      .then((stop) => {
        res.status(200).send("stop added successfully");
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  }
  */
});

module.exports = router;
