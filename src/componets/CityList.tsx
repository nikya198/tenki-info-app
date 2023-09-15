import React, { useEffect, useState } from 'react';

type city = {
  cityName: string;
  cityCode: string;
  districtCode: string;
};

type CityListProps = {
  selectedPrefCode: string;
  onSelectCity: (cityCode: string) => void;
  onSelectDistrict: (districtCode: string) => void;
  onSelectCityNm: (cityName: string) => void;
};

const CityList: React.FC<CityListProps> = (props) => {
  const [cityList, setCityList] = useState<city[]>([]);
  useEffect(() => {
    if (props.selectedPrefCode) {
      fetch(`http://localhost:3000/master/pref/${props.selectedPrefCode}/city`)
        .then((res) => res.json())
        .then((json) => {
          setCityList(json);
        });
    }
  }, [props.selectedPrefCode]);

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCityCode = event.target.value;

    let selectedCityName = event.target[event.target.selectedIndex].textContent as string;
    props.onSelectCityNm(selectedCityName);

    const [cityCode, districtCode] = selectedCityCode.split('-');
    props.onSelectCity(cityCode);
    props.onSelectDistrict(districtCode);
  };

  return (
    <>
      <select className='form-select' name='region' onChange={handleCityChange}>
        <option hidden>選択してください</option>
        {cityList.map((city) => (
          <option value={city.cityCode + '-' + city.districtCode} key={city.cityName}>
            {city.cityName}
          </option>
        ))}
      </select>
    </>
  );
};

export default CityList;
