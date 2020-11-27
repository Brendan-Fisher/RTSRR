const mongoose = require("mongoose");
const { Schema } = mongoose;
const Joigoose = require("joigoose")(mongoose);
const Joi = require("joi");

let Edge = new Schema({
  src: String,
  edges: [{ dest: String, weight: Number }],
});

module.exports = mongoose.model("Edge", Edge);
