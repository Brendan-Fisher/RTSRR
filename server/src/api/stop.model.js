const mongoose = require("mongoose");
const Mongoose = require("mongoose");
const Joigoose = require("joigoose")(Mongoose);
const Joi = require("joi");

let JoiStopSchema = Joi.object({
  stop_id: Joi.string().alphanum().min(7).max(7),
  name: Joi.string().alphanum().min(1).max(50),
  lat: Joi.number().min(-90).max(90),
  long: Joi.number().min(-180).max(180),
  routes: Joi.array().items(Joi.string()),
  edges: Joi.array().ordered(Joi.string().required(), Joi.number().required()),
});

var Stop = new Mongoose.Schema(Joigoose.convert(JoiStopSchema, Object));

module.exports = mongoose.model("Stop", Stop);
