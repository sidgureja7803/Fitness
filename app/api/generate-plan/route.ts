import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic validation
    if (!body.age || !body.gender || !body.weight || !body.fitnessGoal) {
      return NextResponse.json(
        { error: "Missing required user fields" },
        { status: 400 }
      );
    }

    const prompt = `
You are a professional fitness coach and nutritionist.

Create a VERY DETAILED 7-day workout plan AND diet plan.

User details:
Age: ${body.age}
Gender: ${body.gender}
Height: ${body.height} cm
Weight: ${body.weight} kg
Fitness goal: ${body.fitnessGoal}
Fitness level: ${body.fitnessLevel}
Workout location: ${body.workoutLocation}
Diet preference: ${body.dietaryPreference}

STRICT RULES:
- Return ONLY valid JSON
- No markdown
- No backticks
- No explanations
- No extra text

JSON FORMAT:
{
  "workout_plan": [
    {
      "day": "Monday",
      "focus": "Chest & Triceps",
      "duration": "45 minutes",
      "exercises": [
        { "name": "Push Ups", "sets": "4x15", "rest": "60 sec" }
      ]
    }
  ],
  "diet_plan": [
    {
      "day": "Monday",
      "meals": [
        {
          "meal": "Breakfast",
          "menu": "Oats with fruits",
          "calories": "400 kcal"
        }
      ]
    }
  ]
}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    const data = await response.json();

    console.log("🔍 GEMINI RAW RESPONSE:", JSON.stringify(data, null, 2));

    if (data.error) {
      return NextResponse.json(
        { error: data.error.message },
        { status: 500 }
      );
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return NextResponse.json(
        { error: "Gemini returned empty response" },
        { status: 500 }
      );
    }

    let plan;
    try {
      plan = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: "Gemini response was not valid JSON" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      plan,
    });
  } catch (err: any) {
    console.error("❌ GENERATE PLAN ERROR:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
