require('./model/db');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const flash = require('connect-flash');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cors = require('cors')

var app = express();
const url = 'mongodb://127.0.0.1:27017'


const store = new MongoDBStore({
    uri: url,
    collection: 'sessions',
    

 });
 const corsOptions ={
  origin:'http://localhost:3000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(cors(corsOptions));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
      secret: 'my secret',
      resave: false,
      saveUninitialized: false,
      store: store,
  

  })
);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(flash());
app.use((req, res, next) => {
 
    // res.locals.csrfToken = req.csrfToken();
    next();
});
const admin = require('./routes/admin');
app.use('/controller',admin);
const api = require('./routes/api');
app.use('/api',api);
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
