"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
// const cors = require('cors');
const index_1 = __importDefault(require("./routes/index"));
const users_1 = __importDefault(require("./routes/users"));
const master_1 = __importDefault(require("./routes/master"));
const scraiping_1 = __importDefault(require("./routes/scraiping"));
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// var dbRouter = require('./routes/db');
//var app = express();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'https://nikya198.github.io',
    credentials: true,
    optionsSuccessStatus: 200, //レスポンスstatusを200に設定
}));
// view engine setup
app.set('views', path_1.default.join('views')); //__dirNameと書いてある箇所を除く！
app.set('view engine', 'jade');
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join('public'))); //__dirNameと書いてある箇所を除く！
app.use('/', index_1.default);
app.use('/users', users_1.default);
app.use('/master', master_1.default);
app.use('/scraiping', scraiping_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
exports.default = app;
