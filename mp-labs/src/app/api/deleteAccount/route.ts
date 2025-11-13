import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const authToken = req.headers.get('Authorization');
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: "Missing auth token" },
        { status: 401 }
      );
    }

    // Call your Spring backend to delete account
    const response = await fetch(`${process.env.API_BASE}/api/user/delete-account`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authToken,
      },
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data?.error || data?.message || "Failed to delete account" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Account deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}