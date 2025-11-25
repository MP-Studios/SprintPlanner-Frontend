'use client';

import { useState, useEffect, useRef } from "react";
import Calendar from "./calendarSprintView";
import ICAL from "ical.js";
import { Assignment } from "../assignments/assignment";
import loadata from "../auth/loadData";
import { useClasses } from "../context/ClassContext";
import { useAssignments } from '@/app/context/AssignmentContext';
import Image from 'next/image';

type CalendarEvent = {
  summary: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
};

export default function AssignmentContainer() {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const {refreshClasses} = useClasses();
  const {refreshAssignments} = useAssignments();
  const hasSaved = useRef(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showZs, setShowZs] = useState(false);

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
        const img = new window.Image();
        img.src = '/sleepy.png';
        img.onload = () => setIsImageLoaded(true);
      }, []);

    useEffect(() => {
      if (assignments.length === 0 || hasSaved.current) return;

    async function saveAllAssignments() {
      try {
        hasSaved.current = true;
        setIsSaving(true);
        setShowZs(false);

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
        await Promise.all([
          refreshAssignments(),
          refreshClasses()
        ]);
        setIsSaving(false);
        setShowZs(false);
      } catch (error) {
        console.error("Error saving assignments:", error);
        hasSaved.current = false;
        setIsSaving(false);
      }
    }
    saveAllAssignments();
  }, [assignments, refreshClasses, refreshAssignments]);

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

      {isSaving && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          }}
          >
          <div className="loading-container">
            <Image 
              src="/sleepy.png" 
              alt="Saving assignments..." 
              width={300} 
              height={300}
              priority
              onLoad={() => {
                setIsImageLoaded(true);
                setTimeout(() => setShowZs(true), 100);
              }}
              />
              {showZs && (
                <div className="z-container">
                  <div className="z z-1">Z</div>
                  <div className="z z-2">Z</div>
                  <div className="z z-3">Z</div>
                  <div className="z z-4">Z</div>
                </div>
              )}
            </div>
            <p style={{ 
              color: 'white', 
              marginTop: '20px', 
              fontSize: '18px',
              fontWeight: 'bold' 
            }}>
              Saving your assignments...
            </p>
          </div>
        )}
    </div>
  );
}
