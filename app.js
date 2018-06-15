/* To process environment variables */
const result = require('dotenv').config();
if(result.error){
  throw result.error;
}

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

/* User sqlite database */
const sqlite3 = require('sqlite3').verbose();
var app = express();

/* Authentication with Auth0 */
const authMiddleware = require('./middleware/auth');
app.use(authMiddleware.checkJwt)
app.use(function(err, req, res, next){
  if(err.name === 'UnauthorizedError'){
    res.status(401).json({message: 'Missing or invalid token'});
  }
});

app.use('/static', express.static('public'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
