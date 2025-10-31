import {saveAssignments}  from "../apiConstant"
import { NextResponse } from "next/server";

import { Assignment } from "@/app/assignments/assignment";

export  async function POST(request: Request)  {

  const authHeader = request.headers.get('Authorization');
    
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

    const form: Assignment = await request.json(); 
    const backendUrl = process.env.API_BASE;

    const response = await fetch(`${backendUrl}/api/supabase/saveAssignment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader
      },
      body: JSON.stringify(form),
    });

    if (!response.ok) throw Error("Failed to save your assignment.");
    console.debug(response.body);
    const success = await response.json();
    return NextResponse.json({success});
    
};


