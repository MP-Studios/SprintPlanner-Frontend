// src/app/api/fetchUpdate/[id]/route.ts

import { NextResponse } from "next/server";
import { editAssignment } from "../apiConstant"; 
import { Assignment } from "@/app/assignments/assignment";

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

  if (!response.ok || result?.success?.status >= 400) {
    console.error("Assignment update failed:", result);
    throw new Error(
      result?.success?.error || "Failed to update your assignment."
    );
  }

return NextResponse.json({ success: result.success });

}