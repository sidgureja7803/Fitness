export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key missing" },
        { status: 500 }
      );
    }

    const { item, type } = await req.json();

    if (!item || !type) {
      return NextResponse.json(
        { error: "item and type are required" },
        { status: 400 }
      );
    }

    const prompt =
      type === "exercise"
        ? `
Generate a highly detailed image description for a fitness exercise.

Exercise: ${item}

Describe:
- Body posture
- Muscle engagement
- Gym environment
- Camera angle
- Lighting
- Professional fitness photography style

Return ONLY a single-paragraph description.
`
        : `
Generate a highly detailed food photography description.

Food item: ${item}

Describe:
- Plating style
- Ingredients visibility
- Lighting
- Camera angle
- Restaurant-quality presentation

Return ONLY a single-paragraph description.
`;

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const description = response.text;

    if (!description) {
      return NextResponse.json(
        { error: "No description generated" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      image_prompt: description,
      item,
      type,
    });
  } catch (error: any) {
    console.error("Generate image prompt error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
