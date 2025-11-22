import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeSudokuImage = async (base64Image: string, mimeType: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
            {
                inlineData: {
                    mimeType: mimeType,
                    data: base64Image
                }
            },
            {
                text: "Analyze this image of a Sudoku puzzle. Identify the numbers in the 9x9 grid. Use 0 for empty cells. Return a JSON object with a 'grid' property containing the 9x9 array of numbers."
            }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                grid: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.INTEGER
                        }
                    }
                }
            }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const result = JSON.parse(text) as AnalysisResult;
    return result;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};