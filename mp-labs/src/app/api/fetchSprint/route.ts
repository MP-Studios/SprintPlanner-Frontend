import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Get the Authorization header from the incoming request
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Forward the request to your Java backend
    const backendUrl = process.env.API_BASE;
    const response = await fetch(`${backendUrl}/api/assignments`, {
      headers: {
        'Authorization': authHeader // Forward the auth header
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Java backend error:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch from backend' }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}