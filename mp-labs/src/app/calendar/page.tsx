'use client';

import { useState, useEffect } from "react";
import Calendar from "./calendarSprintView";
import ICAL from "ical.js";
import { Assignment } from "../assignments/assignment";
import loadata from "../auth/loadData";

type CalendarEvent = {
  summary: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
};

export default function AssignmentContainer() {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const assignments: Assignment[] = calendarEvents
    .filter(ev => new Date(ev.end) > new Date())
    .map(ev => {
      const match = ev.summary.match(/^(.*?)(\s*\[.*\])$/);
      const name = match ? match[1].trim() : ev.summary;
      const className = match ? match[2].trim() : ev.summary;

      return {
        className,
        Name: name,
        DueDate: ev.end.toUTCString(),
        Details: "",
        ClassId: null,
      };
    });

  useEffect(() => {
    if (assignments.length === 0) return;

    async function saveAllAssignments() {
      try {
        const userId = await loadata();
        await Promise.all(
          assignments.map((assignment) =>
            fetch("/api/fetchSaveAssignment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${userId}`
              },
              body: JSON.stringify(assignment),
            })
          )
        );
        console.log("All assignments saved successfully!");
      } catch (error) {
        console.error("Error saving assignments:", error);
      }
    }

    saveAllAssignments();
  }, [assignments]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const jcalData = ICAL.parse(text);
        const comp = new ICAL.Component(jcalData);
        const events = comp.getAllSubcomponents("vevent").map((vevent) => {
          const e = new ICAL.Event(vevent);
          return {
            summary: e.summary,
            start: e.startDate.toJSDate(),
            end: e.endDate.toJSDate(),
            location: e.location,
            description: e.description,
          };
        });
        setCalendarEvents(events);
        console.log("Parsed events:", events);
      } catch (err) {
        console.error("Error parsing ICS:", err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="assignment p-6 bg-white shadow-lg flex flex-col relative">
      {/* Upload calendar */}
      <div className="flex items-center justify-between mb-4">
        <label className="globalButton px-4 py-2 rounded cursor-pointer">
          Upload calendar
          <input
            type="file"
            accept=".ics"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Calendar */}
      <div className="flex-grow mb-20">
        <Calendar weekOffset={weekOffset} setWeekOffset={setWeekOffset} />
      </div>

      {/* Week Navigation - Separate Section
      <div className="fixed bottom-4 left-8 right-auto">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => setWeekOffset(weekOffset - 1)}
            className="prev-week-details flex items-center justify-center p-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 268.832 268.832" className="w-6 h-6">
              <path d="M265.17 125.577l-80-80c-4.88-4.88-12.796-4.88-17.677 0-4.882 4.882-4.882 12.796 0 17.678l58.66 58.66H12.5c-6.903 0-12.5 5.598-12.5 12.5 0 6.903 5.597 12.5 12.5 12.5h213.654l-58.66 58.662c-4.88 4.882-4.88 12.796 0 17.678 2.44 2.44 5.64 3.66 8.84 3.66s6.398-1.22 8.84-3.66l79.997-80c4.883-4.882 4.883-12.796 0-17.678z"/>
            </svg>
          </button>

          <button 
            onClick={() => setWeekOffset(weekOffset + 1)}
            className="next-week-details flex items-center justify-center space-x-2 p-3"
          >
            <span className="next-week-text">Next week</span>
            <div className="next-week-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 268.832 268.832" className="w-6 h-6">
                <path d="M265.17 125.577l-80-80c-4.88-4.88-12.796-4.88-17.677 0-4.882 4.882-4.882 12.796 0 17.678l58.66 58.66H12.5c-6.903 0-12.5 5.598-12.5 12.5 0 6.903 5.597 12.5 12.5 12.5h213.654l-58.66 58.662c-4.88 4.882-4.88 12.796 0 17.678 2.44 2.44 5.64 3.66 8.84 3.66s6.398-1.22 8.84-3.66l79.997-80c4.883-4.882 4.883-12.796 0-17.678z"/>
              </svg>
            </div>
          </button>
        </div>
      </div> */}
    </div>
  );
}
