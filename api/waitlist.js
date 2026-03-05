// =============================================================
// api/waitlist.js — Waitlist email capture
// Stores emails to Vercel KV (or logs them if KV not configured)
// Rate limited: 3 signups per IP per hour
// =============================================================

const rateLimitStore = new Map();

function checkRateLimit(ip) {
  const max = 3, windowMs = 3600000; // 3 per hour
  const now = Date.now();
  const entry = rateLimitStore.get(ip) || { count: 0, windowStart: now };
  if (now - entry.windowStart > windowMs) { entry.count = 1; entry.windowStart = now; }
  else { entry.count += 1; }
  rateLimitStore.set(ip, entry);
  return { allowed: entry.count <= max, resetAt: entry.windowStart + windowMs };
}

function isValidEmail(email) {
  return typeof email === 'string' &&
    email.length <= 254 &&
    /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/.test(email);
}

module.exports = async function handler(req, res) {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Rate limit
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  // Parse + validate
  let body;
  try {
    body = typeof req.body === 'object' ? req.body : JSON.parse(req.body);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  const email = (body.email || '').toLowerCase().trim();
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  // Store the email
  // Option 1: Vercel KV (if configured) — set KV_REST_API_URL + KV_REST_API_TOKEN in env vars
  // Option 2: Log to console (visible in Vercel function logs as fallback)
  const timestamp = new Date().toISOString();

  try {
    const kvUrl = process.env.KV_REST_API_URL;
    const kvToken = process.env.KV_REST_API_TOKEN;

    if (kvUrl && kvToken) {
      // Store in Vercel KV: key = waitlist:<email>, value = timestamp
      const kvKey = 'waitlist:' + email.replace(/[^a-z0-9@._-]/g, '');
      await fetch(`${kvUrl}/set/${encodeURIComponent(kvKey)}/${encodeURIComponent(timestamp)}`, {
        headers: { Authorization: `Bearer ${kvToken}` },
      });

      // Also add to a sorted set for easy listing: zadd waitlist_emails score=timestamp member=email
      await fetch(`${kvUrl}/zadd/waitlist_emails`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${kvToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: Date.now(), member: email }),
      });

      console.log(`[waitlist] Stored in KV: ${email}`);
    } else {
      // Fallback: log to Vercel function logs (visible in dashboard)
      // You can grep these in Vercel Logs → Functions tab
      console.log(`[waitlist] NEW SIGNUP: ${email} at ${timestamp}`);
    }

    return res.status(200).json({ ok: true });

  } catch (err) {
    // Still return success to user — don't expose storage errors
    console.error('[waitlist] Storage error:', err.message, '| email:', email);
    // Log it so you don't lose it
    console.log(`[waitlist] FALLBACK LOG: ${email} at ${timestamp}`);
    return res.status(200).json({ ok: true });
  }
};
