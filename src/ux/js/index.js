var getWeatherData = function(cities, units) {
  return new Promise((resolve, reject) => {
    var success = function(data) {
      console.log(data);
      resolve(data);
    };
    $.ajax({
      url: "http://localhost:4444/src/bycity",
      type: "POST",
      success: success,
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({
        cities: cities,
        units: units
      })
    });
  });
};

var getWeatherDataByLocation = function(lat, lon, units) {
  return new Promise((resolve, reject) => {
    var success = function(data) {
      console.log(data);
      resolve(data);
    };
    $.ajax({
      url: "http://localhost:4444/src/bylocation",
      type: "POST",
      success: success,
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify({
        lat: lat,
        lon: lon,
        units: units
      })
    });
  });
};

var getLocation = function() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(pos) {
          resolve(pos);
        },
        function() {
          resolve(null);
        }
      );
    } else {
      resolve(null);
    }
  });
};

var mapData = function(data) {
  var series = [];

  for (let i = 0; i < data.length; i++) {
    var mis = [];
    var name = data[i].city.name;
    for (let j = 0; j < data[i].list.length; j++) {
      mis.push(data[i].list[j].main.temp);
    }
    series.push({ name: name, data: mis });
  }
  var list = data[0].list;
  var xLabels = list.map(el => {
    return el.dt_txt.split(" ")[0];
  });
  Highcharts.chart("chartContainer", {
    chart: {
      type: "column"
    },
    title: {
      text: "Weather"
    },

    xAxis: {
      categories: xLabels,
      crosshair: true
    },
    yAxis: {
      min: 0,
      title: {
        text: "temperature"
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f} C</b></td></tr>',
      footerFormat: "</table>",
      shared: true,
      useHTML: true
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    series: series
  });
};

var getDataByLocation = function(lat, lon, units) {
  getWeatherDataByLocation(lat, lon, units).then(result => {
    mapData([result]);
  });
};

var getData = function(cities, units) {
  getWeatherData(cities, units).then(result => {
    mapData(result);
  });
};

//var default='Seattle,us';
$(document).ready(function() {
  getLocation().then(function(pos) {
    if (pos) {
      var lat = pos.coords.latitude;
      var lon = pos.coords.longitude;
      getDataByLocation(lat, lon, "metric");
    } else {
      getData();
    }
  });

  $("#favoriteBtn").on("click", function() {
    var favCities = {};

    var local = localStorage.getItem("WeatherFavorite");
    if (local) {
      favCities = JSON.parse(local);
    }
    var city = $("#cityInput").val();
    favCities[city] = true;
    localStorage.setItem("WeatherFavorite", JSON.stringify(favCities));
  });

  $("#searchBtn").on("click", function() {
    getData([$("#cityInput").val()], "metric");
  });
});
