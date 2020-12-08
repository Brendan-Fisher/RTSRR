const mongoose = require("mongoose");
const { Schema } = mongoose;
const Joigoose = require("joigoose")(mongoose);
const Joi = require("joi");


/**
 * Edge object:
 *  src: String containing the stop_id of the start of the edge
 *  edges: Array containing objects with properties dest and weight
 *    dest: String containing the stop_id of the end of the edge
 *    weight: Double containing the driving distance between the two stops
 */
let Edge = new Schema({
  src: String,
  edges: [{ dest: String, weight: Number }],
});

module.exports = mongoose.model("Edge", Edge);
