const Spot = require("../models/spot");
const axios = require("axios");
const flags = require("../utils/flags");
require("dotenv").config();

exports.result = (req, res, next) => {
  const q = req.query.search;
  const lat = req.query.lat;
  const lon = req.query.lon;

  const open_weather_api_key = process.env.OPEN_WEATHER_API_KEY;

  const params = Object.assign(
    { appid: open_weather_api_key },
    q === null ? null : { q },
    lat === null ? null : { lat },
    lon === null ? null : { lon }
  );

  const endpoint = "https://api.openweathermap.org/data/2.5/weather";

  axios
    .get(endpoint, {
      params: params,
    })
    .then((apiResponse) => {
      const data = apiResponse.data;
      const data_to_render = {
        place_name: data.name,
        place_country_flag: flags.flags[data.sys.country].emoji,
        wind_speed: data.wind.speed.toFixed(1),
        wind_direction: data.wind.deg,
        longitude: data.coord.lon,
        latitude: data.coord.lat,
        weather_icon: data.weather[0].icon,
        temp: data.main.temp,
      };
      res.render("search_result", data_to_render);
    })
    .catch((err) => {
      res.render("search_result", { error: "Da stimmt was nich." });
    });
};

exports.save_spot = (req, res, next) => {
  let spot = new Spot({
    spot_name: req.body.place_name,
    spot_longitude: req.body.longitude,
    spot_latitude: req.body.latitude,
    spot_emoji: req.body.place_country_flag,
  });
  Spot.findOne({ spot_name: req.body.place_name }).exec(function (
    err,
    found_spot
  ) {
    if (err) {
      return next(err);
    }
    if (found_spot) {
      res.redirect("/");
    } else {
      spot.save(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    }
  });
};
