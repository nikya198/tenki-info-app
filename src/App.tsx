import React, { useState } from 'react';
import RegionList from './componets/RegionList';
import PrefList from './componets/PrefList';
import CityList from './componets/CityList';
import Scraiping from './componets/Scraiping';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';

// interface apiParam {
//   regionCode: string;
//   prefCode: string;
//   cityCode: string;
//   districtCode: string;
// }

const App: React.FC = () => {
  const [selectedRegionCode, setSelectedRegionCode] = useState<string>('');
  const [selectedPrefCode, setSelectedPrefCode] = useState<string>('');
  const [selectedCityCode, setSelectedCityCode] = useState<string>('');
  const [selectedDistrictCode, setSelectedDistrictCode] = useState<string>('');
  const [selectedCityName, setSelectedCityName] = useState<string>('');

  // const [apiParam, setApiParam] = useState<apiParam>({
  //   regionCode: '',
  //   prefCode: '',
  //   cityCode: '',
  //   districtCode: '',
  // });

  // const areAllPropertiesPresent = (): boolean => {
  //   const { regionCode, prefCode, cityCode, districtCode } = apiParam;
  //   console.log(apiParam);
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
  //     console.log('false');
  //     return false;
  //   }
  //   console.log('true');
  //   return true;
  // };

  const navigate = useNavigate();

  const handleSearchClick = () => {
    // console.log(selectedRegionCode);
    // console.log(!selectedRegionCode);

    // console.log(selectedPrefCode);
    // console.log(!selectedPrefCode);

    // console.log(selectedCityCode);
    // console.log(!selectedCityCode);

    // console.log(selectedDistrictCode);
    // console.log(!selectedDistrictCode);

    // setApiParam({
    //   regionCode: selectedRegionCode,
    //   prefCode: selectedPrefCode,
    //   cityCode: selectedCityCode,
    //   districtCode: selectedDistrictCode,
    // }); // この時点では「ApiParam」は更新されていない

    //プルダウンのデータが存在している場合のみ呼ぶ
    if (
      !!selectedRegionCode &&
      !!selectedPrefCode &&
      !!selectedCityCode &&
      !!selectedDistrictCode
    ) {
      navigate(
        `/weather/${selectedRegionCode}/${selectedPrefCode}/${selectedCityCode}/${selectedDistrictCode}/${selectedCityName}`
      );
    }

    // if (areAllPropertiesPresent()) {
    //   navigate(`/weather`);
    //   //`/weather/${selectedRegionCode}/${selectedPrefCode}/${selectedCityCode}/${selectedDistrictCode}`
    // }
    // console.log(apiParam);
  };

  // useEffect(() => {
  //   console.log('wfweewfwefwfewf');
  //   console.log(selectedCityName);

  //   //初期表示段階でこのuseeffectが呼ばれているが問題ない？
  //   // if (areAllPropertiesPresent()) {
  //   //   navigate(
  //   //     `/weather/${selectedRegionCode}/${selectedPrefCode}/${selectedCityCode}/${selectedDistrictCode}`
  //   //   );
  //   // }
  // }, [apiParam]); // この効果はapiParamが変更されるたびに実行されます

  return (
    <div className='App'>
      <Routes>
        <Route
          path='/'
          element={
            <div className='container'>
              <h2>ピンポイント天気</h2>
              <p>　yahoo,nifty,日本気象庁の天気情報の平均値を検索します</p>
              <p>　※現在は東京都,千葉県のみ検索できます</p>
              <br></br>
              <RegionList onSelectRegion={(regionCode) => setSelectedRegionCode(regionCode)} />
              <PrefList
                selectedRegionCode={selectedRegionCode}
                onSelectPref={(prefCode) => setSelectedPrefCode(prefCode)}
              />
              <CityList
                selectedPrefCode={selectedPrefCode}
                onSelectCity={(cityCode) => setSelectedCityCode(cityCode)}
                onSelectDistrict={(districtCode) => setSelectedDistrictCode(districtCode)}
                onSelectCityNm={(cityName) => setSelectedCityName(cityName)}
              />
              <input
                className='btn btn-primary'
                type='button'
                value={'検索'}
                onClick={handleSearchClick}
              ></input>
            </div>
          }
        />
      </Routes>
      <Routes>
        <Route
          path='/weather/:regionCode/:prefCode/:cityCode/:districtCode/:cityName'
          element={<Scraiping cityName={selectedCityName} />}
        />
      </Routes>
    </div>
  );
};

export default App;

//memo
//selectedPrefCodeはCityListコンポーネントにプルダウンで選択された値を送っている
//(cityCode) => setSelectedCityCode(cityCode)の関数をCityListコンポーネントで呼び出せるようにしている、CityListコンポーネントはonSelectCityという名前で関数を呼び出す
//↑app.tsxに値を返している.
