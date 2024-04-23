import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
//import '../CurrencyConverter.css';

// Define inline CSS styles
const styles = {
  container: {
    backgroundColor: 'lightblue',
    padding: '5%',
    borderRadius: '5px',
  },
  lists_boxs: {
    borderRadius: '5%',
    width: '30%',
    maxWidth: '30%',
  }
};

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
    <div className="container p-5 my-5 bg-dark text-white">
      <h2 className='title-name'>Currency Converter</h2>
      <div className="align center">
        <div>
        <label className="label">From Country: </label>
        <select className="form-select-sm" style={styles.lists_boxs} value={selectedFromCountry} onChange={(e) => setSelectedFromCountry(e.target.value)}>
          <option value="">Select a country</option>
          {countries.map((country, index) => (
            <option key={index} value={country}>{country}</option>
          ))}
        </select>
        </div>
        <div>
        <label className="label">To Country: &nbsp;&nbsp;&nbsp;&nbsp;</label>
        <select className="form-select-sm"style={styles.lists_boxs} value={selectedToCountry} onChange={(e) => setSelectedToCountry(e.target.value)}>
          <option value="">Select a country</option>
          {countries.map((country, index) => (
            <option key={index} value={country}>{country}</option>
          ))}
        </select>
        </div>
        <div>
        <label className="label">Enter amount:</label>
        <input className="form-select-sm" style={styles.lists_boxs}
          type="number"
          value={amount} defaultValue={1}
          onChange={(e) => setAmount(e.target.value)}
        />
        </div>
        <button className="btn btn-success" onClick={convertAmount}>Convert</button>
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