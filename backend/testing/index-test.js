// importing the index module to test
const index = require("../index");

const request = require("supertest");
const express = require("express");
const app = express();

// setting up a new express app, avoiding starting app.listen in app.js
app.use(express.urlencoded({ extended: false }));
app.use("/", index);

test("index route works", done => {
  request(app)
    .get("/")
    .expect("Content-Type", /json/)
    .expect({ name: "frodo" })
    .expect(200, done);
});

// testing post request then get request after promise resolves to test array
test("testing route works", done => {
  request(app)
    .post("/test")
    .type("form")
    .send({ item: "hey" })
    .then(() => {
      request(app)
        .get("/test")
        .expect({ array: ["hey"] }, done);
    });
});