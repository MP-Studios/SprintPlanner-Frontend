'use client'
import { useState } from "react"
import Calendar from "./calendarSprintView"
import DailyAssignments from "./dailyAssignmentView"

export default function AssignmentContainer() {
    const [showAlternativeView, setShowAlternativeView] = useState(false);

    return (
        <div className="assignment p-6 bg-white shadow-lg h-screen flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <button onClick={() => setShowAlternativeView(v => !v)} className="mt-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                    {showAlternativeView ? 'Daily Todo' : 'Sprint View'}
                </button>
            </div>
            <div className="flex-grow mb-4">
                {showAlternativeView ? <Calendar/> : <DailyAssignments/>}
            </div>
        </div>
    );
}