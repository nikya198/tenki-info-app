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
exports.getScraipingData = void 0;
const cheerio_1 = __importDefault(require("cheerio"));
const iconv_lite_1 = __importDefault(require("iconv-lite"));
const siteDatas = [
    {
        siteNm: 'yahoo',
        getUrl: (_reginCd, prefCd, districtCd, cityCd) => `https://weather.yahoo.co.jp/weather/jp/${prefCd}/${districtCd}/${cityCd}.html`,
        //https://weather.yahoo.co.jp/weather/jp/13/4410/13111.html
        selectors: [
            {
                selector: 'div[id="yjw_pinpoint_today"] table[class="yjw_table2"] tr td img',
                isTomorrow: false,
            },
            {
                selector: 'div[id="yjw_pinpoint_tomorrow"] table[class="yjw_table2"] tr td img',
                isTomorrow: true,
            },
        ],
        encoding: 'UTF-8',
        alt: true,
        timeStart: 0,
    },
    {
        siteNm: 'nifty',
        getUrl: (_reginCd, _prefCd, _districtCd, cityCd) => `https://weather.nifty.com/cs/catalog/weather_pinpoint/catalog_${cityCd}_1.htm`,
        //url: 'https://weather.nifty.com/cs/catalog/weather_pinpoint/catalog_13111_1.htm',
        selectors: [
            {
                selector: 'div[id="todayWeather"] div table tr:nth-child(2) td img',
                isTomorrow: false,
            },
            {
                selector: 'div[id="tomorrowWeather"] div table tr:nth-child(2) td img',
                isTomorrow: true,
            },
        ],
        encoding: 'Shift_JIS',
        alt: true,
        timeStart: 0,
    },
    {
        siteNm: 'jma',
        getUrl: (reginCd, prefCd, districtCd, cityCd) => `https://tenki.jp/forecast/${reginCd}/${+prefCd + 3}/${districtCd}/${cityCd}/3hours.html`,
        //https://tenki.jp/forecast/3/16/4410/13111/3hours.html',
        //https://tenki.jp/forecast/3/133/4410/13111/
        //https://tenki.jp/forecast/3/16/13111/4410/3hours.html
        selectors: [
            {
                selector: 'table[id="forecast-point-3h-today"] tr[class="weather"] td p',
                isTomorrow: false,
            },
            {
                selector: 'table[id="forecast-point-3h-tomorrow"] tr[class="weather"] td p',
                isTomorrow: true,
            },
        ],
        encoding: 'UTF-8',
        alt: false,
        timeStart: 3,
    },
];
let today = new Date();
let todayHour = today.getHours();
const getScraipingData = (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const reginCd = req.params.reginCd;
    const prefCd = req.params.prefCd;
    const districtCd = req.params.districtCd;
    const cityCd = req.params.cityCd;
    const todayTenkiInfo = [];
    const tomorrowTenkiInfo = [];
    //const averageTenkiInfo: [] = [];
    for (const siteData of siteDatas) {
        try {
            console.log(siteData.siteNm);
            const siteUrl = siteData.getUrl(reginCd, prefCd, districtCd, cityCd);
            console.log(siteUrl);
            const response = yield fetch(siteUrl);
            const buffer = yield response.arrayBuffer(); // レスポンスのデータを ArrayBuffer として取得
            // エンコーディングでデータを文字列に変換
            const body = iconv_lite_1.default.decode(Buffer.from(buffer), siteData.encoding);
            let timeVal = siteData.timeStart;
            let todayTimeProgress = false;
            const $ = cheerio_1.default.load(body);
            for (const selector of siteData.selectors) {
                if (selector.isTomorrow) {
                    timeVal = siteData.timeStart;
                }
                $(selector.selector).each((_i, elem) => {
                    let altValue;
                    if (siteData.alt) {
                        altValue = $(elem).attr('alt');
                    }
                    else {
                        altValue = $(elem).text();
                    }
                    let tenkiValue = 0;
                    console.log(altValue);
                    if (altValue === '晴れ') {
                        tenkiValue = 1;
                    }
                    else if (altValue === '曇り' || altValue === 'くもり') {
                        tenkiValue = 3;
                    }
                    else if (altValue === '-') {
                        tenkiValue = 0;
                    }
                    else {
                        tenkiValue = 5;
                    }
                    if (todayHour < timeVal) {
                        todayTimeProgress = true;
                    }
                    if (!selector.isTomorrow) {
                        const existingEntry = todayTenkiInfo.find((entry) => entry.time === timeVal);
                        if (existingEntry) {
                            existingEntry.tenkiValue += tenkiValue; // Add tenkiValue to the existing entry
                            existingEntry.siteCount++;
                        }
                        else {
                            todayTenkiInfo.push({
                                time: timeVal,
                                tenkiValue: tenkiValue,
                                siteCount: +1,
                            });
                        }
                    }
                    if (selector.isTomorrow) {
                        const existingEntrys = tomorrowTenkiInfo.find((entry) => entry.time === timeVal);
                        if (existingEntrys) {
                            existingEntrys.tenkiValue += tenkiValue; // Add tenkiValue to the existing entry
                            existingEntrys.siteCount++;
                        }
                        else {
                            tomorrowTenkiInfo.push({
                                time: timeVal,
                                tenkiValue: tenkiValue,
                                siteCount: +1,
                            });
                        }
                    }
                    timeVal = timeVal + 3;
                    //titles_arr.push(altValue);
                });
            }
            console.log(todayTenkiInfo);
            console.log(tomorrowTenkiInfo);
        }
        catch (e) {
            console.error(e);
        }
    }
    //const averageTenkiInfo: { today: info[]; tomorrow: info[] }
    let averageTenkiInfo = { today: [], tomorrow: [] };
    const tmptoday = [];
    for (const entry of todayTenkiInfo) {
        const average = entry.tenkiValue / entry.siteCount;
        const todayAverageTenkiInfo = {
            time: entry.time,
            avTenkiValue: average,
            todayTimeProgress: todayHour < entry.time ? false : true,
        };
        tmptoday.push(todayAverageTenkiInfo);
    }
    const tmptomorrow = [];
    for (const entry of tomorrowTenkiInfo) {
        const average = entry.tenkiValue / entry.siteCount;
        const tomorrowAverageTenkiInfo = {
            time: entry.time,
            avTenkiValue: average,
            todayTimeProgress: false,
        };
        tmptomorrow.push(tomorrowAverageTenkiInfo);
    }
    //averageTenkiInfo.push({ today: tmptoday, tomorrow: tmptomorrow });
    averageTenkiInfo = { today: tmptoday, tomorrow: tmptomorrow };
    res.json(averageTenkiInfo);
    console.log('Average TenkiValues:', averageTenkiInfo);
});
exports.getScraipingData = getScraipingData;
