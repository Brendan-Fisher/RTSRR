import { djikstra } from "./algorithms/djikstra"
import { BFS } from "./algorithms/BFS"

const API_URL = "http://localhost:9000";

/**
 * Function Used to create the adjacency list that is used in the pathfinding algorithms
 *  run once then stored in the database
 */
/*
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
*/

export function getStops() {
  return fetch(API_URL + "/stops")
    .then((res) => res.json())
    .then((stops) => {
      return stops;
    });
}

async function buildPath(path){
  var stops = await fetch(API_URL + "/stops").then((res) => res.json());
  var newPath = []

  for(var i = 0; i < path.length-1; i++){
    // eslint-disable-next-line
    newPath.push(stops.find(stop => stop.stop_id === path[i]));
  }
  newPath.push(path.length-1)
  return newPath
}

export async function Djikstra(obj) {
  return fetch(API_URL + "/edges")
    .then((res) => res.json())
    .then((edges) => {
      var t0 = new Date().getTime();
      var djikPath = djikstra(obj.from, obj.to, edges)
      var t1 = new Date().getTime();
      var dTime = t1-t0
      djikPath.push(dTime)
      return buildPath(djikPath)
    });
}

export async function Bfs(obj) {
  return fetch(API_URL + "/edges")
    .then((res) => res.json())
    .then((edges) => {
      var t0 = new Date().getTime();
      var bfsPath = BFS(obj.from, obj.to, edges)
      var t1 = new Date().getTime();
      var bTime = t1-t0
      bfsPath.push(bTime)
      return buildPath(bfsPath)
    })
}