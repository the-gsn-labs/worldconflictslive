// api/translate.js
// AI-powered translation via Claude. Key stays server-side.
// Rate limited to prevent abuse.

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || '';

// Simple rate limiting: max 30 requests per IP per minute
const rateLimits = new Map();
const RATE_LIMIT = 30;
const RATE_WINDOW = 60 * 1000;

// Cache translations: lang -> { ts, data }
const cache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours — translations don't change

function getRateKey(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown';
}

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimits.get(ip) || { count: 0, ts: now };
  if (now - entry.ts > RATE_WINDOW) {
    rateLimits.set(ip, { count: 1, ts: now });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  rateLimits.set(ip, { count: entry.count + 1, ts: entry.ts });
  return true;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = getRateKey(req);
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Rate limit exceeded. Try again in a minute.' });
  }

  let body = '';
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const { lang, strings, articles } = body || {};

  if (!lang || typeof lang !== 'string' || lang.length > 10) {
    return res.status(400).json({ error: 'Invalid lang parameter' });
  }

  // Sanitize lang code
  const safeLang = lang.replace(/[^a-zA-Z0-9-]/g, '').substring(0, 10);

  if (!ANTHROPIC_KEY) {
    return res.status(200).json({ translated: strings || {}, articles: articles || [] });
  }

  // Check cache
  const cacheKey = `${safeLang}_${JSON.stringify(strings || {}).substring(0, 50)}`;
  if (cache.has(cacheKey) && Date.now() - cache.get(cacheKey).ts < CACHE_TTL) {
    return res.status(200).json(cache.get(cacheKey).data);
  }

  try {
    const prompt = `You are a professional translator. Translate the following to language code "${safeLang}".
For regional variants (es-MX, es-AR, pt-BR, etc.) use authentic regional vocabulary.
For Catalan (ca), Euskera (eu), Galician (gl) use authentic native language, NOT Spanish.
For Arabic (ar), Hebrew (he), Farsi (fa), Urdu (ur) use correct RTL script.
Keep proper nouns, country names, and ticker symbols untranslated.
Return ONLY valid JSON, no markdown, no explanation.

UI strings to translate:
${JSON.stringify(strings || {}, null, 2)}

${articles?.length ? `Article headlines and excerpts (translate naturally, journalistic tone):
${JSON.stringify(articles.map(a => ({ h: a.headline, e: (a.excerpt || '').substring(0, 120) })), null, 2)}` : ''}

Return JSON: { "ui": { ...translated ui strings }, "articles": [ { "h": "...", "e": "..." }, ... ] }`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) throw new Error(`Anthropic ${response.status}`);
    const data = await response.json();
    const raw = data.content?.[0]?.text || '{}';
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned);

    const output = {
      translated: result.ui || strings || {},
      articles: result.articles || [],
    };

    cache.set(cacheKey, { ts: Date.now(), data: output });

    // Evict old cache entries
    if (cache.size > 500) {
      const oldest = [...cache.entries()].sort((a, b) => a[1].ts - b[1].ts).slice(0, 100);
      oldest.forEach(([k]) => cache.delete(k));
    }

    return res.status(200).json(output);
  } catch (err) {
    console.error('Translation error:', err.message);
    return res.status(200).json({ translated: strings || {}, articles: articles || [] });
  }
};
