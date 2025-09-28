import {getBackLog}  from "../auth/confirm/apiConstant"
type Assignment = {
  className: string;
  name: string;
  dueDate: string;
  taskDetails: string;
};

export default async function fetchDaily()  {
    const response = await fetch(getBackLog);
    if (!response.ok) throw Error("Failed to Retreive All Assignments.");
    
    const data : Assignment[] = await response.json();
    return data;
};