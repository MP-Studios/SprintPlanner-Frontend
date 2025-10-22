import {getStartDates}  from "../apiConstant"
import { NextResponse } from "next/server";
import { Assignment } from "@/app/assignments/assignment";
export async function GET()  {
  console.log("Getting Start Dates for Sprint")
    const response = await fetch(getStartDates);
    if (!response.ok) throw Error("Unable To Get Current Sprint...");
    const data  = await response.json();
    return NextResponse.json(data);
}
   