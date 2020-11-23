const mongoose = require("mongoose");
const Joigoose = require("joigoose")(mongoose);
const Joi = require("joi");

let JoiRouteSchema = Joi.object({
  short_name: Joi.string().min(1).max(60),
  route_id: Joi.string().min(7).max(7),
  long_name: Joi.string().min(1).max(60),
  stops: Joi.array().items(Joi.string()),
});

var Route = new mongoose.Schema(Joigoose.convert(JoiRouteSchema, Object));

module.exports = mongoose.model("Route", Route);
