'use client'

import CalendarView from "./calendar/page";
import AssignmentContainer from "./assignments/assignmentsPage";
import { useLoading } from "./context/LoadingContext";
import { useEffect, useRef } from "react";
import { useClasses } from "./context/ClassContext";
import { useAssignments } from "./context/AssignmentContext";

export default function Dashboard() {
  const { showLoading, hideLoading, isLoading } = useLoading();
  const { isLoading: isClassesLoading } = useClasses();
  const { loading: isAssignmentsLoading } = useAssignments();
  const dashboardControlsOverlay = useRef(false);

  useEffect(() => {
    const isDashboardLoading = isClassesLoading || isAssignmentsLoading;
    if (isDashboardLoading) {
      if (!isLoading) {
        showLoading('Loading your dashboard...');
        dashboardControlsOverlay.current = true;
      }
    } else {
      if (dashboardControlsOverlay.current && isLoading) {
        hideLoading();
        dashboardControlsOverlay.current = false;
      }
    }
  }, [isClassesLoading, isAssignmentsLoading, showLoading, hideLoading]);
    
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