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
exports.getCity = exports.getPref = exports.getRegin = void 0;
const fs_1 = __importDefault(require("fs"));
const connectionVal = {
    host: 'db',
    port: 3306,
    user: 'testDb',
    password: 'testDb',
    database: 'appname',
};
//const REGION: region[] = [];
const getRegin = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    //const rawData = fs.readFileSync('../json/region.json');
    const jsonData = JSON.parse(fs_1.default.readFileSync('./json/region.json', 'utf8'));
    const result = jsonData.data
        .filter((item) => item.invalid)
        .map((item) => ({ regionName: item.regionName, regionCode: item.regionCode }));
    res.json(result);
    // for (const key in data) {
    //   console.log(key, data[key]);
    // }
    //console.log(rawData);
    //res.json(rawData);
    //const jsonData = json.parse(rawData);
    // const connection = await mysql2.createConnection(connectionVal);
    // const [rows, _fields] = await connection.execute('select * from M_REGION');
    // res.json(rows);
    // connection.end();
});
exports.getRegin = getRegin;
const getPref = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const reginCd = req.params.reginCd;
    const jsonData = JSON.parse(fs_1.default.readFileSync('./json/pref.json', 'utf8'));
    const result = jsonData.data
        .filter((item) => item.invalid && item.regionCode === reginCd)
        .map((item) => ({ prefName: item.prefName, prefCode: item.prefCode }));
    res.json(result);
    // const connection = await mysql2.createConnection(connectionVal);
    // const [rows, _fields] = await connection.execute(
    //   `select * from M_PREFECTURE WHERE regionCode=${reginCd}`
    // );
    // res.json(rows);
    // connection.end();
});
exports.getPref = getPref;
const getCity = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const prefCd = req.params.prefCd;
    const jsonData = JSON.parse(fs_1.default.readFileSync(`./json/city-${prefCd}.json`, 'utf8'));
    const result = jsonData.data
        .filter((item) => item.invalid)
        .map((item) => ({
        cityName: item.cityName,
        cityCode: item.cityCode,
        districtCode: item.districtCode,
    }));
    res.json(result);
    // const connection = await mysql2.createConnection(connectionVal);
    // const [rows, _fields] = await connection.execute(`select * from M_CITY WHERE prefCode=${prefCd}`);
    // res.json(rows);
    // connection.end();
});
exports.getCity = getCity;
