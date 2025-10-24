// src/app/api/fetchUpdate/[id]/route.ts

import { NextResponse } from "next/server";
import { updateAssignment } from "../apiConstant"; 

type UpdateAssignmentRequest = {
  className: string;
  name: string;
  dueDate: string;
  details: string;
};

export async function PUT(request: Request) {
  try {
    const body: UpdateAssignmentRequest = await request.json();
    const assignmentId =request.headers.get('Id');

    const response = await fetch(updateAssignment + "/" + assignmentId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        className: body.className,
        name: body.name,
        dueDate: body.dueDate,
        details: body.details,
      }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to update assignment", details: responseText },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Assignment updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to update assignment",
        details:
          error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}