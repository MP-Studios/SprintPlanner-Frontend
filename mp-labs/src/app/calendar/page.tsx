'use client'
import { useState, useEffect  } from "react"
import Calendar from "./calendarSprintView"
import DailyAssignments from "./dailyAssignmentView"
import fetchDaily  from "../fetchLogic/fetchDaily"
import FetchCurrentSprint from "../fetchLogic/fetchSprint"
import type Assignment  from "../fetchLogic/fetchDaily"

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

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      if (showAlternativeView) {
        const sprint = await FetchCurrentSprint();
        setSprintData(sprint);
      } else {
        const daily = await fetchDaily();
        setDailyData(daily);
      }
      setLoading(false);
    }

    loadData();
  }, [showAlternativeView]);


    return (
        <div className="assignment p-6 shadow-lg h-screen flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <button onClick={() => setShowAlternativeView(v => !v)} className="mt-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                    {showAlternativeView ? 'Daily Todo' : 'Sprint View'}
                </button>
            </div>
            <div className="flex-grow mb-4">
                {showAlternativeView ? <Calendar data={sprintData}/> : <DailyAssignments data={dailyData}/>}
            </div>
        </div>
    );
}