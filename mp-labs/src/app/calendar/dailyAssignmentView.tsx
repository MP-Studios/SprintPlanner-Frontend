'use client';
import { useState, useEffect } from "react";
type Assignment = {
  className: string;
  name: string;
  dueDate: string;
  taskDetails: string;
};


export default function DailyCalendar() {
    const [time, setTime] = useState(new Date());
    const [error, setError] = useState<string | null>(null);
    const [data, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    fetchDaily();
  }, []);


  const fetchDaily = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/assignments/daily');
      if (!res.ok) throw new Error('Build out the API call monkey');
      const data = await res.json();
      setAssignments(data);
    } catch (err) {
      console.error(err);
      setError('time to build that API you goober');
    }
  };
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
            <h1>Your Assignments Due today are: </h1>
            <div className="overflow-auto flex-1">
        {(data.length!=0) ? (<p style={{ color: 'red' }}>{"You don't have any assignments due today"}</p>) : (
          data.map((a, i) => (
            <p key={i} className="mb-2">
              <strong>{a.className}</strong>: {a.name}{' '}
              <span className="text-gray-500">(Due: {a.dueDate})</span>
            </p>
          ))
        )}
      </div>
          </div>
        </div>
        </div>

    );
}