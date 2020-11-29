const express = require("express");
require("dotenv").config();
const router = express.Router();
const Edge = require("./edge.model");
const Route = require("./route.model");

/**
 * Helper function used to create the edges
 *  For every route in the database, each stop in that route points to the stop that follows it
 *  The final stop in every route then points to the first stop
 */
function makePairs() {
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
}

/**
 * Router for localhost:9000/edges
 *  returns all of the edges in the database
 */
router.route("/").get(function (req, res) {
  Edge.find(function (err, edges) {
    if (err) {
      console.log(err);
    } else {
      res.json(edges);
    }
  });
});

/**
 * Router for localhost:9000/edges/add
 *  Adds new edges to the database
 *  Allows for adding new edges in batches
 *  Used postman to add all edges after using makePairs() to create them
 */
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

/**
 * Router for localhost:9000/edges/addWeight
 *  After creating the edges, this function allows user to add the weights to each edge
 *  Weights were determined by using a Distance API to get a reasonable measure for how far a car would travel to get from one stop to another
 */
router.route("/addWeight").get(function (req, res) {
  if (req.body.batch) {
    for (var i = 0; i < req.body.batch.length; i++) {
      var from = req.body.batch[i].from;
      var to = req.body.batch[i].to;
      var weight = req.body.batch[i].weight;

      Edge.updateOne(
        { src: from, "edges.dest": to },
        { $set: { "edges.$.weight": weight } },
        function (err) {
          if (err) console.log(err);
          else console.log("Edges updated");
        }
      );
    }
  } else {
    var from = req.body.from;
    var to = req.body.to;
    var weight = req.body.weight;

    Edge.updateOne(
      { src: from, "edges.dest": to },
      { $set: { "edges.$.weight": weight } },
      function (err) {
        if (err) res.json(err);
        else res.status(200).send("Edge updated");
      }
    );
  }
});

module.exports = router;
