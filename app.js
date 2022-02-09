const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});
app.post("/", function(req, res){
  let query = req.body.cityName;
  let apiKey = "b308faeca5e69fcfefaa9230e2191690";
  let units = "metric";
  let url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid="+ apiKey + "&units=" + units;
  https.get(url, function(response){
    if(String(response.statusCode) === "404"){
      console.log(response.statusCode);
      return res.redirect("/");
    }
    response.on("data", function(data){
      let weatherData = JSON.parse(data);
      let temprature = weatherData.main.temp;
      let Loc = weatherData.name +", "+ weatherData.sys.country;
      K = temprature;
      let today = new Date();
      let currentDay = today.getDay();
      let options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      }
      let minTemp = weatherData.main.temp_min;
      let maxTemp = weatherData.main.temp_max;
      let weatherFeel = weatherData.weather[0].main;
      let iconId = weatherData.weather[0].icon;
      res.render('weather',  {
        Location : Loc,
        Temprature: temprature,
        Date: today.toLocaleDateString("en-US", options),
        Weather: weatherFeel,
        min: minTemp,
        max: maxTemp,
        icon: iconId
      });
    });
  });
  console.log("Thank You");
});
app.listen(3000, function(){
  console.log("Server up and running");
});
