import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';
import { getUserProfile } from "../apiConstant";

export async function GET() {
  try {
    const supabase = await createClient();
    const sessionResponse = await supabase.auth.getSession();
    
    if (sessionResponse.error || !sessionResponse.data.session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = sessionResponse.data.session;

    //const backendUrl = process.env.API_BASE;
    const response = await fetch(getUserProfile, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}