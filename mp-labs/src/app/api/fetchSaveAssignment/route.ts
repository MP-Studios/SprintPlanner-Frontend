import {saveAssignments}  from "../apiConstant"
import { NextResponse } from "next/server";
type Assignment = {
  className: string;
  Name: string;
  DueDate: string;
  Details: string;
 taskCompleted: boolean;
};


export async function POST(request: Request)  {
  console.log("OKAY WE ARE TRYING TO SAVE SOMETHING");

    const form: Assignment = await request.json(); 
    console.log(form);
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


