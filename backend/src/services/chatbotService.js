import Stock from '../models/Stock.js';
import StockHistory from '../models/StockHistory.js';

const ruleBasedReplies = {
  buy: 'To buy stocks: search the symbol, choose quantity, review estimated total, and submit a BUY order from the Trade panel.',
  sell: 'To sell stocks: open your holdings, choose an owned stock, set quantity, and submit a SELL order. Ensure your available quantity is enough.',
  profit: 'Profit/Loss = (Current Price - Average Buy Price) × Quantity. The dashboard analytics card calculates this automatically.',
  suggestion: 'Diversify between technology, finance, and energy sectors. Use market cap and momentum from analytics before taking decisions.'
};

export const chatbotReply = async (query) => {
  const normalized = query.toLowerCase();

  if (normalized.includes('buy')) return { text: ruleBasedReplies.buy };
  if (normalized.includes('sell')) return { text: ruleBasedReplies.sell };
  if (normalized.includes('profit') || normalized.includes('loss')) return { text: ruleBasedReplies.profit };
  if (normalized.includes('best stock') || normalized.includes('suggest')) return { text: ruleBasedReplies.suggestion };

  if (normalized.includes('tata') || normalized.includes('jio')) {
    const symbols = ['TATA', 'JIO'];
    const payload = [];

    for (const symbol of symbols) {
      const stock = await Stock.findOne({ symbol });
      const history = await StockHistory.find({ symbol }).sort({ timestamp: 1 }).limit(400);
      payload.push({
        symbol,
        name: stock?.name || symbol,
        latestPrice: stock?.currentPrice || null,
        history: history.map((h) => ({ date: h.timestamp, price: h.price }))
      });
    }

    return {
      text: 'I found analytics for Tata and Jio. You can inspect the comparative chart in the assistant panel.',
      analytics: payload
    };
  }

  return {
    text: 'I can help with buying/selling steps, P&L calculation, stock suggestions, and Tata/Jio historical analysis prompts.'
  };
};
