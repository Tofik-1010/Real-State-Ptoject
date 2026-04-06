import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { preferences, properties } = req.body;
  const apiKey = process.env.AI_API_KEY;
  const apiUrl = process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions';
  const model = process.env.AI_MODEL || 'gpt-3.5-turbo';

  if (!apiKey) {
    return res.status(200).json({
      analysis: `Based on your preferences (${preferences}), we've matched the best properties from our catalog. Please review the recommendations below.`,
      recommendedIds: [],
    });
  }

  try {
    const systemPrompt = `You are a senior Indian real estate advisor. The user has these preferences: ${preferences}
Available properties:
${properties}

Analyze the properties and recommend the top 3 best matches. Return your response in this JSON format:
{"analysis": "Your detailed analysis in markdown", "recommendedIds": ["id1", "id2", "id3"]}

Be specific about why each property matches. Use Indian real estate terminology. Mention locality advantages, price-per-sqft analysis, and investment potential.`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Find the best properties for: ${preferences}` },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return res.status(200).json(parsed);
      }
    } catch {
      // If JSON parsing fails, return raw content
    }

    return res.status(200).json({
      analysis: content,
      recommendedIds: [],
    });
  } catch (err: any) {
    console.error('AI recommend error:', err);
    return res.status(200).json({
      analysis: `Based on your preferences (${preferences}), we've selected the best matching properties. Our AI service is temporarily unavailable for detailed analysis.`,
      recommendedIds: [],
    });
  }
}
