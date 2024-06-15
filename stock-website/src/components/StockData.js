import React, { useState } from 'react';
import axios from 'axios';

const StockData = () => {
  const [symbol, setSymbol] = useState('');
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState(null);

  const fetchStockData = async () => {
    const upperSymbol = symbol.toUpperCase();

    try {
      const response = await axios.get(`http://localhost:5000/api/stock/${upperSymbol}`);
      console.log('Fetched data:', response.data); // Debugging statement
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
          <p>Price: ${parseFloat(stockData.price).toFixed(2)}</p> {/* Display price with 2 decimal places */}
          <p>Open: ${parseFloat(stockData.open).toFixed(2)}</p> {/* Display open price with 2 decimal places */}
          <p>High: ${parseFloat(stockData.high).toFixed(2)}</p> {/* Display high price with 2 decimal places */}
          <p>Low: ${parseFloat(stockData.low).toFixed(2)}</p> {/* Display low price with 2 decimal places */}
          <p>Close: ${parseFloat(stockData.close).toFixed(2)}</p> {/* Display close price with 2 decimal places */}
          <p>Volume: {stockData.volume}</p>
        </div>
      )}
    </div>
  );
};

export default StockData;
