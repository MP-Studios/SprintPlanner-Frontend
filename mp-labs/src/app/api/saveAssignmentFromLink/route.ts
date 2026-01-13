import { saveAssignmentFromLink } from "../apiConstant"
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
    
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse the request body to get the icsLink
    const { icsLink } = await request.json();
    
    if (!icsLink) {
      return NextResponse.json({ error: 'Missing icsLink' }, { status: 400 });
    }

    // Forward the request to your backend API
    const response = await fetch(saveAssignmentFromLink, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader
      },
      body: JSON.stringify({ icsLink }),
    });

    if (!response.ok) {
      throw new Error("Failed to save assignments from link.");
    }

    // Get the response text/body
    const responseText = await response.text();
    
    // Return the response (matching what your frontend expects)
    return new NextResponse(responseText, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
    
  } catch (error) {
    console.error("Error in saveAssignmentFromLink API route:", error);
    return NextResponse.json(
      { error: 'Failed to save assignments from link' }, 
      { status: 500 }
    );
  }
}