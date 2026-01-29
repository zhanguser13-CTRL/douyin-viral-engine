import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedResult } from "../types";

// Define the schema for strict JSON output
const outputSchema = {
  type: Type.OBJECT,
  properties: {
    trendAnalysis: {
      type: Type.OBJECT,
      properties: {
        matchScore: { type: Type.STRING, description: "Composite score (e.g., '92%')." },
        content: { type: Type.STRING, description: "Dual Audit Report in CHINESE." }
      },
      required: ["matchScore", "content"]
    },
    visualKeywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "5-8 visual keywords in CHINESE."
    },
    options: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          viralScore: { type: Type.STRING },
          titleTop: { type: Type.STRING, description: "Line 1 (Visual Hook): High contrast. Optimized for 9:16 screen width." },
          titleMiddle: { type: Type.STRING, description: "Line 2 (Core Fact): Balanced width with Line 1." },
          titleBottom: { type: Type.STRING, description: "Line 3 (Emotional Anchor): Short, punchy." },
          tickerSegments: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3 short news-style lower thirds."
          },
          longTicker: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3 segments of commentary. Each STRICTLY 50-55 chars."
          }
        },
        required: ["id", "viralScore", "titleTop", "titleMiddle", "titleBottom", "tickerSegments", "longTicker"]
      }
    },
    footerCopy: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 lines of interaction starters."
    },
    editingGuide: {
      type: Type.OBJECT,
      properties: {
        pace: { type: Type.STRING },
        opening: { type: Type.STRING },
        bgm: { type: Type.STRING },
        visuals: { type: Type.STRING },
        steps: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      },
      required: ["pace", "opening", "bgm", "visuals", "steps"]
    },
    tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "10 Mixed tags in CHINESE."
    }
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

export const generateViralCopy = async (
  content: string,
  mediaData: { mimeType: string, data: string } | null,
  evolutionHistory: string[]
): Promise<string> => {
  const apiKey = process.env.API_KEY || "AIzaSyCyN0LFoAegAqUgmPH1FiGT34mZC82Fi9A";
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });

  let memoryContext = "";
  if (evolutionHistory.length > 0) {
    memoryContext = `\n[ALGORITHM EVOLUTION DATA]:\n${evolutionHistory.join('\n')}\n`;
  }

  const parts: any[] = [];

  if (mediaData) {
    parts.push({
      inlineData: {
        mimeType: mediaData.mimeType,
        data: mediaData.data
      }
    });
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

  parts.push({ text: textPrompt });

  // Try multiple models in order of preference
  const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];

  let lastError: any = null;

  for (const modelName of models) {
    try {
      console.log(`Trying model: ${modelName}`);
      const response = await ai.models.generateContent({
        model: modelName,
        contents: { parts },
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          responseSchema: outputSchema,
          temperature: 0.7,
        }
      });

      if (response.text) {
        console.log(`Success with model: ${modelName}`);
        return response.text;
      }
    } catch (error: any) {
      console.error(`Model ${modelName} failed:`, error?.message || error);
      lastError = error;
      // Continue to next model
    }
  }

  // If all models failed, throw detailed error
  const errorMessage = lastError?.message || 'Unknown error';
  console.error("All models failed. Last error:", errorMessage);
  throw new Error(`API调用失败: ${errorMessage}`);
};