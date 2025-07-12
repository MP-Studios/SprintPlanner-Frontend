'use client'

import Calendar from "./calendar/calendar";
import AssignmentContainer from "./assignments/assignmentsPage";
// import { createClient } from '@supabase/supabase-js'

// // Create a single supabase client for interacting with your database
// const supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key')

export default function Dashboard() {
    return (
      <div className="flex h-screen">
        {/* Left: assignments (25% width) */}
        <div className="w-[35%] mx-auto h-full bg-gray-50 p-6 overflow-auto">
          <AssignmentContainer/>
        </div>
  
        {/* Right: calendar (75% width) */}
        <div className="w-[65%] mx-auto h-full p-6">
          <Calendar />
        </div>
  
      </div>
    );
  }