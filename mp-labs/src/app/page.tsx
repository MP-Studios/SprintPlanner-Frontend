'use client'

import CalendarView from "./calendar/page";
import AssignmentContainer from "./assignments/assignmentsPage";

export default function Dashboard() {
    return (
      <div className="flex h-screen bg-white-50">
        {/* Left: assignments (25% width) */}
        <div className="w-[35%] mx-auto h-full bg-white-50 p-6 overflow-auto">
          <AssignmentContainer/>
        </div>
  
        {/* Right: calendar (75% width) */}
        <div className="w-[65%] mx-auto bg-white-50 h-full p-6">
          <CalendarView />
        </div>
  
      </div>
    );
  }