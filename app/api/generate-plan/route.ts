export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { GEMINI_CONFIG } from "@/lib/gemini-config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Fetch user data from MongoDB
    const db = await getDatabase();
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Create prompt for Gemini
    const prompt = `Generate a personalized 7-day fitness and nutrition plan for:
- Name: ${user.name}
- Age: ${user.age}
- Gender: ${user.gender}
- Height: ${user.height} cm
- Weight: ${user.weight} kg
- Fitness Goal: ${user.fitnessGoal}
- Fitness Level: ${user.fitnessLevel}
- Workout Location: ${user.workoutLocation}
- Dietary Preference: ${user.dietaryPreference}
${user.medicalHistory ? `- Medical History: ${user.medicalHistory}` : ''}

Provide the response in the following JSON format:
{
  "workout_plan": [
    {
      "day": "Day 1",
      "focus": "Chest and Triceps",
      "duration": "45 min",
      "exercises": [
        {
          "name": "Push-ups",
          "sets": "3 sets x 12 reps",
          "rest": "60s rest"
        }
      ]
    }
  ],
  "diet_plan": [
    {
      "day": "Day 1",
      "meals": [
        {
          "meal": "Breakfast",
          "menu": "Oatmeal with berries and nuts",
          "calories": "350 kcal"
        }
      ]
    }
  ]
}

Generate a complete 7-day plan with appropriate exercises and meals.`;

    // Call Gemini API
    const response = await fetch(GEMINI_CONFIG.getUrl("generateContent"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API error:", errorData);
      return NextResponse.json(
        { error: "Failed to generate plan from Gemini API" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Extract JSON from response
    let plan;
    try {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = generatedText.match(/```json\s*([\s\S]*?)\s*```/) || 
                       generatedText.match(/```\s*([\s\S]*?)\s*```/);
      
      if (jsonMatch) {
        plan = JSON.parse(jsonMatch[1]);
      } else {
        plan = JSON.parse(generatedText);
      }
    } catch (parseError) {
      console.error("Failed to parse plan:", parseError);
      return NextResponse.json(
        { error: "Failed to parse generated plan", rawResponse: generatedText },
        { status: 500 }
      );
    }

    // Save plan to database
    const planDoc = {
      userId: new ObjectId(userId),
      plan: plan,
      createdAt: new Date(),
    };

    await db.collection("plans").insertOne(planDoc);

    return NextResponse.json({
      success: true,
      plan: plan,
    });
  } catch (err: any) {
    console.error("Error in /api/generate-plan:", err);
    return NextResponse.json(
      { error: `Internal server error: ${err.message || err}` },
      { status: 500 }
    );
  }
}
