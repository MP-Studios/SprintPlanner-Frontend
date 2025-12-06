"use client"

import { useEffect, useState, useRef } from "react";
import { createClient } from '@/utils/supabase/client';
import { useAssignments } from '@/app/context/AssignmentContext';
import { useClasses } from '@/app/context/ClassContext';
import Image from "next/image";
import editAssignments from "../assignments/editAssignments";
import AssignmentCard from '@/app/assignments/AssignmentCard';

const supabase = createClient();

type Assignment = {
  className: string;
  Name: string;
  Details: string;
  DueDate: string;
  ClassId?: string;
  Id?: string;
  Status?: number;
};

type EditPageProps = {
  assignment: Assignment;
  onClose: () => void;
};

type SprintDates = {
  startDate: string;
  endDate: string;
};

// Helper function to format date for datetime-local input
const formatDateTimeLocal = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

function EditPage({assignment, onClose}: EditPageProps){
  const [formData, setFormData] = useState({
    className: assignment.className,
    name: assignment.Name,
    details: assignment.Details || '',
    dueDate: assignment.DueDate
  });

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { refreshAssignments } = useAssignments();
  const { refreshClasses } = useClasses();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);

    try {
      const assignmentId = (assignment as any).Id || (assignment as any).id;
      if (!assignmentId) {
        throw new Error("Assignment ID not found");
      }

      const response = await editAssignments(assignmentId,formData);

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response body:', responseText);
  
      if (!response.ok) {
        throw new Error('Failed to update assignment: ' + responseText);
      }
      await Promise.all([
        refreshClasses(),
        refreshAssignments(),
      ]);
      onClose();
    } catch (err) {
      console.error(err);
      setSaveError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        !saving
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, saving]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div 
        ref={modalRef}
        className="newAssignmentModal rounded-2xl w-[500px] max-h-[80vh] relative overflow-y-auto pointer-events-auto">
        <button
          onClick={onClose}
          disabled={saving}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
        >
          ✕
        </button>

        <h2 className="mb-4 text-xl font-bold text-black text-center">Edit Assignment</h2>

        {saveError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mx-2">
            {saveError}
          </div>
        )}
  
        <div className="space-y-4 px-2">
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Class Name</label>
            <input
              type="text"
              name="className"
              value={formData.className}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              disabled={saving}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black">Assignment Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              disabled={saving}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black">Due Date</label>
            <input
              type="datetime-local"
              name="dueDate"
              value={formatDateTimeLocal(formData.dueDate)}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              disabled={saving}
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Details</label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2"
              disabled={saving}
            />
          </div>
        </div>
  
        <div className="flex gap-2 mt-4 px-2 pb-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="globalButton flex-1 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

  export default function Calendar(){
    const { assignments, doneSet, error, markAsDone, refreshAssignments } = useAssignments();
    const [editOpen, setEditOpen] = useState(false);
    const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const [weekdayModalOpen, setWeekdayModalOpen] = useState(false);
    const [selectedWeekday, setSelectedWeekday] = useState<string | null>(null);
    const [sprintDates, setSprintDates] = useState<SprintDates | null>(null);
    const [hoveredCalendarAssignment, setHoveredCalendarAssignment] = useState<number | null>(null);
    const [hoveredDailyAssignment, setHoveredDailyAssignment] = useState<number | null>(null);
    const [dailyAssignments, setDailyAssignments] = useState<Assignment[]>([]);
    const [weekOffset, setWeekOffset] = useState(0);
    const todayIndex = new Date().getDay();

    useEffect(() => {
      const init = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await fetchSprintDates(session);
        }
    
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session) {
            fetchSprintDates(session);
          } else {
            setSprintDates(null);
          }
        });
    
        return () => subscription.unsubscribe();
      };
    
      const fetchSprintDates = async (session: any) => {
        try {
          const resDates = await fetch('api/fetchSprintDates', {
            headers: { 'Authorization': `Bearer ${session.access_token}` },
          });
          if (!resDates.ok) throw new Error('Failed to fetch sprint dates');
          const dataDates: SprintDates = await resDates.json();
          setSprintDates(dataDates);
        } catch (err) {
          console.error('Error loading sprint dates:', err);
        }
      };
    
      init();
    }, []);
    

  // Get the current week's Sunday
  const getCurrentWeekSunday = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - dayOfWeek + (weekOffset * 7));
    sunday.setHours(0, 0, 0, 0);
    return sunday;
  };

  // Calculate which columns an assignment should span
  const getAssignmentSpan = (assignment: Assignment) => {
    const weekSunday = getCurrentWeekSunday();
    const dueDate = new Date(assignment.DueDate);
    dueDate.setHours(0, 0, 0, 0);

    const dueDateSunday = new Date(dueDate);
    const dueDateDayOfWeek = dueDate.getDay();
    dueDateSunday.setDate(dueDate.getDate() - dueDateDayOfWeek);
    dueDateSunday.setHours(0, 0, 0, 0);

    const weekBeforeSunday = new Date(dueDateSunday);
    weekBeforeSunday.setDate(dueDateSunday.getDate() - 7)

    const currentWeekTime = weekSunday.getTime();
    const dueWeekTime = dueDateSunday.getTime();
    const weekBeforeTime = weekBeforeSunday.getTime();

    if(currentWeekTime !== dueWeekTime && currentWeekTime !== weekBeforeTime){
      return null;
    }

    const assignmentStart = new Date(weekSunday);
    const startCol = 0;
    // Calculate end column (0-6)
    const endCol = Math.min(6, Math.floor((dueDate.getTime() - weekSunday.getTime()) / (1000 * 60 * 60 * 24)));

    // Only show if it overlaps with current week
    if (endCol < 0) return null;

    return { startCol, endCol };
  };

  // Group assignments into rows to avoid overlaps
  const arrangeAssignments = () => {
    const rows: Assignment[][] = [];

    assignments.forEach((assignment) => {
      const span = getAssignmentSpan(assignment);
      if (!span) return;

      // Find a row where this assignment doesn't overlap
      let placedInRow = false;
      for (let row of rows) {
        let canPlace = true;
        for (let existingAssignment of row) {
          const existingSpan = getAssignmentSpan(existingAssignment);
          if (existingSpan) {
            // Check if they overlap
            if (!(span.endCol < existingSpan.startCol || span.startCol > existingSpan.endCol)) {
              canPlace = false;
              break;
            }
          }
        }
        if (canPlace) {
          row.push(assignment);
          placedInRow = true;
          break;
        }
      }

      // If no row works, create a new row
      if (!placedInRow) {
        rows.push([assignment]);
      }
    });

    return rows;
  };

  //compile daily lists
  useEffect(() => {
    const weekSunday = getCurrentWeekSunday();
    const fullNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayIndex = fullNames.indexOf(selectedWeekday || " ")
    const currentDay = new Date(weekSunday);
    currentDay.setDate(weekSunday.getDate() + dayIndex);

    const dailyList = assignments.filter((assignment) => {
      const dueDate = new Date(assignment.DueDate);
      return dueDate.toDateString() === currentDay.toDateString();
    });

    setDailyAssignments(dailyList);
  }, [assignments, selectedWeekday, weekOffset]);
    const assignmentRows = arrangeAssignments();

    const getWeekDateRange = () => {
      const weekSunday = getCurrentWeekSunday();
      const weekSaturday = new Date(weekSunday);
      weekSaturday.setDate(weekSunday.getDate() + 6);
      const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      };
      return `${formatDate(weekSunday)} - ${formatDate(weekSaturday)}`;
    };

    const handleOpenEdit = (assignment: Assignment) => {
      setCurrentAssignment(assignment);
      setEditOpen(true);
      setWeekdayModalOpen(false);
    }

    return(
    <div className="flex-1 flex flex-col h-full relative">
      {error && <p className="text-red-500 mb-2">{error}</p>}

      {/* Week range header */}
      <div className="flex items-center justify-between mb-2 px-4">
        <div className="text-lg font-semibold text-gray-700">
          {getWeekDateRange()}
        </div>
        {weekOffset !== 0 && (
          <button
            onClick={() => setWeekOffset(0)}
            className="globalButton text-white px-4 py-2 rounded"
          >
            Return to Current Week
          </button>
        )}
      </div>

      {/* Weekday labels */}
      <div className="calendar-week-days grid grid-cols-7 font-medium mb-2 text-gray-700">
        {daysOfWeek.map((d, index) => {
          const fullNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          const isToday = weekOffset === 0 && index === todayIndex;
          return (
            <button
              key={d}
              onClick={() => {
                setSelectedWeekday(fullNames[index]);
                console.log('Clicking on:', d);
                setWeekdayModalOpen(true);
              }}
              className={`flex justify-center p-2 rounded ${isToday ? 'font-bold text-2xl text-black rounded-md' : ''}`}
            >
              {d}
            </button>
          );
          })}
      </div>

      {/* Gantt chart view */}
      <div className="relative border-t border-gray-300 overflow-auto h-[calc(100vh-10rem)]">
        {/* Assignment bars */}
        <div className="relative p-2 min-h-full">
          {/* Column dividers - moved inside scrollable content */}
          <div className="absolute inset-0 grid grid-cols-7 pointer-events-none" style={{ height: '100%', minHeight: '100%' }}>
            {daysOfWeek.map((day, index) => (
              <div
                key={day}
                className={`border-b border-r border-gray-300 h-full ${index === 6 ? "border-r-0" : ""}`}
              />
            ))}
          </div>
        
          {/* Assignment bars */}
          <div className="relative p-2" style={{padding: '0px 0px 100px 0px'}}>
            {assignmentRows.map((row, rowIndex) => (
              <div 
                key={`row-${rowIndex}`}
                className="relative mb-1"
                style={{ height: 'auto', minHeight: '100px' }}
              >
                {row.map((assignment) => {
                  const span = getAssignmentSpan(assignment);
                  if (!span) return null;

                  const globalIndex = assignments.indexOf(assignment);
                  const widthPercent = ((span.endCol - span.startCol + 1) / 7) * 100;
                  const leftPercent = (span.startCol / 7) * 100;

                  return (
                    <div
                      key={assignment.Id ?? `${assignment.ClassId ?? 'no-class'}-${assignment.Name}`}
                      className="absolute"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                        top: 0,
                        position: 'relative',
                      }}
                    >
                      <AssignmentCard
                        assignment={assignment}
                        index={globalIndex}
                        isDone={doneSet.has(globalIndex)}
                        isHovered={hoveredCalendarAssignment === globalIndex}
                        showDetails={true}
                        showDueDate={true}
                        showCheckbox={true}
                        showDeleteButton={true}
                        onEdit={() => handleOpenEdit(assignment)}
                        onMarkDone={() => markAsDone(globalIndex)}
                        onDelete={() => refreshAssignments()}
                        onHoverChange={(hovered) => setHoveredCalendarAssignment(hovered ? globalIndex : null)}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit modal */}
      {editOpen && currentAssignment && (
        <EditPage
          key={currentAssignment.Id || `${currentAssignment.ClassId}-${currentAssignment.Name }`}
          assignment={currentAssignment}
          onClose={() => setEditOpen(false)}
        />
      )}
      {/* Daily List */}
      {weekdayModalOpen && selectedWeekday && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
        <div className="daily-list modalClass rounded shadow-lg w-120 h-100 flex flex-col">
        {/* Header */}
          <h2 className="text-lg font-bold p-6 pb-2 text-center w-full">{selectedWeekday} Details</h2>

          {/* Scrollable content */}
          <div 
            className="flex-grow overflow-y-auto px-6"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#cbd5e1 #f1f5f9'
            }}
            >
            {dailyAssignments.length > 0 ? (
              <ul className="space-y-4 py-4 p-4">
                <p className="text-center font-semibold mb-2 pt-2">Assignments due:</p>
                {dailyAssignments.map((assignment, dailyIndex) => {
                  const globalIndex = assignments.indexOf(assignment);
                  return (
                    <li key={assignment.Id ?? `${assignment.ClassId ?? 'no-class'}-${assignment.Name}-${dailyIndex}`}>
                      <AssignmentCard
                        assignment={assignment}
                        index={globalIndex}
                        isDone={doneSet.has(globalIndex)}
                        isHovered={hoveredDailyAssignment === globalIndex}
                        showDetails={true}
                        showDueDate={false}
                        showCheckbox={true}
                        showDeleteButton={true}
                        onEdit={() => handleOpenEdit(assignment)}
                        onMarkDone={() => markAsDone(globalIndex)}
                        onDelete={() => refreshAssignments()}
                        onHoverChange={(hovered) => setHoveredDailyAssignment(hovered ? globalIndex : null)}
                      />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <Image 
                  src="/sleepy.png" 
                  alt="No assignments today. Rest up!"
                  width={300} 
                  height={300}
                  className="mb-4"
                />
                <p className="text-gray-600 text-center">
                  No assignments for {selectedWeekday}. Rest up!
                </p>
              </div>
            )}
          </div>

          {/* Close button */}
          <div className="flex justify-end h-5 w-115">
            <button
              onClick={() => setWeekdayModalOpen(false)}
              className="globalButton rounded h-6"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}

    {/* next & previous week buttons */}
      <div className="prev-week-link">
        <button 
          onClick={() => setWeekOffset(weekOffset - 1)}
          className="prev-week-details"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 268.832 268.832">
            <path d="M265.17 125.577l-80-80c-4.88-4.88-12.796-4.88-17.677 0-4.882 4.882-4.882 12.796 0 17.678l58.66 58.66H12.5c-6.903 0-12.5 5.598-12.5 12.5 0 6.903 5.597 12.5 12.5 12.5h213.654l-58.66 58.662c-4.88 4.882-4.88 12.796 0 17.678 2.44 2.44 5.64 3.66 8.84 3.66s6.398-1.22 8.84-3.66l79.997-80c4.883-4.882 4.883-12.796 0-17.678z"/>
          </svg>
        </button>
      </div>

      <div className="next-week-link">
        <button 
          onClick={() => setWeekOffset(weekOffset + 1)}
          className="next-week-details"
        >
          <span className="next-week-text">Next week</span>
          <div className="next-week-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 268.832 268.832">
              <path d="M265.17 125.577l-80-80c-4.88-4.88-12.796-4.88-17.677 0-4.882 4.882-4.882 12.796 0 17.678l58.66 58.66H12.5c-6.903 0-12.5 5.598-12.5 12.5 0 6.903 5.597 12.5 12.5 12.5h213.654l-58.66 58.662c-4.88 4.882-4.88 12.796 0 17.678 2.44 2.44 5.64 3.66 8.84 3.66s6.398-1.22 8.84-3.66l79.997-80c4.883-4.882 4.883-12.796 0-17.678z"/>
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}