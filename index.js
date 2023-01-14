const express = require('express');
const https = require('https');
const { send } = require('process');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true})); //to parse though the body of the post request

app.use(express.static('public'));
app.set('view engine','ejs')

app.get('/', (req, resp) => {
    const sendData = {location:"Location",temp:"Temp",description: "Description",humidity:"Humidity",windSpeed:"WindSpeed"}
    resp.render("index",{sendData:sendData});
    // resp.send("Hello")
})

app.post('/',(req,resp)=>{
    // console.log(req.body.cityName)
    // console.log ("Post request recieved.")
    const location = req.body.cityName;
    const apiKey = "fb92e4af5f16307cf50a8adbba9c1b15";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&appid=" + apiKey + "&units=" + unit;
    https.get(url, (response) => {
        // console.log(resp);
        response.on("data", (data) => {
            const weatherData = JSON.parse(data);
            // console.log(weatherData);
            //getting only the data we want
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].description;
            const humidity = weatherData.main.humidity;
            const windSpeed = weatherData.wind.speed;
            const sendData = {};
            sendData.temp = temp;
            sendData.description = description;
            sendData.location = location;
            sendData.humidity = humidity;
            sendData.windSpeed = windSpeed;
            resp.render('index',{sendData:sendData});
            // const icon = weatherData.weather[0].icon;
            // const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            // resp.write("<p>The weather is currently " + description + "</p>")
            // resp.write("<h1>The temperature in "+location+ " is " + temp + " degree celcius</h1>")
            // resp.write("<image src = " + imageURL + ">")
            // resp.send();
            // console.log(temp);
            // console.log(description);
        })
    })
})

app.listen(4000);
