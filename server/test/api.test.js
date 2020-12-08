const request = require("supertest");

const app = require("../src/app");

/**
 * Tests used to get the database working properly
 * Disabled to protect database from being modified
 */

/*
describe("GET /stops", () => {
  it("responds with a json object", (done) => {
    request(app)
      .get("/stops")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
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
      edges: [{ 4004578: 5 }, { 7812398: 8 }],
    };
    request(app)
      .post("/stops/add")
      .send(result)
      .set("Accept", "application/json")
      .expect("Content-Type", /text\/html/)
      .expect(200, done);
  });
});

describe("POST /routes/add", () => {
  it("inserts a new route", (done) => {
    const result = {
      short_name: "125",
      route_id: "1234567",
      long_name: "test route",
      stops: ["4004578"],
    };
    request(app)
      .post("/routes/add")
      .send(result)
      .set("Accept", "application/json")
      .expect("Content-Type", /text\/html/)
      .expect(200, done);
  });
});

describe("GET /routes", () => {
  it("responds with a json object", (done) => {
    request(app)
      .get("/routes")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, done);
  });
});
*/