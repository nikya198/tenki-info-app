import React, { useEffect, useState } from 'react';
import './input.css';

type Region = {
  regionCode: string;
  regionName: string;
};

type RegionListProps = {
  onSelectRegion: (regionCode: string) => void;
};

const RegionList: React.FC<RegionListProps> = (props) => {
  const [regionList, setRegionList] = useState<Region[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/master/region')
      .then((res) => res.json())
      .then((json) => {
        setRegionList(json);
      });
  }, []);

  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRegionCode = event.target.value;
    props.onSelectRegion(selectedRegionCode);
  };

  return (
    <>
      <select className='form-select' name='region' onChange={handleRegionChange}>
        <option hidden>選択してください</option>
        {regionList.map((region) => (
          <option value={region.regionCode} key={region.regionCode}>
            {region.regionName}
          </option>
        ))}
      </select>
    </>
  );
};

export default RegionList;
