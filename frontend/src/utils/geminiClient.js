import { GoogleGenerativeAI } from "@google/generative-ai";

// Your actual Gemini API key
const API_KEY = "AIzaSyCuN3KU64S-KI3lSbxl7uWxLjIx5RNryzU"; // Free, working key

const genAI = new GoogleGenerativeAI(API_KEY);

export async function getDisasterSafetyTips(disasterType) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.7,
      topP: 1,
      topK: 1,
      maxOutputTokens: 2048,
    },
  });

  const prompt = `Give 5 safety tips for ${disasterType} disaster in short bullet points.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
