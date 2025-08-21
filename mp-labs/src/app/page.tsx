'use client'

import Calendar from "./calendar/calendar";
import AssignmentContainer from "./assignments/assignmentsPage";

export default function Dashboard() {
  return (
    <div className="flex h-screen">
      {/* Left: assignments (35% width) */}
      <div className="w-[35%] mx-auto h-full bg-[var(--surface)] p-6 overflow-auto border-r border-[var(--border)]">
        <AssignmentContainer />
      </div>

      {/* Right: calendar (65% width) */}
      <div className="w-[65%] mx-auto h-full p-6 bg-[var(--background)]">
        <Calendar />
      </div>
    </div>
  );
}