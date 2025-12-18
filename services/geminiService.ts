
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../types.ts";

export const queryGeminiAboutUser = async (userPrompt: string): Promise<Message> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Information request about GitHub user 'boywithdv': ${userPrompt}`,
      config: {
        systemInstruction: "You are the personal AI assistant for 'boywithdv'. boywithdv is a premier software engineer specializing in mobile app development with Flutter and Dart. He is an expert in creating high-performance, cross-platform applications with beautiful UIs and solid architecture (BLoC, Riverpod, Clean Architecture). Use Google Search to find up-to-date details from his GitHub profile (https://github.com/boywithdv). Always present him as a Flutter specialist. Keep answers professional, concise, and aligned with a dark-themed aesthetic. Cite sources when possible.",
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "I couldn't find specific details on that right now.";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
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
      text: "I'm having trouble connecting to my knowledge base. Please try again in a moment."
    };
  }
};
