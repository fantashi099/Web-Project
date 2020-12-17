const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const https = require('https');

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// mongoose.connect('mongodb://localhost:27017/')

app.get('/', function(req,res){
  res.render('home');
});

app.get('/about', function(req,res){
  res.render('about');
});

app.get('/rooms', function(req,res){
  res.render('rooms');
});

app.get('/services', function(req,res){
  res.render('services');
});

app.get('/contact', function(req,res){
  res.render('contact');
});

app.get('/restaurant-bar',function(req,res){
  res.render('restaurant-bar');
});

app.get('/services-other',function(req,res){
  res.render('services-other');
});

app.get('/booking-selectrom',function(req,res){
  res.render('booking-selectrom');
});

app.post('/mail', function(req,res){
  const email = {
    members: [{
      email_address: req.body.email,
      status: 'subscribed'
    }]
  };

  const jsonData = JSON.stringify(email);
  const url = "https://us10.api.mailchimp.com/3.0/lists/055380a9c1";

  const options = {
    method: "POST",
    auth: "tien:da7a98a4f8fa0f237b39f774aeb8fc6d-us10"
  }

  const request = https.request(url, options, function(response){
    if (response.statusCode === 200) {
      res.redirect('/');
    }
    else res.send('There was an error while register email!');
  });

  request.write(jsonData);
  request.end();
});

// let port = process.env.PORT;
// if (port === null || port === ""){
//   port = 3000;
// }

app.listen(3000, function(){
  console.log("Server has started on server successfully!");
});
