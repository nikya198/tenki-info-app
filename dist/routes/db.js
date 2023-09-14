"use strict";
// var express = require('express');
// var router = express.Router();
// const mysql2 = require('mysql2/promise');
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// データベース接続情報
const connection = promise_1.default.createConnection({
    host: '172.28.1.5',
    port: 3306,
    user: 'testDb',
    password: 'testDb',
    database: 'appname',
});
/* GET users listing. */
// router.get('/', function (req, res, next) {
//   res.send('respond with a resource DB');
// });
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // create the connection
    const connection = yield promise_1.default.createConnection({
        host: 'db',
        port: 3306,
        user: 'testDb',
        password: 'testDb',
        database: 'appname',
    });
    console.log(connection);
    console.log('start');
    const [rows, fields] = yield connection.execute('select * from M_REGION');
    res.json(rows);
    connection.end();
    console.log('close');
}));
exports.default = router;
