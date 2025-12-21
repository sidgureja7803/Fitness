export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { ELEVENLABS_CONFIG } from "@/lib/gemini-config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json(
        { error: "text is required" },
        { status: 400 }
      );
    }

    // Call ElevenLabs TTS API for reliable audio
    const response = await fetch(
      `${ELEVENLABS_CONFIG.baseUrl}/text-to-speech/${ELEVENLABS_CONFIG.voiceId}`,
      {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": ELEVENLABS_CONFIG.apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("ElevenLabs TTS API error:", errorData);
      return NextResponse.json(
        { error: "Failed to generate audio from ElevenLabs TTS API" },
        { status: response.status }
      );
    }

    // Convert audio buffer to base64
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    return NextResponse.json({
      success: true,
      audio_base64: base64Audio,
      mime_type: "audio/mpeg",
    });
  } catch (err: any) {
    console.error("Error in /api/read-plan-section:", err);
    return NextResponse.json(
      { error: `Internal server error: ${err.message || err}` },
      { status: 500 }
    );
  }
}
