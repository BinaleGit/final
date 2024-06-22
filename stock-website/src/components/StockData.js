import React, { useState } from 'react';
import axios from 'axios';
import './StockData.css'; // Import the CSS file for styling

const StockData = () => {
  const [symbol, setSymbol] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState(null);

  const fetchSuggestions = async (input) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/suggestions/${input}`);
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions', error);
    }
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setSymbol(input);
    if (input.length > 1) {
      fetchSuggestions(input);
    } else {
      setSuggestions([]);
    }
  };

  const handleFetchStockData = async (symbol) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/stock/${symbol}`);
      console.log('Fetched data:', response.data);
      setStockData(response.data);
      setError(null);
      setSymbol(''); // Reset input after fetching data
      setSuggestions([]); // Clear suggestions after fetching data
    } catch (error) {
      console.error('Error fetching stock data', error);
      setError(error.response ? error.response.data.error : 'An error occurred');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleFetchStockData(suggestion.symbol);
  };

  return (
    <div>
      <input
        type="text"
        value={symbol}
        onChange={handleInputChange}
        placeholder="Enter stock symbol or name"
        className="stock-input"
      />
      <div className="suggestions">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="suggestion-item"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            <span className="suggestion-symbol">{suggestion.symbol}</span>
            <span className="suggestion-name">{suggestion.name}</span>
          </div>
        ))}
      </div>
      {error && <div className="error">Error: {error}</div>}
      {stockData && (
        <table className="stock-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Name</th>
              <th>Date</th>
              <th>Price</th>
              <th>Open</th>
              <th>High</th>
              <th>Low</th>
              <th>Close</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{stockData.symbol}</td>
              <td>{stockData.name}</td>
              <td>{stockData.date}</td>
              <td>${parseFloat(stockData.price).toFixed(2)}</td>
              <td>${parseFloat(stockData.open).toFixed(2)}</td>
              <td>${parseFloat(stockData.high).toFixed(2)}</td>
              <td>${parseFloat(stockData.low).toFixed(2)}</td>
              <td>${parseFloat(stockData.close).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StockData;
