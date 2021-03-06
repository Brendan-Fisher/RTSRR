const mongoose = require("mongoose");
const Joigoose = require("joigoose")(mongoose);
const Joi = require("joi");

/**
 * Stop Object:
 *  stop_id: 7 character unique String identifying the stop
 *  name: Short description of the stop
 *  lat: Latitude of the stop
 *  long: Longitude of the stop
 *  routes: Array containing all of the route_id's that pass through this stop
 *  edges: Array that contains the edges that this stop containes
 *    Not used
 */
let JoiStopSchema = Joi.object({
  stop_id: Joi.string().min(7).max(7),
  name: Joi.string().min(1).max(60),
  lat: Joi.number().min(-90).max(90),
  long: Joi.number().min(-180).max(180),
  routes: Joi.array().items(Joi.string()),
  edges: Joi.array().ordered(Joi.string().required(), Joi.number().required()),
});

var Stop = new mongoose.Schema(Joigoose.convert(JoiStopSchema, Object));

module.exports = mongoose.model("Stop", Stop);
