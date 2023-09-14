import createError from 'http-errors';
import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
// const cors = require('cors');

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import master from './routes/master';
import scraiping from './routes/scraiping';

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// var dbRouter = require('./routes/db');

//var app = express();
const app = express();

app.use(
  cors({
    origin: 'https://nikya198.github.io', //アクセス許可するオリジン
    credentials: true, //レスポンスヘッダーにAccess-Control-Allow-Credentials追加
    optionsSuccessStatus: 200, //レスポンスstatusを200に設定
  })
);

// view engine setup
app.set('views', path.join('views')); //__dirNameと書いてある箇所を除く！
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join('public'))); //__dirNameと書いてある箇所を除く！

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/master', master);
app.use('/scraiping', scraiping);

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

interface ErrorWithStatus extends Error {
  status: number;
}

// error handler
app.use((err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
