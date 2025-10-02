'use client'
import { useState } from "react"
import Calendar from "./calendarSprintView"
import DailyAssignments from "./dailyAssignmentView"
// import fetchDaily  from "../api/fetchDaily/route"
// import type Assignment  from "../api/fetchDaily/route"

type Assignment = {
  className: string;
  name: string;
  dueDate: string;
  taskDetails: string;
};


export default function AssignmentContainer() {
  const [showAlternativeView, setShowAlternativeView] = useState(false);
  const [dailyData, setDailyData] = useState<Assignment[]>([]);
  const [sprintData, setSprintData] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   async function loadData() {
  //     setLoading(true);
  //     if (showAlternativeView) {
  //       const sprint = await fetch("/api/fetchSprint/");
  //      if (!sprint.ok) throw new Error("Failed to fetch backlog");

  //       const data: Assignment[] = await sprint.json(); // <-- extract JSON
  //       setSprintData(data);
  //     } else {
  //       const daily = await fetch("/api/fetchDaily/");
  //       if(!daily.ok) throw new Error("Failed to fetch your daily assignments");
  //       const data: Assignment[] = await daily.json();
  //         setDailyData(data); 
        
       
  //     }
  //     setLoading(false);
  //   }

  //   loadData();
  // }, [showAlternativeView]);


    return (
        <div className="assignment p-6 bg-white shadow-lg h-screen flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <button onClick={() => setShowAlternativeView(v => !v)} className="globalButton mt-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                    {showAlternativeView ? 'Daily Todo' : 'Sprint View'}
                </button>
            </div>
            <div className="flex-grow mb-4">
                {showAlternativeView ? <Calendar/> : <DailyAssignments/>}
            </div>
        </div>
    );
}