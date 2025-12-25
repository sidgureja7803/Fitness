// lib/gemini-config.ts

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("❌ GEMINI_API_KEY is missing in .env.local");
}

export const GEMINI_CONFIG = {
  apiKey: API_KEY,

  generateContentUrl:
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",

  headers: {
    "Content-Type": "application/json",
  },
};
