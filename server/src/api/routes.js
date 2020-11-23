const express = require("express");
require("dotenv").config();
const router = express.Router();
const Route = require("./route.model");

router.route("/").get(function (req, res) {
  Route.find(function (err, routes) {
    if (err) {
      console.log(err);
    } else {
      res.json(routes);
    }
  });
});

router.route("/:id").get(function (req, res) {
  let id = req.params.id;
  Route.findById(id, function (err, route) {
    res.json(route);
  });
});

router.route("/add").post(function (req, res) {
  let RouteObj = new Route(req.body);

  RouteObj.save()
    .then((RouteObj) => {
      res.status(200).send("route added successfully");
    })
    .catch((err) => {
      res.status(400).send("adding new route failed");
    });
});

module.exports = router;
