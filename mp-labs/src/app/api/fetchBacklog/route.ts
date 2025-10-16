import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get the Authorization header from the incoming request
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Forward the request to your Java backend
    const res = await fetch('http://localhost:8080/api/assignments/backlog', {
      headers: {
        'Authorization': authHeader  // Forward the auth header
      }
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Java backend error:', errorText);
      return NextResponse.json({ error: 'Failed to fetch from backend' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}