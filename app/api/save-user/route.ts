export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    // Validate Content-Type
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type must be application/json" },
        { status: 400 }
      );
    }

    // Parse JSON body
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    // Check required fields
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

    // Sanitize and structure data
    const userDoc = {
      name: String(body.name).trim(),
      age: Number(body.age),
      gender: String(body.gender),
      height: Number(body.height),
      weight: Number(body.weight),
      fitnessGoal: String(body.fitnessGoal),
      fitnessLevel: String(body.fitnessLevel),
      workoutLocation: String(body.workoutLocation),
      dietaryPreference: String(body.dietaryPreference),
      medicalHistory: body.medicalHistory
        ? String(body.medicalHistory).trim()
        : null,
      createdAt: new Date(),
    };

    // Connect and insert into MongoDB
    const db = await getDatabase();
    const result = await db.collection("users").insertOne(userDoc);

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId.toString(),
      userId: result.insertedId.toString(), // Add this for backwards compatibility
    });
  } catch (err: any) {
    console.error("Error in /api/save-user:", err);
    const isProd = process.env.NODE_ENV === "production";
    return NextResponse.json(
      {
        error: isProd
          ? "Internal server error"
          : `Internal server error: ${err.message || err}`,
      },
      { status: 500 }
    );
  }
}
