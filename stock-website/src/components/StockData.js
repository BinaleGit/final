import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StockData = () => {
  const [symbol, setSymbol] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (symbol.length >= 2) {
      fetchSuggestions(symbol);
    } else {
      setSuggestions([]);
    }
  }, [symbol]);

  const fetchSuggestions = async (input) => {
    const upperInput = input.toUpperCase();

    try {
      const response = await axios.get(`http://localhost:5000/api/suggestions/${upperInput}`);
      const top5Suggestions = response.data.slice(0, 5);
      setSuggestions(top5Suggestions);
      setShowMore(response.data.length > 5);
    } catch (error) {
      console.error('Error fetching suggestions', error);
    }
  };

  const handleFetchStockData = async (stockSymbol) => {
    let upperSymbol = stockSymbol.toUpperCase();
    let originalSymbol = upperSymbol;

    if (upperSymbol === "S&P 500") {
      upperSymbol = "^GSPC";
    } else if (upperSymbol === "NDQ") {
      upperSymbol = "^IXIC";
    } else if (upperSymbol === "BITCOIN") {
      upperSymbol = "BTC-USD";
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/stock/${upperSymbol}`);
      console.log('Fetched data:', response.data);
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
      <div>
        {suggestions.map((suggestion, index) => (
          <div key={index} onClick={() => handleFetchStockData(suggestion)}>
            {suggestion}
          </div>
        ))}
        {showMore && <button onClick={() => setShowMore(false)}>More</button>}
      </div>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {stockData && (
        <table border="1">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Date</th>
              <th>Open</th>
              <th>High</th>
              <th>Low</th>
              <th>Close</th>
              <th>Volume</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{stockData.symbol}</td>
              <td>{stockData.date}</td>
              <td>${parseFloat(stockData.open).toFixed(2)}</td>
              <td>${parseFloat(stockData.high).toFixed(2)}</td>
              <td>${parseFloat(stockData.low).toFixed(2)}</td>
              <td>${parseFloat(stockData.close).toFixed(2)}</td>
              <td>{stockData.volume}</td>
              <td>${parseFloat(stockData.price).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StockData;
