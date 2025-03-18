import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Flag from 'react-world-flags';

const CountrySelect = ({ onChange }) => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      const response = await fetch('https://restcountries.com/v3.1/all');
      const data = await response.json();
      const countriesList = data.map((country) => ({
        label: country.name.common,
        value: country.name.common,
        flag: country.cca2,
      }));
      setCountries(countriesList);
    };

    fetchCountries();
  }, []);

  const handleSelectChange = (selectedOption) => {
    onChange(selectedOption);
  };

  const customSingleValue = ({ data }) => (
    <div className="selected-value" style={{ display: 'flex', alignItems: 'center' }}>
      <Flag code={data.flag} className="country-flag" />
      {data.label}
    </div>
  );

  const customOption = (props) => {
    const { data, innerRef, innerProps } = props;
    return (
      <div ref={innerRef} {...innerProps} className="custom-option">
        <Flag code={data.flag} className="option-flag" />
        {data.label}
      </div>
    );
  };

  return (
    <Select
      className="country-select"
      classNamePrefix="custom-select"
      options={countries}
      onChange={handleSelectChange}
      components={{ SingleValue: customSingleValue, Option: customOption }}
      getOptionLabel={(e) => (
        <div className="option-label">
          <Flag code={e.flag} className="option-flag" />
          {e.label}
        </div>
      )}
    />
  );
};

export default CountrySelect;