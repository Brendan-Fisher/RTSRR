const express = require("express");
require("dotenv").config();
const router = express.Router();
const Stop = require("./stop.model");

/**
 * Router for localhost:9000/stops
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
 * Allows for lookup of individual stop based on its mongoose ObjectID
 */
router.route("/:id").get(function (req, res) {
  let id = req.params.id;
  Stop.findById(id, function (err, stop) {
    res.json(stop);
  });
});

/**
 * Allows for lookup of individual stop based on its unique stop_id
 */
router.route("/find/:id").get(function (req, res) {
  let stop_id = req.params.id;
  Stop.find({ stop_id: stop_id }, function (err, stop) {
    res.json(stop);
  });
});

router.route("/findPath").get(function (req, res) {
  let path = [];
  for(var i = 0; i < req.body.path.length; i++){
    Stop.find({ stop_id: req.body.path[i] }, function (err, stop) {
      path.push(stop)
    })
  }
  res.json(path)
})

/**
 * Router for localhost:9000/routes/add
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
