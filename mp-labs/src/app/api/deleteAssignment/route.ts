import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { assignmentId } = body;

    if (!assignmentId) {
      return NextResponse.json({ error: 'Missing assignmentId' }, { status: 400 });
    }

    const backendUrl = process.env.API_BASE;
    
    const res = await fetch(`${backendUrl}/api/assignments/deleteAssignment`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ assignmentId })
    });

    const text = await res.text();

    if (!res.ok) {
      console.error("Java backend error:", text);
      return NextResponse.json(
        { error: "Java backend error", details: text },
        { status: res.status }
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { message: text };
    }

    return NextResponse.json({ success: true, backendResponse: parsed });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}