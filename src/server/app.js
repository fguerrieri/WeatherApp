var express = require("express");
const path = require("path");
var openWeatherClient = require("./clients/openWeatherClient.js");

var bestDestination = require("../destination.json");

var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
//per non fare route di css e js
app.use(express.static(path.join(__dirname, "../ux")));

//ROUTE
//call al clinet nel server e rida i dati al client
app.post("/src/bycity", function(req, res) {
  openWeatherClient.getInfoByCity(req.body).then(data => {
      //trasferisco i dati
    res.json(data);
  });
});
app.post("/src/bylocation", function(req, res) {
  openWeatherClient.getInfoByLocation(req.body).then(data => {
    res.json(JSON.parse(data));
  });
});
//ritorna la mia pagina html 
app.get("/", function(req, res) {
  var fileTosend = path.join(__dirname, "/../ux/index.html");
  res.sendFile(fileTosend);
});

var server = app.listen("4444", function() {
  console.log("app listening on port 4444");
});
