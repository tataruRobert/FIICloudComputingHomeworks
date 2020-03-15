var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var fs = require('fs')
var path = require('path')

var indexRouter = require('./routes/index');

const bodyParser = require('body-parser');

morgan.token('url', function(req, res) {
	return req.originalUrl;
});
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan(':method :status :url :res[content-length] - :response-time ms', { stream: accessLogStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use('/', indexRouter);





module.exports = app;
