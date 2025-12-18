
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../types";

export const queryGeminiAboutUser = async (userPrompt: string): Promise<Message> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Information request about GitHub user 'boywithdv': ${userPrompt}`,
      config: {
        systemInstruction: "You are an expert portfolio assistant for the developer 'boywithdv'. 'boywithdv' is a highly skilled software engineer specializing in Flutter and Dart for cross-platform mobile application development. Use Google Search to find accurate, up-to-date information from their GitHub profile (https://github.com/boywithdv) and public activities. When asked about skills, always emphasize expertise in Flutter, state management (BLoC/Riverpod), and high-performance UI. Be concise, professional, and dark-themed in your tone. Always cite sources.",
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "I couldn't find specific details on that right now.";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    // Process grounding chunks into simplified source list
    const sources = groundingChunks?.map((chunk: any) => chunk) || [];

    return {
      role: 'assistant',
      text,
      sources
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      role: 'assistant',
      text: "Sorry, I encountered an error while trying to fetch that information. Please check back later."
    };
  }
};
