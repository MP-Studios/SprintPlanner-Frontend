'use client';

import { useState, useEffect } from "react";
import Calendar from "./calendarSprintView";
import ICAL from "ical.js";
import { Assignment } from "../assignments/assignment";

type CalendarEvent = {
  summary: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
};

export default function AssignmentContainer() {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

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
        Details: ev.end.toUTCString(),
        ClassId: null,
      };
    });
    
  useEffect(() => {
    if (assignments.length === 0) return;

    async function saveAllAssignments() {
      try {
        await Promise.all(
          assignments.map((assignment) =>
            fetch("/api/fetchSaveAssignment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
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
        // setMessage("Finished saving all assignments!");
        setCalendarEvents(events);
        console.log("Parsed events:", events);
      } catch (err) {
        console.error("Error parsing ICS:", err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="assignment p-6 bg-white shadow-lg h-screen flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <label className="globalButton bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
          Upload calendar
          <input
            type="file"
            accept=".ics"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      <div className="flex-grow mb-4">
        <Calendar />
      </div>

      {calendarEvents.length > 0 && (
        <div className="bg-gray-50 border-t border-gray-200 p-4 rounded overflow-y-auto max-h-64">
          <h3 className="font-semibold mb-2">Parsed Calendar Events:</h3>
          <ul className="list-disc ml-6 text-sm">
            {calendarEvents.map((ev, i) => (
              <li key={i} className="mb-1">
                <strong>{ev.summary}</strong> —{" "}
                {ev.start.toLocaleString()} → {ev.end.toLocaleString()}
                {ev.location && <div>📍 {ev.location}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
