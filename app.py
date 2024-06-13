from flask import Flask, jsonify
import yfinance as yf
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

@app.route('/api/stock/<symbol>', methods=['GET'])
def get_stock_data(symbol):
    try:
        stock = yf.Ticker(symbol)
        hist = stock.history(period="1mo", interval="1d")

        if hist.empty:
            print(f"No data found for symbol {symbol}")
            return jsonify({"error": f"No data found for symbol {symbol}"}), 404

        data = {
            "symbol": symbol,
            "price": hist['Close'].iloc[-1],
            "date": hist.index[-1].strftime('%Y-%m-%d')
        }
        return jsonify(data)
    except Exception as e:
        print(f"Error fetching stock data: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
