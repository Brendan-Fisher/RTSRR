const API_URL = "http://localhost:9000";

async function createPairs() {
  var edgeList = await fetch(API_URL + "/edges").then((res) => res.json());
  var stops = await fetch(API_URL + "/stops").then((res) => res.json());

  var pairs = [];
  for (var i = 0; i < edgeList.length; i++) {
    for (var j = 0; j < edgeList[i].edges.length; j++) {
      var edge = {
        from: "",
        to: "",
        weight: 0,
        pair: {},
      };
      var latlongpair = {
        t: "",
        t2: "",
      };

      let fromID = edgeList[i].src;
      let toID = edgeList[i].edges[j].dest;

      edge.from = fromID;
      edge.to = toID;

      var from = stops.find((stop) => {
        return stop.stop_id === fromID;
      });
      var to = stops.find((stop) => {
        return stop.stop_id === toID;
      });

      latlongpair.t = from.lat + "," + from.long;
      latlongpair.t2 = to.lat + "," + to.long;

      edge.pair = latlongpair;
      pairs.push(edge);
    }
  }

  console.log(JSON.stringify(pairs));
}

export function getStops() {
  return fetch(API_URL + "/stops")
    .then((res) => res.json())
    .then((stops) => {
      //createPairs();
      return stops;
    });
}

export function execute(obj) {
  return fetch(API_URL + "/edges")
    .then((res) => res.json())
    .then((edges) => {
      console.log("Edges retreived");
    });
}
