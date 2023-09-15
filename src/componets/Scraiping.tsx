import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Scraiping.css';

type apiData = {
  time: string;
  avTenkiValue: string;
  todayTimeProgress: boolean;
};

type ScraipingProps = {
  // apiParam: {
  //   regionCode: string;
  //   prefCode: string;
  //   cityCode: string;
  //   districtCode: string;
  // };
  cityName: string;
};

const Scraiping: React.FC<ScraipingProps> = (props) => {
  const [apiDataToday, setApiDataToday] = useState<apiData[]>([]);
  const [apiDataTomorrow, setApiDataTomorrow] = useState<apiData[]>([]);

  //`http://localhost:3000/scraiping/3/13/4410/13111`
  //  `http://localhost:3000/scraiping/${props.apiParam.regionCode}/${props.apiParam.prefCode}/${props.apiParam.cityCode}/${props.apiParam.districtCode}`
  //URLのパラメーターを取得
  const { regionCode, prefCode, cityCode, districtCode, cityName } = useParams();
  // localStorage.setItem('cityName', props.cityName);
  // let cat = localStorage.getItem('cityName');
  // console.log('cat');
  // console.log(cat);

  // console.log(cat);
  //const ref = useRef(props.cityName);

  useEffect(() => {
    const fetchData = async () => {
      // if (areAllPropertiesPresent(props)) {
      fetch(`http://localhost:3000/scraiping/${regionCode}/${prefCode}/${districtCode}/${cityCode}`)
        .then((res) => res.json())
        .then((json) => {
          setApiDataToday(json.today);
          setApiDataTomorrow(json.tomorrow);
        });
      // } else {
      //   setApiDataToday([]);
      //   setApiDataTomorrow([]);
      // }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const weatherValImgSelect = (data: apiData) => {
    const valNum = +data.avTenkiValue;
    if (data.todayTimeProgress) {
      return (
        <td key={data.time + '-' + data.avTenkiValue}>
          <img src='/img/minus-sign.png' alt='-' width={40} height={40} />
        </td>
      );
    }
    switch (true) {
      case valNum <= 1:
        return (
          <td key={data.time + '-' + data.avTenkiValue}>
            <img src='/img/sun.png' alt='晴れ' className='imgSize' width={40} height={40} />
          </td>
        );
      case valNum > 1 && valNum <= 2:
        return (
          <td key={data.time + '-' + data.avTenkiValue}>
            <img src='/img/sunCloud.png' alt='晴れ時々曇り' width={40} height={40} />
          </td>
        );
      case valNum > 2 && valNum <= 3:
        return (
          <td key={data.time + '-' + data.avTenkiValue}>
            <img src='/img/cloudSun.png' alt='曇り時々晴れ' width={40} height={40} />
          </td>
        );
      case valNum > 3 && valNum <= 4:
        return (
          <td key={data.time + '-' + data.avTenkiValue}>
            <img src='/img/cloud.png' alt='曇り' width={40} height={40} />
          </td>
        );
      case valNum > 4 && valNum <= 5:
        return (
          <td key={data.time + '-' + data.avTenkiValue}>
            <img src='/img/cloudRain.png' alt='曇り時々雨' width={40} height={40} />
          </td>
        );
      case valNum > 5:
        return (
          <td key={data.time + '-' + data.avTenkiValue}>
            <img src='/img/rain.png' alt='雨' width={40} height={40} />
          </td>
        );
      default:
        break;
    }
  };

  return (
    <div className='container'>
      <div className='row'>
        <h2>{cityName}の天気</h2>

        <h3>今日の天気</h3>
        <table className='table table-sm'>
          <tbody>
            <tr>
              <th>時刻</th>
              {apiDataToday.map((val) => (
                <td key={val.time}>{val.time}</td>
              ))}
            </tr>
            <tr>
              <th>天気</th>
              {apiDataToday.map((val) => weatherValImgSelect(val))}
            </tr>
          </tbody>
        </table>

        <h3>明日の天気</h3>
        <table className='table table-sm'>
          <tbody>
            <tr>
              <th>時刻</th>
              {apiDataTomorrow.map((val) => (
                <td key={val.time}>{val.time}</td>
              ))}
            </tr>
            <tr>
              <th>天気</th>
              {apiDataTomorrow.map((val) => weatherValImgSelect(val))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// const areAllPropertiesPresent = (props: ScraipingProps): boolean => {
//   const { regionCode, prefCode, cityCode, districtCode } = props.apiParam;
//   console.log('areAllPropertiesPresent');
//   console.log(props.apiParam);
//   console.log(!regionCode);
//   console.log(!prefCode);
//   console.log(!cityCode);
//   console.log(!districtCode);

//   // 各プロパティがnullまたは空文字列であることを確認
//   if (
//     !regionCode ||
//     !prefCode ||
//     !cityCode ||
//     !districtCode ||
//     regionCode === 'null' ||
//     prefCode === 'null' ||
//     cityCode === 'null' ||
//     districtCode === 'null'
//   ) {
//     console.log('flg:false');

//     return false;
//   }
//   console.log('flg:true');
//   return true;
// };

export default Scraiping;
