'use client'

import CalendarView from "./calendar/page";
import AssignmentContainer from "./assignments/assignmentsPage";

export default function Dashboard() {
    return (
      <div className="flex h-full">
        {/* Left: assignments (35% width) */}
        <div className="w-[35%] h-full overflow-auto">
          <AssignmentContainer/>
        </div>
  
        {/* Right: calendar (65% width) */}
        <div className="w-[65%] h-full">
          <CalendarView />
        </div>
  
      </div>
    );
  }