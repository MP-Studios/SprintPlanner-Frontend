import {getDailyAssignments}  from "../apiConstant"
import { NextResponse } from "next/server";
type Assignment = {
  // className: string;
  name: string;
  due_date: string;
  details: string;
};


export async function GET()  {
    const response = await fetch(getDailyAssignments);
    if (!response.ok) throw Error("Failed to Retreive Daily Assignments.");
    
    const data : Assignment[] = await response.json();
    return NextResponse.json(data);
};