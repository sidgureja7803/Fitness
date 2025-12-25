export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // ✅ MongoDB safe

import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    // ✅ Validate Content-Type
    const contentType = req.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 400 }
      );
    }

    // ✅ Parse JSON safely
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    // ✅ Required fields
    const requiredFields = [
      "name",
      "age",
      "gender",
      "height",
      "weight",
      "fitnessGoal",
      "fitnessLevel",
      "workoutLocation",
      "dietaryPreference",
    ];

    const missing = requiredFields.filter(
      (k) => body[k] === undefined || body[k] === null || body[k] === ""
    );

    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    // ✅ Numeric validation
    const age = Number(body.age);
    const height = Number(body.height);
    const weight = Number(body.weight);

    if ([age, height, weight].some((n) => Number.isNaN(n))) {
      return NextResponse.json(
        { error: "age, height, and weight must be valid numbers" },
        { status: 400 }
      );
    }

    // ✅ Sanitized user document
    const userDoc = {
      name: String(body.name).trim(),
      age,
      gender: String(body.gender),
      height,
      weight,
      fitnessGoal: String(body.fitnessGoal),
      fitnessLevel: String(body.fitnessLevel),
      workoutLocation: String(body.workoutLocation),
      dietaryPreference: String(body.dietaryPreference),
      medicalHistory: body.medicalHistory
        ? String(body.medicalHistory).trim()
        : null,
      createdAt: new Date(),
    };

    // ✅ MongoDB insert
    const db = await getDatabase();
    const result = await db.collection("users").insertOne(userDoc);
return NextResponse.json({
  success: true,
  userId: result.insertedId.toString(),
});

  } catch (err: any) {
    console.error("Error in /api/save-user:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
