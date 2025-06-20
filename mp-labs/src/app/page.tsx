'use client'

import Calendar from "./calendar";
import AssignmentsPage from "./assignments/assignment";

export default function Dashboard() {
    return (
      <div className="flex h-screen">
        {/* Left: assignments (25% width) */}
        <div className="w-1/4 h-full bg-gray-50 p-6 overflow-auto">
          <AssignmentsPage />
        </div>
  
        {/* Right: calendar (75% width) */}
        <div className="w-3/4 h-full p-6">
          <Calendar />
        </div>
  
      </div>
    );
  }