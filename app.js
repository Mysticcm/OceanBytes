var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport')
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
require('dotenv').config();


var app = express();

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
  store: new SQLiteStore()
}));
app.use(passport.authenticate('session'));

const connectDB = require("./config/database");

// Connect to db
connectDB();

// Routes
app.use('/', require('./routes/index'));
app.use('/', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));
// 404
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Server
app.listen(3333, () => {
  console.log('OceanBytes kjører på http://localhost:3333');
});

module.exports = app;
