from flask import Flask, jsonify
import yfinance as yf
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# A global variable to cache all stock symbols and their names
ALL_STOCKS = []

def fetch_all_stock_symbols():
    global ALL_STOCKS
    url_sp500 = "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies"
    url_tase = "https://en.wikipedia.org/wiki/TA-125_Index"
    
    # Fetch S&P 500 companies
    sp500_table = pd.read_html(url_sp500, header=0)
    sp500_df = sp500_table[0]
    sp500_stocks = sp500_df[['Symbol', 'Security']].to_dict(orient='records')

    # Fetch Tel Aviv Stock Exchange companies
    tase_table = pd.read_html(url_tase, header=0)
    tase_df = tase_table[1]  # The second table in the page contains the required data

    tase_stocks = tase_df[['Symbol', 'Name']].to_dict(orient='records')

    # Combine the stocks from both exchanges
    ALL_STOCKS = sp500_stocks # need to add tase_stocks

fetch_all_stock_symbols()
print(ALL_STOCKS)




@app.route('/api/stock/<symbol>', methods=['GET'])
def get_stock_data(symbol):
    symbol = symbol.upper()

    try:
        stock = yf.Ticker(symbol)
        hist = stock.history(period="1mo", interval="1d")
        
        if hist.empty:
            print(f"No data found for symbol {symbol}")
            return jsonify({"error": f"No data found for symbol {symbol}"}), 404

        latest_data = hist.iloc[-1]
        data = {
            "symbol": symbol,
            "name": next((item['Security'] for item in ALL_STOCKS if item['Symbol'] == symbol), symbol), # Get real name
            "date": latest_data.name.strftime('%Y-%m-%d'),
            "open": latest_data['Open'],
            "high": latest_data['High'],
            "low": latest_data['Low'],
            "close": latest_data['Close'],
            "price": float(latest_data['Close'])  # Include latest stock price
        }
        return jsonify(data)
    except Exception as e:
        print(f"Error fetching stock data: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/suggestions/<input>', methods=['GET'])
def get_suggestions(input):
    input = input.upper()
    matching_suggestions = [
        {"symbol": stock['Symbol'], "name": stock['Security']}
        for stock in ALL_STOCKS
        if input in stock['Symbol'] or input in stock['Security'].upper()
    ][:5]
    return jsonify(matching_suggestions)





if __name__ == '__main__':
    app.run(debug=True)
