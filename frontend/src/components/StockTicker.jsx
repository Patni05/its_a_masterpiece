export default function StockTicker({ stocks, onSelect }) {
  return (
    <section className="card">
      <h3>Live Market</h3>
      <div className="ticker-grid">
        {stocks.map((stock) => (
          <button key={stock.symbol} className="ticker-item" onClick={() => onSelect(stock.symbol)}>
            <strong>{stock.symbol}</strong>
            <span>{stock.name}</span>
            <span>₹{stock.currentPrice.toFixed(2)}</span>
            <span className={stock.change >= 0 ? 'pos' : 'neg'}>{stock.change >= 0 ? '+' : ''}{stock.change}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
