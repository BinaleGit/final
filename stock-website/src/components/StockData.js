// src/components/StockData.js

import React, { useState } from 'react';
import axios from 'axios';

const StockData = () => {
  const [symbol, setSymbol] = useState('');
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState(null);

  const fetchStockData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/stock/${symbol.toUpperCase()}`);
      setStockData(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching stock data', error);
      setError(error.response ? error.response.data.error : 'An error occurred');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Enter stock symbol"
      />
      <button onClick={fetchStockData}>Get Stock Data</button>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {stockData && (
        <div>
          <h3>Stock Data for {stockData.symbol}</h3>
          <p>Date: {stockData.date}</p>
          <p>Price: ${stockData.price}</p>
        </div>
      )}
    </div>
  );
};

export default StockData;
