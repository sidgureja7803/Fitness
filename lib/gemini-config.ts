// Gemini API Configuration
const API_KEY = process.env.GEMINI_API_KEY || "";

const ENDPOINTS = {
  generateContent: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent",
  generateTTS: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent",
} as const;

export const GEMINI_CONFIG = {
  apiKey: API_KEY,
  endpoints: ENDPOINTS,
  getUrl: (endpoint: keyof typeof ENDPOINTS) => {
    return `${ENDPOINTS[endpoint]}?key=${API_KEY}`;
  },
};

// ElevenLabs Configuration for reliable TTS
export const ELEVENLABS_CONFIG = {
  apiKey: process.env.ELEVENLABS_API_KEY || "",
  voiceId: process.env.ELEVENLABS_VOICE_ID || "pNInz6obpgDQGcFmaJgB",
  baseUrl: "https://api.elevenlabs.io/v1",
};
