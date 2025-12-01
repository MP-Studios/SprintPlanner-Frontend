'use client'

import CalendarView from "./calendar/page";
import AssignmentContainer from "./assignments/assignmentsPage";
import { useLoading } from "./context/LoadingContext";
import { useEffect } from "react";

export default function Dashboard() {
    const { showLoading, hideLoading } = useLoading()

    useEffect(() => {
        showLoading('Loading your dashboard...');
        const timer = setTimeout(() => {
            hideLoading();
        }, 1500);
        
        return () => clearTimeout(timer);
    }, []);
    
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