'use client';

import { useState, useEffect, useRef } from "react";
import Calendar from "./calendarSprintView";
import ICAL from "ical.js";
import { Assignment } from "../assignments/assignment";
import loadata from "../auth/loadData";
import { useClasses } from "../context/ClassContext";
import { useAssignments } from '@/app/context/AssignmentContext';
import { useLoading } from '../context/LoadingContext';

type CalendarEvent = {
  summary: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
};

export default function AssignmentContainer() {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const { refreshClasses } = useClasses();
  const { refreshAssignments } = useAssignments();
  const { showLoading, hideLoading } = useLoading();
  const hasSaved = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null); 

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
      if (assignments.length === 0 || hasSaved.current) return;

    async function saveAllAssignments() {
      try {
        hasSaved.current = true;
        showLoading("Saving your assignments...");

        const userId = await loadata();

        const seen = new Set<string>();
        const dedupedAssignments = assignments.filter(a => {
          const key = `${a.className}||${a.Name}||${a.DueDate}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
          
        for (const assignment of dedupedAssignments) {
          const res = await fetch("/api/fetchSaveAssignment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${userId}`
            },
            body: JSON.stringify(assignment),
          });
          if (!res.ok) {
            throw new Error("Failed to save your assignment.");
          }
        }
        console.log("All assignments saved successfully!");
        await Promise.all([
          refreshAssignments(),
          refreshClasses()
        ]);

        setCalendarEvents([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        hideLoading();
      } catch (error) {
        console.error("Error saving assignments:", error);
        hasSaved.current = false;
        hideLoading();
      }
    }
    saveAllAssignments();
  }, [assignments, refreshClasses, refreshAssignments, showLoading, hideLoading]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    hasSaved.current = false;
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
            ref={fileInputRef}
            type="file"
            accept=".ics"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Calendar */}
      <div className="flex-grow mb-4">
        <Calendar/>
      </div>
    </div>
  );
}
