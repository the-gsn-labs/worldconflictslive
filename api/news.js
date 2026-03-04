export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Missing query parameter' });
  }

  try {
    const NEWSAPI_KEY = '19bd1f311473448283e890856cd50fb2';
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&sortBy=publishedAt&pageSize=8&language=en&apiKey=${NEWSAPI_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch news', details: error.message });
  }
}
