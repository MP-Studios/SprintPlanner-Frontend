'use client';
import { useState, useEffect } from "react";

export default function DailyCalendar() {
    const [time, setTime] = useState(new Date());

    return(
        
         <div>
         <div className="day-text-formate text-sm font-semibold text-gray-600">TODAY</div>
        <div className="date-time-value text-lg font-semibold">
          <div className="time-formate">
            {time.toLocaleTimeString()}
          </div>
          <div className="date-formate">
            {time.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "long",
            })}
          </div>
        </div>
        </div>

    );
}