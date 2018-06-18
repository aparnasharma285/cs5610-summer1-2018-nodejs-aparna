var express = require('express')
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/assignment5');


var app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin",
    "http://localhost:4200");
  res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});




var session = require('express-session')
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'any string'
}));


function setSession(req, res) {
  var name = req.params['name'];
  var value = req.params['value'];
  req.session[name] = value;
  res.send(req.session);
}

function getSession(req, res) {
  var name = req.params['name'];
  var value = req.session[name];
  res.send(value);
}


var userService = require('./services/user.service.server');
userService(app);

require('./services/section.service.server')(app);

app.listen(4000);