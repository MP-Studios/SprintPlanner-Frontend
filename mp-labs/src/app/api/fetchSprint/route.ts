import {getSprintAssignments}  from "../apiConstant"
import { NextResponse } from "next/server";
import { Assignment } from "@/app/assignments/assignment";
export async function GET()  {
  console.log("YEAH I mean we started out good")
    const response = await fetch(getSprintAssignments);
    if (!response.ok) throw Error("Unable To Get Current Sprint...");
    
    const data : Assignment[] = await response.json();
    const normalized = data.map(a => ({
      ...a,
      DueDate: new Date(a.DueDate).toISOString(),
    }))
    return NextResponse.json(normalized);
}
   