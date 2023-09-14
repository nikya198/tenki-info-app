import { RequestHandler } from 'express';
import cheerio from 'cheerio';
import iconv from 'iconv-lite';
import fetch from 'node-fetch';

const siteDatas: {
  siteNm: string;
  getUrl: (reginCd: number, prefCd: number, districtCd: number, cityCd: number) => string;
  selectors: [{ selector: string; isTomorrow: false }, { selector: string; isTomorrow: true }];
  encoding: string;
  alt: boolean;
  timeStart: number;
}[] = [
  {
    siteNm: 'yahoo',
    getUrl: (_reginCd, prefCd, districtCd, cityCd) =>
      `https://weather.yahoo.co.jp/weather/jp/${prefCd}/${districtCd}/${cityCd}.html`,
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
    alt: true, //imgのaltの値を読み込みかどうか
    timeStart: 0,
  },
  {
    siteNm: 'nifty',
    getUrl: (_reginCd, _prefCd, _districtCd, cityCd) =>
      `https://weather.nifty.com/cs/catalog/weather_pinpoint/catalog_${cityCd}_1.htm`,
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
    getUrl: (reginCd, prefCd, districtCd, cityCd) =>
      `https://tenki.jp/forecast/${reginCd}/${+prefCd + 3}/${districtCd}/${cityCd}/3hours.html`,
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

export const getScraipingData: RequestHandler<{
  reginCd: number;
  prefCd: number;
  districtCd: number;
  cityCd: number;
}> = async (req, res, _next) => {
  const reginCd = req.params.reginCd;
  const prefCd = req.params.prefCd;
  const districtCd = req.params.districtCd;
  const cityCd = req.params.cityCd;
  const todayTenkiInfo: {
    time: number;
    tenkiValue: number;
    siteCount: number;
  }[] = [];
  const tomorrowTenkiInfo: {
    time: number;
    tenkiValue: number;
    siteCount: number;
  }[] = [];
  //const averageTenkiInfo: [] = [];

  for (const siteData of siteDatas) {
    try {
      //console.log(siteData.siteNm);

      const siteUrl = siteData.getUrl(reginCd, prefCd, districtCd, cityCd);
      //console.log(siteUrl);
      const response = await fetch(siteUrl);
      const buffer = await response.arrayBuffer(); // レスポンスのデータを ArrayBuffer として取得

      // エンコーディングでデータを文字列に変換
      const body = iconv.decode(Buffer.from(buffer), siteData.encoding);
      let timeVal = siteData.timeStart;
      let todayTimeProgress = false;
      const $ = cheerio.load(body);
      for (const selector of siteData.selectors) {
        if (selector.isTomorrow) {
          timeVal = siteData.timeStart;
        }
        $(selector.selector).each((_i, elem) => {
          let altValue;

          if (siteData.alt) {
            altValue = $(elem).attr('alt')!;
          } else {
            altValue = $(elem).text();
          }

          let tenkiValue = 0;
          //console.log(altValue);

          if (altValue === '晴れ') {
            tenkiValue = 1;
          } else if (altValue === '曇り' || altValue === 'くもり') {
            tenkiValue = 3;
          } else if (altValue === '-') {
            tenkiValue = 0;
          } else {
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
            } else {
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
            } else {
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

      //console.log(todayTenkiInfo);
      //console.log(tomorrowTenkiInfo);
    } catch (e) {
      console.error(e);
    }
  }

  type info = {
    time: number;
    avTenkiValue: number;
    todayTimeProgress: boolean;
  };
  //const averageTenkiInfo: { today: info[]; tomorrow: info[] }
  let averageTenkiInfo: { today: info[]; tomorrow: info[] } = { today: [], tomorrow: [] };

  const tmptoday: info[] = [];
  for (const entry of todayTenkiInfo) {
    const average = entry.tenkiValue / entry.siteCount;
    const todayAverageTenkiInfo = {
      time: entry.time,
      avTenkiValue: average,
      todayTimeProgress: todayHour < entry.time ? false : true,
    };
    tmptoday.push(todayAverageTenkiInfo);
  }

  const tmptomorrow: info[] = [];
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
  //console.log('Average TenkiValues:', averageTenkiInfo);
};
