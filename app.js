const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const https = require('https');
const ejs = require('ejs');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const LocalStrategy = require('passport-local').Strategy;

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({
  secret: "This is a key.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/bookDB', {useNewUrlParser: true, useUnifiedTopology:true,useFindAndModify: false});
mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  phone: Number
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model('User', userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const infoSchema = new mongoose.Schema({
  checkIn: {
    type: Date,
    default: Date.now
  },
  checkOut: Date,
  totalPerson: [{
    adults: Number,
    childrens: Number
  }],
  totalNight: Number,
  name: String,
  email: String,
  status: String,
  phone: Number,
  room: [{
    Presidential: Number,
    Excutive: Number,
    Deluxe: Number,
    price: Number,
  }],
  status: String
});

const couponSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  coupon: String,
  status: {
    type: String,
    default: "Available"
  }
});

const Info = mongoose.model('Info', infoSchema);
const Coupon = mongoose.model('Coupon', couponSchema);


app.get('/', function(req,res){
  res.render('home');
});

app.get('/about', function(req,res){
  res.render('about');
});

app.get('/rooms', function(req,res){
  res.render('rooms');
});

app.get('/profile', function(req,res){
  res.render('profile');
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

app.get('/sign-in', function(req,res){
  res.render('sign-in');
});

app.get('/register', function(req,res){
  res.render('register');
});

app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/sign-in');
});


app.get('/dashboard', function(req,res){
  if (req.isAuthenticated()){
    if (req.user.username === 'admin@uit') {
      Info.find({}, function(err, InfoFound){
        if (!err) {
          res.render('admin', { listInfo: InfoFound });
        } else console.log(errr);
      })
    } else {
      res.render('profile');
    }
  } else {
    res.redirect('/sign-in');
  }
});

app.post('/', function(req,res) {

  const check_in = req.body.check_in;
  const check_out = req.body.check_out;
  const night_stay = Math.abs( new Date(check_out) - new Date(check_in))/86400000;
  const total_person = req.body.person;
  const total_children = req.body.children;

  res.render('booking', {checkIn: check_in, checkOut: check_out,stayNight: night_stay ,totalPerson: total_person, totalChildren: total_children});
});

app.post('/book', function(req,res){

  const check_in = req.body.check_in;
  const check_out = req.body.check_out;
  const night_stay = Math.abs( new Date(check_out) - new Date(check_in))/86400000;
  const total_person = req.body.total_person;
  const total_children = req.body.total_children;
  const total_price = req.body.total_price;
  const presidential = req.body.Presidential;
  const excutive = req.body.Excutive;
  const deluxe = req.body.Deluxe;

  var passObject = {
    checkIn: check_in,
    checkOut: check_out,
    stayNight: night_stay,
    totalPerson: total_person,
    totalChildren: total_children,
    totalPrice: total_price,
    Presidential: presidential,
    Excutive: excutive,
    Deluxe: deluxe
  }

  res.render('customer-info', passObject);

});

app.post('/payment-info', function(req,res){
  const Room = [{
    Presidential: req.body.Presidential,
    Excutive: req.body.Excutive,
    Deluxe: req.body.Deluxe,
    price: req.body.total_price
  }];

  const totalPerson = [{
    adults: req.body.total_person,
    childrens: req.body.total_children
  }]

  const bookItem = new Info({
    checkIn: req.body.check_in,
    checkOut: req.body.check_out,
    totalPerson: totalPerson,
    totalNight: req.body.total_night,
    name: req.body.fisrtName + " " + req.body.lastName,
    email: req.body.email,
    status: req.body.status,
    phone: req.body.phone,
    room: Room,
    status: "onPay"
  });

    bookItem.save();
    res.redirect('/');

});

app.post('/register', function(req,res, next){

  User.register({username: req.body.email, name: req.body.name, phone: req.body.phone}, req.body.password, function(err,user){
    if (err) {
      console.log(err);
      res.redirect('/register');
    }

    next();
  });
}, passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/sign-in'
}));

app.post('/sign-in', function(req,res, next) {

  if (req.body) {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });

    req.login(user, function(err){
      if (err) {
        console.log(err);
        res.redirect('/sign-in');
      } else {
        next();
      }
    });
  }}, passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/sign-in'
}));

app.post('/add-coupon', function(req,res){
  const couponItem = new Coupon({
    coupon: req.body.coupon
  });

  couponItem.save();
  res.redirect('/dashboard');
});

// app.post('/sign-in',
//   passport.authenticate('local'),
//   function(req, res) {
//     // res.redirect('/users/' + req.user.username);
//     res.redirect('/admin');
// });


app.post('/mailchimp', function(req,res){
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
