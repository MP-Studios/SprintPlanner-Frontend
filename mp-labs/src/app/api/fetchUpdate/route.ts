// src/app/api/fetchUpdate/[id]/route.ts

import { NextResponse } from "next/server";
import { editAssignment } from "../apiConstant"; 

// I don't like this but I don't wanna fix it
export type AssignmentForUpdate = {
  Id: string;
  Name: string;
  className: string;
  DueDate: string;
  Details: string;
  ClassId?: string | null;
};


export async function PUT(request: Request) {
  const Header = request.headers.get('Authorization');

  console.log("We are reaching the route!");
  if (!Header) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const form: AssignmentForUpdate = await request.json();
  console.log(editAssignment);
  const response = await fetch(editAssignment, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json" ,
        "Authorization": Header
      }, 
      body: JSON.stringify(form),
    });
  const result = await response.json();

  if (!response.ok || result !== true) {
    console.error("Assignment update failed:", result);
    const message =
      (typeof result === "object" && (result as any)?.error) ||
      "Failed to update your assignment.";
    return NextResponse.json({ error: message }, { status: 500 });
  }

return NextResponse.json({ success: true });

}