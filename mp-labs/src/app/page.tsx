'use client'

import CalendarView from "./calendar/page";
import AssignmentContainer from "./assignments/assignmentsPage";

export default function Dashboard() {
    return (
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left: assignments (25% width) */}
        <div className="w-[35%] mx-auto h-[calc(100vh-64px) bg-gray-50 p-6 overflow-auto">
          <AssignmentContainer/>
        </div>
  
        {/* Right: calendar (75% width) */}
        <div className="w-[65%] mx-auto h-[calc(100vh-64px) p-6">
          <CalendarView />
        </div>
  
      </div>
    );
  }