import {saveAssignments}  from "../apiConstant"
import { NextResponse } from "next/server";
type Assignment = {
  className: string;
  name: string;
  due_date: string;
  details: string;
};


export  async function POST(request: Request)  {
    const form: Assignment = await request.json(); 

    const response = await fetch(saveAssignments, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (!response.ok) throw Error("Failed to save your assignment.");
    
    const success = await response.json();
    return NextResponse.json({success});
    
};


