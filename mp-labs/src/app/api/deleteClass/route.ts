import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId");

    if (!classId) {
      return NextResponse.json({ error: "Missing classId" }, { status: 400 });
    }

    const backendUrl = process.env.API_BASE;

    const response = await fetch(`${backendUrl}/api/class/${classId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        { error: data || "Failed to delete class" },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: data }, { status: 200 });
  } catch (error) {
    console.error("Error deleting class:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}