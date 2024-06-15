from flask import Flask, jsonify
import yfinance as yf
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

@app.route('/api/stock/<symbol>', methods=['GET'])
def get_stock_data(symbol):
    symbol = symbol.upper()  # Ensure the symbol is in uppercase

    try:
        stock = yf.Ticker(symbol)
        hist = stock.history(period="1mo", interval="1d")
        
        if hist.empty:
            print(f"No data found for symbol {symbol}")
            return jsonify({"error": f"No data found for symbol {symbol}"}), 404

        latest_data = hist.iloc[-1]
        data = {
            "symbol": symbol,
            "date": latest_data.name.strftime('%Y-%m-%d'),
            "open": latest_data['Open'],
            "high": latest_data['High'],
            "low": latest_data['Low'],
            "close": latest_data['Close'],
            "volume": int(latest_data['Volume']),
            "price": float(latest_data['Close'])  # Include latest stock price
        }
        return jsonify(data)
    except Exception as e:
        print(f"Error fetching stock data: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
