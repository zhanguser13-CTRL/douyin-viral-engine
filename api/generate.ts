import type { VercelRequest, VercelResponse } from '@vercel/node';

// IMPORTANT: API key must be set in Vercel environment variables
// Never hardcode API keys in source code
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY environment variable is not set');
}

const outputSchema = {
  type: "OBJECT",
  properties: {
    trendAnalysis: {
      type: "OBJECT",
      properties: {
        matchScore: { type: "STRING" },
        content: { type: "STRING" }
      },
      required: ["matchScore", "content"]
    },
    visualKeywords: {
      type: "ARRAY",
      items: { type: "STRING" }
    },
    options: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          id: { type: "INTEGER" },
          viralScore: { type: "STRING" },
          titleTop: { type: "STRING" },
          titleMiddle: { type: "STRING" },
          titleBottom: { type: "STRING" },
          tickerSegments: { type: "ARRAY", items: { type: "STRING" } },
          longTicker: { type: "ARRAY", items: { type: "STRING" } }
        },
        required: ["id", "viralScore", "titleTop", "titleMiddle", "titleBottom", "tickerSegments", "longTicker"]
      }
    },
    footerCopy: { type: "ARRAY", items: { type: "STRING" } },
    editingGuide: {
      type: "OBJECT",
      properties: {
        pace: { type: "STRING" },
        opening: { type: "STRING" },
        bgm: { type: "STRING" },
        visuals: { type: "STRING" },
        steps: { type: "ARRAY", items: { type: "STRING" } }
      },
      required: ["pace", "opening", "bgm", "visuals", "steps"]
    },
    tags: { type: "ARRAY", items: { type: "STRING" } }
  },
  required: ["trendAnalysis", "visualKeywords", "options", "footerCopy", "editingGuide", "tags"]
};

const SYSTEM_INSTRUCTION = `
You are the **Douyin Viral Algorithm Architect V4.0**.
Expertise: **News-Grade / Deep-Dive Social Commentary** for **Women aged 30-50**.
OUTPUT: **Simplified Chinese**.

**PROTOCOLS:**
1. **DEEP ANALYSIS**: Tone: Rational, Insightful, Empathetic. Target: Pain points (Parenting, Marriage, Self-growth).
2. **VISUAL HIERARCHY (9:16 Golden Ratio)**:
   - **Line 1 (Hook)**: Big, Bold, Impactful. Fits on one line. (e.g. "为什么越懂事的女人越苦？")
   - **Line 2 (Core)**: Stabilizing, Informative. (e.g. "心理学家揭秘讨好型人格")
   - **Line 3 (Anchor)**: Emotional, Short. (e.g. "别再委屈自己")
   - **Layout**: Inverted pyramid or stable block. Balanced visual weight.
3. **LONG TICKER**: 3 phases (Hook -> Analysis -> Value). Each segment **50-55 chars**.

Return ONLY valid JSON matching the provided schema.
`;

const MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];

async function callGeminiAPI(model: string, content: string, mediaData: any, history: string[]) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

  let memoryContext = "";
  if (history && history.length > 0) {
    memoryContext = `\n[ALGORITHM EVOLUTION DATA]:\n${history.join('\n')}\n`;
  }

  const textPrompt = `
  Analyze this content for Douyin/TikTok (Target: Women 30-50).
  OUTPUT LANGUAGE: SIMPLIFIED CHINESE ONLY.

  User Context: "${content || "Visual Analysis"}"
  ${memoryContext}

  Task: Generate 3 Viral Strategy Options.
  CONSTRAINTS:
  1. **3-Line Title Stack**: Optimize for 9:16 Vertical Screen. Focus on visual impact and hierarchy.
  2. **LongTicker**: STRICTLY 50-55 chars/segment.
  `;

  const parts: any[] = [];

  if (mediaData) {
    parts.push({
      inlineData: {
        mimeType: mediaData.mimeType,
        data: mediaData.data
      }
    });
  }

  parts.push({ text: textPrompt });

  const requestBody = {
    contents: [{ parts }],
    systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
    generationConfig: {
      temperature: 0.7,
      responseMimeType: "application/json",
      responseSchema: outputSchema
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();

  if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
    return data.candidates[0].content.parts[0].text;
  }

  throw new Error('No valid response from API');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if API key is configured
  if (!GEMINI_API_KEY) {
    return res.status(500).json({
      success: false,
      error: 'API密钥未配置，请联系管理员'
    });
  }

  // Basic authentication check - verify Authorization header exists
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: '未登录或登录已过期'
    });
  }

  try {
    const { content, mediaData, history } = req.body;

    let lastError: any = null;

    for (const model of MODELS) {
      try {
        console.log(`Trying model: ${model}`);
        const result = await callGeminiAPI(model, content, mediaData, history);
        console.log(`Success with model: ${model}`);
        return res.status(200).json({ success: true, data: result });
      } catch (error: any) {
        console.error(`Model ${model} failed:`, error.message);
        lastError = error;
      }
    }

    throw lastError || new Error('All models failed');

  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Unknown error'
    });
  }
}
