import {getBackLog}  from "../apiConstant"
import { NextResponse } from "next/server";
type Assignment = {
  className: string;
  name: string;
  due_date: string;
  details: string;
};


export async function GET()  {
    const response = await fetch(getBackLog);
    if (!response.ok) throw Error("this failed");
    
    const data : Assignment[] = await response.json();

    return NextResponse.json(data);
  
};