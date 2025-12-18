
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../types";

export const queryGeminiAboutUser = async (userPrompt: string): Promise<Message> => {
  // Directly initialize GoogleGenAI with process.env.API_KEY as per guidelines.
  // We assume this variable is pre-configured and accessible.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      // Using gemini-3-pro-preview for complex technical reasoning and software architecture tasks.
      model: "gemini-3-pro-preview",
      contents: `User Query regarding boywithdv: ${userPrompt}`,
      config: {
        systemInstruction: `You are the specialized AI for 'boywithdv' (GitHub: https://github.com/boywithdv).
          CORE PERSONA:
          - boywithdv is a Senior Flutter & Dart Engineer.
          - Expert in Cross-Platform Mobile Architecture, Clean Architecture, BLoC, and Riverpod.
          - Passionate about high-performance UI and natively compiled applications.
          - Tone: Professional, technical, efficient. Use developer terminology.
          
          CAPABILITIES:
          - Use Google Search to retrieve current repository status and project details from his GitHub.
          - If information is missing, provide logical assumptions based on common Flutter developer workflows.
          - Always cite sources for project data.`,
        tools: [{ googleSearch: {} }],
      },
    });

    // Access the .text property directly (not a method) as per guidelines.
    const text = response.text || "I was unable to process the query. No output generated.";
    
    // Extract grounding metadata for web sources when using the googleSearch tool.
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    // Map grounding chunks to the sources expected by the UI. 
    // They are typically in the format [{ "web": { "uri": "...", "title": "..." } }, ...].
    const sources = (groundingChunks as { web: { uri: string; title: string } }[]) || [];

    return {
      role: 'assistant',
      text,
      sources
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      role: 'assistant',
      text: "ERROR: Communication timeout with neural engine. Please check your network."
    };
  }
};
