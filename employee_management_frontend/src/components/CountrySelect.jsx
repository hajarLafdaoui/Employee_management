import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Flag from 'react-world-flags';

const CountrySelect = ({ onChange }) => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    // Fetch list of countries
    const fetchCountries = async () => {
      const response = await fetch('https://restcountries.com/v3.1/all');
      const data = await response.json();
      const countriesList = data.map((country) => ({
        label: country.name.common,  // Full country name
        value: country.name.common,  // Use the full country name as value
        flag: country.cca2, // 2-letter country code for the flag
      }));
      setCountries(countriesList);
    };

    fetchCountries();
  }, []);

  // Handle country selection
  const handleSelectChange = (selectedOption) => {
    onChange(selectedOption); // Pass selected option (full country name) to parent
  };

  // Option format with flag
  const customSingleValue = ({ data }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Flag code={data.flag} style={{ width: 20, height: 15, marginRight: 10 }} />
      {data.label}
    </div>
  );

  const customOption = (props) => {
    const { data, innerRef, innerProps } = props;
    return (
      <div ref={innerRef} {...innerProps} style={{ display: 'flex', alignItems: 'center' }} className='flag'>
        <Flag code={data.flag} style={{ width: 20, height: 15, marginRight: 10 }} />
        {data.label}
      </div>
    );
  };

  return (
    <Select
      options={countries}
      onChange={handleSelectChange}
      getOptionLabel={(e) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Flag code={e.flag} style={{ width: 20, height: 15, marginRight: 10 }} />
          {e.label}
        </div>
      )}
      components={{ SingleValue: customSingleValue, Option: customOption }}
    />
  );
};

export default CountrySelect;
