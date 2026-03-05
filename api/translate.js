// =============================================================
// api/translate.js  — Secure translation proxy (Vercel serverless)
// OWASP: API key in env var only, rate limiting, input validation,
//        sanitization, strict CORS, no key leakage to client
// =============================================================

// ── In-memory rate limit store (per cold-start instance)
// For multi-instance production, replace with Upstash Redis
const rateLimitStore = new Map();

/**
 * Sliding-window rate limiter — IP based
 * Default: 20 requests per 60 seconds per IP
 */
function checkRateLimit(ip, maxRequests = 20, windowMs = 60_000) {
  const now = Date.now();
  const key = `rl:${ip}`;
  const entry = rateLimitStore.get(key) || { count: 0, windowStart: now };

  if (now - entry.windowStart > windowMs) {
    entry.count = 1;
    entry.windowStart = now;
  } else {
    entry.count += 1;
  }

  rateLimitStore.set(key, entry);
  return {
    allowed: entry.count <= maxRequests,
    remaining: Math.max(0, maxRequests - entry.count),
    resetAt: entry.windowStart + windowMs,
  };
}

/**
 * Strip HTML injection vectors and truncate
 */
function sanitizeString(str, maxLen = 500) {
  if (typeof str !== 'string') return '';
  return str
    .slice(0, maxLen)
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .trim();
}

/**
 * Schema-based request validation
 * Accepts: { type: 'ui'|'articles', lang: string, payload: string|array }
 */
function validateBody(body) {
  if (!body || typeof body !== 'object') return { valid: false, error: 'Invalid body' };
  const { type, lang, payload } = body;

  // type must be exactly 'ui' or 'articles'
  if (!['ui', 'articles'].includes(type)) return { valid: false, error: 'Invalid type' };

  // lang: ISO 639 code, 2-5 chars
  if (typeof lang !== 'string' || !/^[a-z]{2,5}(-[A-Z]{2})?$/.test(lang))
    return { valid: false, error: 'Invalid lang code' };

  if (type === 'ui') {
    if (typeof payload !== 'string' || payload.length > 60_000)
      return { valid: false, error: 'UI payload too large' };
  } else {
    if (!Array.isArray(payload) || payload.length > 10)
      return { valid: false, error: 'Articles must be array, max 10' };
    for (const item of payload) {
      if (!item || typeof item !== 'object') return { valid: false, error: 'Invalid article object' };
      if (typeof item.h !== 'string' || item.h.length > 300) return { valid: false, error: 'Headline too long' };
      if (item.e != null && (typeof item.e !== 'string' || item.e.length > 500))
        return { valid: false, error: 'Excerpt too long' };
    }
  }
  return { valid: true };
}

/** Map ISO code to full language name for the prompt */
function getLangName(code) {
  const names = {
    ar:'Arabic', zh:'Chinese (Simplified)', es:'Spanish', fr:'French', de:'German',
    pt:'Portuguese', ru:'Russian', ja:'Japanese', ko:'Korean', hi:'Hindi',
    tr:'Turkish', it:'Italian', nl:'Dutch', pl:'Polish', uk:'Ukrainian',
    fa:'Persian', id:'Indonesian', vi:'Vietnamese', th:'Thai', he:'Hebrew',
    sw:'Swahili', bn:'Bengali', ur:'Urdu', ms:'Malay', ro:'Romanian',
  };
  return names[code] || code;
}

export default async function handler(req, res) {
  // ── OWASP Security Headers ──────────────────────────────────────
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', "default-src 'none'");
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  // ── CORS — only allow your own domains ─────────────────────────
  const origin = req.headers.origin || '';
  const isVercelPreview = /^https:\/\/worldconflictslive[a-z0-9-]*\.vercel\.app$/.test(origin);
  const isCustomDomain = (process.env.ALLOWED_ORIGINS || '')
    .split(',').map(s => s.trim()).includes(origin);
  const isLocal = process.env.NODE_ENV === 'development';

  if (isVercelPreview || isCustomDomain || isLocal) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // ── Rate limiting ───────────────────────────────────────────────
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress || 'unknown';

  const limit = checkRateLimit(ip, 20, 60_000); // 20/min per IP
  res.setHeader('X-RateLimit-Remaining', String(limit.remaining));
  res.setHeader('X-RateLimit-Reset', String(Math.ceil(limit.resetAt / 1000)));

  if (!limit.allowed) {
    return res.status(429).json({
      error: 'Too many translation requests. Please wait a moment.',
      retryAfter: Math.ceil((limit.resetAt - Date.now()) / 1000),
    });
  }

  // ── Parse & validate body ───────────────────────────────────────
  let body;
  try {
    body = typeof req.body === 'object' && req.body !== null
      ? req.body
      : JSON.parse(req.body);
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const { valid, error: validErr } = validateBody(body);
  if (!valid) return res.status(400).json({ error: validErr });

  const { type, lang, payload } = body;

  // ── API key — environment variable ONLY, never exposed to client ─
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Log server-side only, return generic error to client
    console.error('[translate] ANTHROPIC_API_KEY environment variable not set');
    return res.status(503).json({ error: 'Translation service not configured' });
  }

  // ── Build prompt ─────────────────────────────────────────────────
  const langName = getLangName(lang);
  let prompt;

  if (type === 'ui') {
    const safePayload = sanitizeString(payload, 60_000);
    prompt = `Translate these UI strings to ${langName}. Return ONLY a JSON object with the same keys, values translated. Keep emojis, symbols like →←★✓·, and placeholder variables unchanged. Keep very short strings concise. Be natural, not literal.\n\n${safePayload}`;
  } else {
    const safeArticles = payload.map(a => ({
      h: sanitizeString(a.h, 300),
      e: sanitizeString(a.e || '', 500),
    }));
    prompt = `Translate these news article headlines and excerpts to ${langName}. Return ONLY a JSON array with same structure. Keep proper nouns (place names, person names) unchanged.\n\n${JSON.stringify(safeArticles)}`;
  }

  // ── Call Anthropic API ───────────────────────────────────────────
  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,               // NEVER forwarded to client
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', // fast + affordable for translation
        max_tokens: type === 'ui' ? 4000 : 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!anthropicRes.ok) {
      // Log details server-side, return generic error to client
      console.error('[translate] Anthropic API error:', anthropicRes.status);
      return res.status(502).json({ error: 'Translation service error' });
    }

    const anthropicData = await anthropicRes.json();
    const raw = anthropicData.content?.[0]?.text || '';

    // Parse and return only the structured result — no raw API response
    let parsed;
    try {
      const pattern = type === 'ui' ? /\{[\s\S]+\}/ : /\[[\s\S]+\]/;
      const match = raw.match(pattern);
      if (!match) throw new Error('No JSON in response');
      parsed = JSON.parse(match[0]);
    } catch {
      console.error('[translate] Failed to parse model response');
      return res.status(502).json({ error: 'Invalid translation response format' });
    }

    return res.status(200).json({ result: parsed });

  } catch (err) {
    // Log full error server-side, never send stack traces to client
    console.error('[translate] Handler error:', err.message);
    return res.status(500).json({ error: 'Translation failed. Please try again.' });
  }
}
