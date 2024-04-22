import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../CurrencyConverter.css';

const API_KEY = 'ae74c207989caf1cae1808fa';

const CurrencyConverter = () => {

  const [countries, setCountries] = useState([]);
  const [selectedFromCountry, setSelectedFromCountry] = useState('');
  const [selectedToCountry, setSelectedToCountry] = useState('');
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [inputError, setInputError] = useState('');

  useEffect(() => {
    const fetchCountryList = async () => {
      try {
        const response = await axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`);
        const data = response.data;
        console.log('Fetched country list:', data.conversion_rates);
        // Extract country codes from the response data
        const countryList = Object.keys(data.conversion_rates);
        setCountries(countryList);
      } catch (error) {
        console.error('Error fetching country list:', error);
      }
    };

    fetchCountryList();
  }, []);

  const convertAmount = async () => {
    try {
      // Fetch exchange rate for selected countries
      setInputError('');
      const response = await axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${selectedFromCountry}`);
      const data = response.data;
      console.log('Exchange rates:', data.conversion_rates);
      // Convert amount from selectedFromCountry to selectedToCountry
      const exchangeRate = data.conversion_rates[selectedToCountry];
      const converted = parseFloat(amount) * exchangeRate;
      setConvertedAmount(converted.toFixed(2));
      if(isNaN(converted)){
        setInputError("Please input amount!")
        setConvertedAmount('');
      }
      
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    }
  };

  return (
    <div className="currency-converter-container">
      <h2 className='title-name'>Currency Converter</h2>
      <div className="combo-box-container">
        <label className="label">From Country:</label>
        <select className="combo-box" value={selectedFromCountry} onChange={(e) => setSelectedFromCountry(e.target.value)}>
          <option value="">Select a country</option>
          {countries.map((country, index) => (
            <option key={index} value={country}>{country}</option>
          ))}
        </select>
        <label className="label">To Country:</label>
        <select className="combo-box" value={selectedToCountry} onChange={(e) => setSelectedToCountry(e.target.value)}>
          <option value="">Select a country</option>
          {countries.map((country, index) => (
            <option key={index} value={country}>{country}</option>
          ))}
        </select>
        <label className="label">Enter amount:</label>
        <input className="input"
          type="number"
          value={amount} defaultValue={1}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button className="convert-button" onClick={convertAmount}>Convert</button>
      </div>
      {
      convertedAmount && (
        <div className="converted-amount">
          <label className="label">Exchange amount is :</label>
          <span className="converted-amount-value">{convertedAmount}</span>
        </div>
        )
      }
      {
      inputError && (
        <div className="converted-amount">
          <span className="converted-amount-value">{inputError}</span>
        </div>
        )
      }
      </div>
      );
    };
      
    export default CurrencyConverter;