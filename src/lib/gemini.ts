import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const geminiFlash = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

// Using 2.5-flash for both since 2.5-pro requires a paid API plan
export const geminiPro = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});
