import React, { useEffect, useState } from 'react';

type Pref = {
  prefName: string;
  prefCode: string;
};

type PrefListProps = {
  selectedRegionCode: string;
  onSelectPref: (regionCode: string) => void;
};

const PrefList: React.FC<PrefListProps> = (props) => {
  const [prefList, setPrefList] = useState<Pref[]>([]);

  useEffect(() => {
    if (props.selectedRegionCode) {
      fetch(`http://localhost:3000/master/region/${props.selectedRegionCode}/pref`)
        .then((res) => res.json())
        .then((json) => {
          setPrefList(json);
        });
    }
  }, [props.selectedRegionCode]);

  const handlePrefChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPrefCode = event.target.value;
    props.onSelectPref(selectedPrefCode);
  };

  return (
    <>
      <select className='form-select' name='pref' onChange={handlePrefChange}>
        <option hidden>選択してください</option>
        {prefList.map((pref) => (
          <option value={pref.prefCode} key={pref.prefCode}>
            {pref.prefName}
          </option>
        ))}
      </select>
    </>
  );
};

export default PrefList;
