export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
// Do not write to disk on serverless platforms (Vercel). We'll return base64 directly.

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { item, type } = body;

    if (!item || !type) {
      return NextResponse.json(
        { error: "item and type are required" },
        { status: 400 }
      );
    }

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    // Create a detailed prompt for image generation
    const prompt = type === "exercise"
      ? `Generate a high-quality, professional photograph of a fit person demonstrating the proper form for ${item} exercise in a modern gym. Good lighting, clear demonstration of technique, fitness photography style, 4K quality, detailed.`
      : `Generate a professional, appetizing food photography shot of ${item}, beautifully plated on a clean white dish, natural lighting, restaurant quality, high resolution, detailed, vibrant colors.`;

    // Use Gemini 2.0 Flash with image generation capability
    const model = 'gemini-2.0-flash-exp';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: "user",
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"]
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini image generation error: ${response.status} - ${errorText}`);
      return NextResponse.json(
        { error: `Gemini API error: ${response.status}` },
        { status: response.status }
      );
    }

    // Parse the JSON response
    const result = await response.json();

    // Extract image data from response
    const candidates = result.candidates;
    if (!candidates || !candidates[0] || !candidates[0].content || !candidates[0].content.parts) {
      return NextResponse.json(
        { error: "No image data in response" },
        { status: 500 }
      );
    }

    const parts = candidates[0].content.parts;
    let imageUrl = null;

    // Look for inline image data. Instead of saving to disk (not allowed on Vercel serverless),
    // return the base64 payload to the client so it can preview the image directly.
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        const base64 = part.inlineData.data;
        const mime = part.inlineData.mimeType || 'image/png';

        return NextResponse.json({
          success: true,
          image_base64: base64,
          mime_type: mime,
        });
      }
    }

    return NextResponse.json(
      { error: "No image generated" },
      { status: 500 }
    );
  } catch (err: any) {
    console.error("Error in /api/generate-image-for-item:", err);
    return NextResponse.json(
      { error: `Internal server error: ${err.message || err}` },
      { status: 500 }
    );
  }
}
