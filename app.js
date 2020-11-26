const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

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

// let port = process.env.PORT;
// if (port === null || port === ""){
//   port = 3000;
// }

app.listen(3000, function(){
  console.log("Server has started on server successfully!");
});
