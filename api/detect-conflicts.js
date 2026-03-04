export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const newsUrl = `https://newsapi.org/v2/top-headlines?category=general&pageSize=30&language=en&apiKey=${process.env.NEWSAPI_KEY}`;
    const newsResp = await fetch(newsUrl);
    const newsData = await newsResp.json();

    if (!newsData.articles || newsData.articles.length === 0) {
      return res.status(200).json({ conflicts: [] });
    }

    const headlines = newsData.articles
      .map(a => `- ${a.title} (${a.source?.name || 'Unknown'})`)
      .join('\n');

    const prompt = `You are a geopolitical analyst. Review these recent news headlines and identify any NEW or ESCALATING international conflicts, wars, territorial disputes, or major political crises involving multiple countries or armed groups.

Headlines:
${headlines}

For each conflict you identify, respond with a JSON array. Each item should have:
- title: short name in caps (e.g. "IRAN · ISRAEL · US")
- flags: relevant country flag emojis
- region: geographic region
- severity: "critical", "high", or "medium"
- summary: one sentence explaining the conflict
- markets: array of affected markets from this list only: ["crude","gold","natgas","wheat","rub","ils","rtx"]
- query: 3-4 word search query to find more news about this conflict

Only include genuine international conflicts or crises. Ignore domestic politics, elections, economic news, sports, entertainment.

Respond with ONLY a valid JSON array, no other text. If no conflicts found, respond with [].`;

    const claudeResp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const claudeData = await claudeResp.json();
    const rawText = claudeData.content?.[0]?.text || '[]';

    let detectedConflicts = [];
    try {
      const cleaned = rawText.replace(/```json|```/g, '').trim();
      detectedConflicts = JSON.parse(cleaned);
    } catch(e) {
      detectedConflicts = [];
    }

    return res.status(200).json({
      conflicts: detectedConflicts,
      scanned: newsData.articles.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return res.status(500).json({ error: 'Detection failed', details: error.message });
  }
}
