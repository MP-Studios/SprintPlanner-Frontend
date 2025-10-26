import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { assignmentId, status } = body;

    if (!assignmentId || status === undefined) {
      return NextResponse.json({ error: 'Missing assignmentId or status' }, { status: 400 });
    }

    const backendUrl = process.env.API_BASE;
    
    const res = await fetch(`${backendUrl}/api/assignments/update-status`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ assignmentId, status })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Java backend error:', errorText);
      return NextResponse.json({ error: 'Failed to update status' }, { status: res.status });
    }

    const result = await res.json();
    return NextResponse.json({ success: result });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}