const API_URL = "http://localhost:9000";

export function getStops() {
  return fetch(API_URL + "/stops")
    .then((res) => res.json())
    .then((stops) => {
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
