import { GoogleGenAI, Type } from "@google/genai";
import { PredictionResult, SessionData } from "../types";

export const predictSalesIntent = async (sessionData: SessionData): Promise<PredictionResult> => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY not found. Using mock prediction logic.');
      return mockPredict(sessionData);
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `Analyze the following e-commerce session data and predict if the user will make a purchase.
Session Data:
- Time Spent: ${sessionData.timeSpent} seconds
- Pages Visited: ${sessionData.pagesVisited}
- Bounce Rate: ${sessionData.bounceRate}%
- Traffic Source: ${sessionData.trafficSource}
- Device Type: ${sessionData.deviceType}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert e-commerce data analyst AI. Predict user purchase intention based on the session metrics.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intent: {
              type: Type.STRING,
              description: "Prediction outcome. Must be 'Yes' or 'No'",
              enum: ["Yes", "No"]
            },
            confidenceScore: {
              type: Type.NUMBER,
              description: "Confidence percentage from 0 to 100"
            },
            reasoning: {
              type: Type.STRING,
              description: "A brief, 1-2 sentence explanation of why this conclusion was reached based on the data provided."
            }
          },
          required: ["intent", "confidenceScore", "reasoning"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    const json = JSON.parse(text);
    
    return {
      id: `ai-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      sessionData,
      intent: json.intent,
      confidenceScore: json.confidenceScore,
      reasoning: json.reasoning,
    };
  } catch (error) {
    console.error("AI Prediction failed:", error);
    console.warn("Falling back to mock prediction...");
    return mockPredict(sessionData);
  }
};

function mockPredict(sessionData: SessionData): PredictionResult {
  // Simple heuristic-based mock
  let score = 50;
  
  if (sessionData.timeSpent > 120) score += 20;
  else if (sessionData.timeSpent < 30) score -= 20;
  
  if (sessionData.pagesVisited > 4) score += 20;
  else if (sessionData.pagesVisited < 2) score -= 15;
  
  if (sessionData.bounceRate < 40) score += 10;
  else if (sessionData.bounceRate > 70) score -= 20;
  
  if (sessionData.trafficSource === 'Organic') score += 5;
  
  const finalScore = Math.max(0, Math.min(100, score));
  const intent = finalScore > 60 ? 'Yes' : 'No';
  
  return {
    id: `mock-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
    sessionData,
    intent,
    confidenceScore: finalScore,
    reasoning: finalScore > 60 
      ? "\uD83E\uDDE0 Simulated AI: High engagement metrics (time spent and pages visited) indicate strong buyer intent." 
      : "\uD83E\uDDE0 Simulated AI: Low engagement or high bounce rate suggests the user is browsing without immediate intent to purchase.",
  };
}
