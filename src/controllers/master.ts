import mysql2 from 'mysql2/promise';
import { RequestHandler } from 'express';
import fs from 'fs';

const connectionVal = {
  host: 'db', //コンテナ名で接続できる
  port: 3306,
  user: 'testDb',
  password: 'testDb',
  database: 'appname',
};

type Region = {
  regionName: string;
  regionCode: string;
  invalid: boolean;
};
type RegionArray = {
  data: Region[];
};

type Pref = {
  prefName: string;
  prefCode: string;
  regionCode: string;
  invalid: boolean;
};
type PrefArray = {
  data: Pref[];
};

type City = {
  cityName: string;
  cityCode: string;
  districtCode: string;
  invalid: boolean;
};
type CityfArray = {
  data: City[];
};

//const REGION: region[] = [];

export const getRegin: RequestHandler = async (req, res, _next) => {
  //const rawData = fs.readFileSync('../json/region.json');
  const jsonData: RegionArray = JSON.parse(fs.readFileSync('./json/region.json', 'utf8'));
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
};

export const getPref: RequestHandler<{ reginCd: string }> = async (req, res, _next) => {
  const reginCd = req.params.reginCd;
  const jsonData: PrefArray = JSON.parse(fs.readFileSync('./json/pref.json', 'utf8'));
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
};

export const getCity: RequestHandler<{ prefCd: string }> = async (req, res, _next) => {
  const prefCd = req.params.prefCd;

  const jsonData: CityfArray = JSON.parse(fs.readFileSync(`./json/city-${prefCd}.json`, 'utf8'));
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
};
