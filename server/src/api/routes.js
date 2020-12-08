const express = require("express");
require("dotenv").config();
const router = express.Router();
const Route = require("./route.model");

/**
 * Router for /routes
 *  returns all of the routes in the database
 */
router.route("/").get(function (req, res) {
  Route.find(function (err, routes) {
    if (err) {
      console.log(err);
    } else {
      res.json(routes);
    }
  });
});

/**
 * Router for /routes/find/
 *  Finds the route with the route_id matching what you put after find/
 */
router.route("/find/:id").get(function (req, res) {
  let route_id = req.params.id;
  Route.find({ route_id: route_id }, function (err, route) {
    res.json(route);
  });
});

/**
 * Router for /routes/add
 *  Adds new routes to the database
 *  Allows for adding new routes in batches
 *  Used postman to add all routes after getting them from the Transloc API
 */
router.route("/add").post(function (req, res) {
  console.log("Unable to add route, database has been filled");
  /*
  if (req.body.batch) {
    Route.create(req.body.batch, function (err) {
      if (err) res.send(err);
      else res.json(req.body);
    });
  } else {
    let RouteObj = new Route(req.body);

    RouteObj.save()
      .then((RouteObj) => {
        res.status(200).send("route added successfully");
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });
  }
  */
});

module.exports = router;
