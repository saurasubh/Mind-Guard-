import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const model = "gemini-3-flash-preview";

export async function getNextAction(goal: string) {
  const response = await ai.models.generateContent({
    model,
    contents: `The user is struggling with procrastination and fear. They have this goal: "${goal}". 
    Break this down into the absolute SMALLEST, most non-threatening "Next Step". 
    Explain WHY this step matters and give a quick motivational boost.
    Format your response as JSON with keys: "step", "why", "motivation".`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          step: { type: Type.STRING },
          why: { type: Type.STRING },
          motivation: { type: Type.STRING },
        },
        required: ["step", "why", "motivation"],
      },
    },
  });
  return JSON.parse(response.text || "{}");
}

export async function analyzeSituation(situation: string) {
  const response = await ai.models.generateContent({
    model,
    contents: `The user feels they are being taken advantage of or "fooled" by others. 
    Situation: "${situation}".
    Analyze this objectively. Look for red flags of manipulation or dependency. 
    Provide advice on how to set a boundary or take independent action.
    Format your response as JSON with keys: "analysis", "redFlags", "advice".`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          analysis: { type: Type.STRING },
          redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
          advice: { type: Type.STRING },
        },
        required: ["analysis", "redFlags", "advice"],
      },
    },
  });
  return JSON.parse(response.text || "{}");
}

export async function reframeNegativity(thought: string) {
  const response = await ai.models.generateContent({
    model,
    contents: `The user has a negative, fearful thought: "${thought}".
    Reframe this into a growth-oriented, realistic perspective. 
    Don't use toxic positivity; be practical and empowering.
    Format your response as JSON with keys: "reframedThought", "actionableInsight".`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          reframedThought: { type: Type.STRING },
          actionableInsight: { type: Type.STRING },
        },
        required: ["reframedThought", "actionableInsight"],
      },
    },
  });
  return JSON.parse(response.text || "{}");
}
