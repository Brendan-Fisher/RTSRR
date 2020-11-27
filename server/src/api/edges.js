const express = require("express");
require("dotenv").config();
const router = express.Router();
const Edge = require("./edge.model");
const Route = require("./route.model");

router.route("/").get(function (req, res) {
  Edge.find(function (err, edges) {
    if (err) {
      console.log(err);
    } else {
      res.json(edges);
    }
  });
  /*
  Route.find(function (err, routes) {
    if (err) {
      console.log(err);
    } else {
      let list = new Map();
      for (var i = 0; i < routes.length; i++) {
        for (var j = 0; j < routes[i].stops.length; j++) {
          var stop_id = routes[i].stops[j];

          if (j == routes[i].stops.length - 1) {
            var edge = {
              dest: routes[i].stops[0],
              weight: 0,
            };
          } else {
            var edge = {
              dest: routes[i].stops[j + 1],
              weight: 0,
            };
          }

          let item = new Edge(edge);
          if (list.has(stop_id)) {
            var node = list.get(stop_id);
            let hasEdge = node.some((e) => e["dest"] === item.dest);
            if (!hasEdge) {
              node.push(item);
            }
          } else {
            list.set(stop_id, [item]);
          }
        }
      }
      var jsonText = Array.from(list.entries());

      res.json(jsonText);
    }
  });
  */
});

router.route("/add").post(function (req, res) {
  console.log("Unable to add edges, database has been filled");
  /*
  if (req.body.batch) {
    Edge.create(req.body.batch, function (err) {
      if (err) res.send(err);
      else res.json(req.body);
    });
  } else {
    let EdgeObj = new Edge(req.body);

    EdgeObj.save()
      .then((EdgeObj) => {
        res.status(200).send("Edge added successfully");
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send(err);
      });
  }
  */
});

router.route("/addWeight").get(function (req, res) {
  if (req.body.batch) {
    for (var i = 0; i < req.body.batch; i++) {
      var from = req.body.from;
      var to = req.body.to;
      var weight = req.body.weight;

      Edge.updateOne(
        { src: from, "edges.dest": to },
        { $inc: { "edges.$.weight": weight } },
        function (err) {
          if (err) res.json(err);
          else res.status(200).send("Edge updated");
        }
      );
    }
  } else {
    var from = req.body.from;
    var to = req.body.to;
    var weight = req.body.weight;

    Edge.updateOne(
      { src: from, "edges.dest": to },
      { $inc: { "edges.$.weight": weight } },
      function (err) {
        if (err) res.json(err);
        else res.status(200).send("Edge updated");
      }
    );
  }
});

module.exports = router;
