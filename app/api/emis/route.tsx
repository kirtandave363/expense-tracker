import { AuthenticatedRequest, withAuth } from "@/lib/apiMiddleware";
import connectDB from "@/lib/mongodb";
import EMI from "@/models/EMI";
import { NextResponse } from "next/server";

async function createEMIHandler(request: AuthenticatedRequest) {
  try {
    await connectDB();

    const { title, amount, startDate, endDate, dayOfMonth } =
      await request.json();

    // Validate required fields
    if (!title || !amount || !startDate || !endDate || !dayOfMonth) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate amount
    if (isNaN(amount) || amount < 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    // Validate dayOfMonth
    if (dayOfMonth < 1 || dayOfMonth > 31) {
      return NextResponse.json(
        { error: "Day of month must be between 1 and 31" },
        { status: 400 }
      );
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      return NextResponse.json(
        { error: "End date must be after start date" },
        { status: 400 }
      );
    }

    // Create EMI
    const emi = await EMI.create({
      userId: request.userId,
      title,
      amount: Number(amount),
      startDate: start,
      endDate: end,
      dayOfMonth: Number(dayOfMonth),
      isActive: true,
    });

    return NextResponse.json(
      {
        message: "EMI created successfully",
        emi: {
          id: emi._id,
          title: emi.title,
          amount: emi.amount,
          startDate: emi.startDate,
          endDate: emi.endDate,
          dayOfMonth: emi.dayOfMonth,
          isActive: emi.isActive,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create EMI error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getEMIsHandler(request: AuthenticatedRequest) {
  try {
    await connectDB();

    // Build query
    const query: any = { userId: request.userId };

    // Fetch EMIs
    const emis = await EMI.find(query).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        emis: emis.map((emi) => ({
          id: emi._id,
          title: emi.title,
          amount: emi.amount,
          startDate: emi.startDate,
          endDate: emi.endDate,
          dayOfMonth: emi.dayOfMonth,
          isActive: emi.isActive,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get EMIs error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const POST = withAuth(createEMIHandler);
export const GET = withAuth(getEMIsHandler);
