// api/markets.js
const AV_KEY = process.env.ALPHAVANTAGE_KEY || 'TJHKA41C86FL42QI';
const cache = {};
const CACHE_TTL = 60 * 1000;

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).end();
  }
  const { symbol, fn = 'GLOBAL_QUOTE' } = req.query;
  if (!symbol) return res.status(400).json({ error: 'Missing symbol' });
  const safeSymbol = String(symbol).replace(/[^A-Z0-9._-]/gi, '').substring(0, 20).toUpperCase();
  const cacheKey = `${fn}_${safeSymbol}`;
  if (cache[cacheKey] && Date.now() - cache[cacheKey].ts < CACHE_TTL) {
    return res.status(200).json(cache[cacheKey].data);
  }
  try {
    const url = new URL('https://www.alphavantage.co/query');
    url.searchParams.set('function', fn);
    url.searchParams.set('symbol', safeSymbol);
    url.searchParams.set('apikey', AV_KEY);
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`AV ${response.status}`);
    const data = await response.json();
    cache[cacheKey] = { ts: Date.now(), data };
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ error: 'Failed to fetch market data' });
  }
};
