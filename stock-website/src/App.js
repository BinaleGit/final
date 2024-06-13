// src/App.js

import React from 'react';
import './App.css';
import StockData from './components/StockData';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Stock Data</h1>
        <StockData />
      </header>
    </div>
  );
}

export default App;
