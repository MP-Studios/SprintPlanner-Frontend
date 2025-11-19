import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse JSON body
    const newUsername = body.newUsername;

    if (!newUsername || newUsername.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Missing new username" },
        { status: 400 }
      );
    }

    const authToken = req.headers.get('Authorization');
    if (!authToken) {
      return NextResponse.json(
        { success: false, message: "Missing auth token" },
        { status: 401 }
      );
    }

    // Call your Spring backend
    const response = await fetch(`${process.env.API_BASE}/api/user/update-username`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authToken,
      },
      body: JSON.stringify({ newUsername }), // <-- must match Spring payload
    });

    const text = await response.text(); // backend might return plain text
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text }; // fallback if plain text
    }

    return NextResponse.json(
      { success: response.ok, message: data?.message || data?.error || text },
      { status: response.status }
    );
  } catch (error) {
    console.error("Error updating username:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
