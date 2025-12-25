export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // ✅ Validate ObjectId safely
    if (!ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid userId format" },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    const plans = await db
      .collection("plans")
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray();

    // ✅ No crash, return empty list instead
    if (!plans || plans.length === 0) {
      return NextResponse.json({
        success: true,
        latest_plan: null,
        plans: [],
        total_plans: 0,
      });
    }

    return NextResponse.json({
      success: true,
      latest_plan: plans[0].plan,
      plans: plans.map((p) => p.plan),
      total_plans: plans.length,
    });
  } catch (err: any) {
    console.error("Error in /api/get-plan:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
