//chiamate API
var request = require("request");
var config = require("../helper/config.js");

var weather = (function() {
  // Get Forecast for a single citys
  var getForecast = function(city, units) {
    return new Promise((resolve, reject) => {
      let myUrl = config.openWeather.url +
        "?APPID=" +
        config.openWeather.apiKey +
        "&q=" +
        city +
        "&units=" +
        units;

      request.get(myUrl, function(error, response, body) {
        if (error) {
          reject(error);
        }
        if (response.statusCode >= 400 && response.statusCode <= 499) {
          reject(new Error(response.statusMessage));
        }
        //add server error 500
        resolve(response.body);
      });
    });
  };

  // web api call to  5-day forecast API
  // This method return an array of forecast of cities
  var getInfoByCity = function(data) {
    return new Promise((resolve, reject) => {
      var units = data && data.units ? data.units : "metric";
      Promise.all(
        data.cities.map(city => {
          return getForecast(city, units);
        })
      ).then(result => {
        var forecast = result.map(el => {
          return JSON.parse(el);
        });
        resolve(forecast);
      });
    });
  };

  // This method get forecast by location (lat, lon)
  var getInfoByLocation = function(data) {
    // use promises with ES6
    var lat = data && data.lat ? data.lat : null;
    var lon = data && data.lon ? data.lon : null;
    var units = data && data.units ? data.units : "metric";
    return new Promise((resolve, reject) => {
      let myUrl = config.openWeather.url +
        "?APPID=" +
        config.openWeather.apiKey +
        "&lat=" +
        lat +
        "&lon=" +
        lon +
        "&units=" +
        units;
      request.get(myUrl, function(error, response, body) {
        if (error) {
          reject(error);
        }
        if (response.statusCode >= 400 && response.statusCode <= 499) {
          reject(new Error(response.statusMessage));
        }
        resolve(response.body);
      });
    });
  };

  return {
    getInfoByCity: getInfoByCity,
    getInfoByLocation: getInfoByLocation
  };
})();

module.exports = weather;
