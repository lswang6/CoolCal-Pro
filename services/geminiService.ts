
import { GoogleGenAI } from "@google/genai";
import { Language, RoomType } from "../types";

export const getCoolingAnalysis = async (
  area: number,
  roomType: RoomType,
  description: string,
  lang: Language
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = lang === Language.EN 
    ? `Acting as an HVAC engineer using ASHRAE standards, analyze a ${roomType} of ${area} square meters. Additional context: "${description}". Provide a brief (max 100 words) professional advice on specific cooling challenges for this space and if any adjustments to standard capacity are needed.`
    : `En tant qu'ingénieur CVC utilisant les normes ASHRAE, analysez une pièce de type ${roomType} de ${area} mètres carrés. Contexte supplémentaire : "${description}". Fournissez un bref conseil professionnel (max 100 mots) sur les défis spécifiques de refroidissement pour cet espace et si des ajustements à la capacité standard sont nécessaires.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return lang === Language.EN 
      ? "Unable to provide AI analysis at this time. Please use the standard calculations."
      : "Impossible de fournir l'analyse IA pour le moment. Veuillez utiliser les calculs standards.";
  }
};
