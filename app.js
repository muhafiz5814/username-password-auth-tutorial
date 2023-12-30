import "dotenv/config"

import { createRequire } from "module";
const require = createRequire(import.meta.url);

import createError from 'http-errors';
import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from "url"
import cookieParser from 'cookie-parser';
import logger from 'morgan';

const __dirname = dirname(fileURLToPath(import.meta.url))

import indexRouter from './routes/index.js';
import authRouter from './routes/auth.js'

var app = express();

app.locals.pluralize = require('pluralize');

// view engine setup
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));

app.use('/', indexRouter);
app.use('/', authRouter)

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

export default app;
