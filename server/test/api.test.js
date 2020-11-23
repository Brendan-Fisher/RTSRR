const request = require("supertest");

const app = require("../src/app");

describe("GET /stops", () => {
  it("responds with a json object", (done) => {
    request(app)
      .get("/stops")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);
    done();
  });
});

describe("POST /stops/add", () => {
  it("inserts a new stop", (done) => {
    const result = {
      stop_id: "4004578",
      name: "GTEC",
      lat: 29.646206,
      long: -82.296212,
      routes: ["4004578"],
      edges: ["4004578", 5],
    };
    request(app)
      .post("/stops/add")
      .send(result)
      .set("Accept", "application/json")
      .expect("Content-Type", /text\/html/)
      .then((response) => {
        console.log(response);
        done();
      });
  });
});
