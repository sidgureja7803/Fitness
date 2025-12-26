import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

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

    // Validate userId if provided
    if (body.userId && !ObjectId.isValid(body.userId)) {
      return NextResponse.json(
        { error: "Invalid userId format" },
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

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    console.log("🔍 GEMINI RAW RESPONSE:", JSON.stringify(response, null, 2));

    const text = response.text;

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

    // Save plan to MongoDB if userId is provided
    if (body.userId) {
      const db = await getDatabase();
      await db.collection("plans").insertOne({
        userId: new ObjectId(body.userId),
        plan,
        createdAt: new Date(),
      });
      console.log("✅ Plan saved to MongoDB for userId:", body.userId);
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
