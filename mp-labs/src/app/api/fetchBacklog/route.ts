import {getBackLog}  from "../apiConstant"
import { NextResponse } from "next/server";
import { Assignment } from "@/app/assignments/assignment";


export async function GET()  {
    const response = await fetch(getBackLog);
    if (!response.ok) throw Error("this failed");
    
    const data : Assignment[] = await response.json();

    return NextResponse.json(data);
  
};