const mongoose = require("mongoose");
const Joigoose = require("joigoose")(mongoose);
const Joi = require("joi");

let JoiRouteSchema = Joi.object({
  route_id: Joi.string().alphanum().min(7).max(7),
  short_name: Joi.string().alphanum().min(1).max(50),
  long_name: Joi.string().alphanum().min(1).max(50),
  is_active: Joi.boolean(),
  stops: Joi.array().items(Joi.string()),
});

var Route = new mongoose.Schema(Joigoose.convert(JoiRouteSchema, Object));

module.exports = mongoose.model("Route", Route);
