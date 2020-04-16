const Spot = require('../models/spot');
const https = require('https');
const request = require('request');
const formatParams = require('../utils/formatParams');
const flags = require('../utils/flags');

require('dotenv').config();
const open_weather_api_key = process.env.OPEN_WEATHER_API_KEY;

const endpoint = 'https://api.openweathermap.org/data/2.5/weather';

exports.result = (req, res, next) => {
  var search_params;

  if (req.query.ls) { // location search?
    search_params = {
      lat: req.query.lat,
      lon: req.query.lon,
      appid: open_weather_api_key,
    };
  } else {
    search_params = {
      q: req.query.search,
      appid: open_weather_api_key,
    };
  }

  const requestURL = endpoint + formatParams(search_params);

  request.get(requestURL, (err, response, body) => {

    let data = JSON.parse(body);
    let data_to_render;
    if (response.statusCode >= '400') {
      data_to_render = {
        error: 'Da stimmt was nich',
      }
      res.render('search_result', data_to_render);
      return next(err);
    }
    data_to_render = {
      place_name: data.name,
      place_country_flag: flags.flags[data.sys.country].emoji,
      wind_speed: data.wind.speed.toFixed(1),
      wind_direction: data.wind.deg,
      longitude: data.coord.lon,
      latitude: data.coord.lat,
      weather_icon: data.weather[0].icon,
      temp: data.main.temp
    }
    res.render('search_result', data_to_render);
  });
};

exports.save_spot = (req, res, next) => {

  let spot = new Spot(
    {
      spot_name: req.body.place_name,
      spot_longitude: req.body.longitude,
      spot_latitude: req.body.latitude,
      spot_emoji: req.body.place_country_flag
    }
  );
  Spot.findOne({ 'spot_name': req.body.place_name })
    .exec(function(err, found_spot) {
      if (err) { return next(err); }
      if (found_spot) {
        res.redirect('/');
      } else {
        spot.save(function(err) {
          if (err) { return next(err); }
          res.redirect('/');
        });
      }
    });
};
