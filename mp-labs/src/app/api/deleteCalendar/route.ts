import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const authToken = req.headers.get('Authorization');
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: "Missing auth token" },
        { status: 401 }
      );
    }

    const backendUrl = process.env.API_BASE;

    const response = await fetch(`${backendUrl}/api/calendar/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authToken,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data || "Failed to delete calendar" },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: data }, { status: 200 });
  } catch (error) {
    console.error("Error deleting calendar:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}