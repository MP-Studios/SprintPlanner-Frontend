import {getSprintAssignments}  from "../apiConstant"
import { NextResponse } from "next/server";
type Assignment = {
  className: string;
  name: string;
  due_date: string;
  details: string;
};

export async function GET()  {
  console.log("YEAH I mean we started out good")
    const response = await fetch(getSprintAssignments);
    if (!response.ok) throw Error("Unable To Get Current Sprint...");
    
    const data : Assignment[] = await response.json();
    return NextResponse.json(data);
}
   