const express = require("express");
require("dotenv").config();
const router = express.Router();
const Stop = require("./stop.model");

/**
 * Router for /stops
 *  returns all of the stops in the database
 */
router.route("/").get(function (req, res) {
  Stop.find(function (err, stops) {
    if (err) {
      console.log(err);
    } else {
      res.json(stops);
    }
  });
});

/**
 * Router for /stops/find/
 *  returns the stop with a stop_id matching what you put after find/
 */
router.route("/find/:id").get(function (req, res) {
  let stop_id = req.params.id;
  Stop.find({ stop_id: stop_id }, function (err, stop) {
    res.json(stop);
  });
});

/**
 * Router for /stops/add
 *  Adds new stops to the database
 *  Allows for adding new stops in batches
 *  Used postman to add all stops after getting them from the Transloc API
 */
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
