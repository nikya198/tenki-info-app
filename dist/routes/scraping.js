"use strict";
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
// var express = require('express');
// var router = express.Router();
// const mysql2 = require('mysql2/promise');
const express_1 = __importDefault(require("express"));
const cheerio_1 = __importDefault(require("cheerio"));
const request_1 = __importDefault(require("request"));
const router = express_1.default.Router();
const url = 'https://weather.yahoo.co.jp/weather/jp/13/4410/13111.html';
const titles_arr = [];
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, request_1.default)(url, (e, response, body) => {
        if (e) {
            console.error(e);
        }
        try {
            const $ = cheerio_1.default.load(body); //bodyの読み込み
            $('div[id="yjw_pinpoint_today"] table[class="yjw_table2"] tr td img').each((i, elem) => {
                const altValue = $(elem).attr('alt');
                titles_arr.push(altValue);
                console.log(altValue);
            });
            console.log('titles_arr');
            console.log(titles_arr);
        }
        catch (e) {
            console.error(e);
        }
    });
    //console.log(titles_arr);
}));
exports.default = router;
