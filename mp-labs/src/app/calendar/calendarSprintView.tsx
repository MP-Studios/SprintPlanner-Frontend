"use-client"

import { get } from "http";
import { useEffect, useState } from "react";
import { getClassColorNumber } from '@/app/colors/classColors';

type Assignment = {
  className: string;
  Name: string;
  Details: string;
  DueDate: string;
  ClassId?: string;
};

type EditPageProps = {
  assignment: Assignment;
  onClose: () => void;
};

type SprintDates = {
  startDate: string;
  endDate: string;
};

export default function Calendar(){
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [editOpen, setEditOpen] = useState(false);
    const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const [doneSet, setDoneSet] = useState<Set<number>>(new Set());
    const [weekdayModalOpen, setWeekdayModalOpen] = useState(false);
    const [selectedWeekday, setSelectedWeekday] = useState<string | null>(null);
    const [sprintDates, setSprintDates] = useState<SprintDates | null>(null);
    const [hoveredAssignment, setHoveredAssignment] = useState<number | null>(null);
    const [dailyAssignments, setDailyAssignments] = useState<Assignment[]>([]);

  const markAsDone = (index: number) => {
  setDoneSet((prev) => {
    const newSet = new Set(prev);
    if (newSet.has(index)) {
      newSet.delete(index); // unmark if already done
    } else {
      newSet.add(index); // mark as done
    }
    return newSet;
  });
};
  useEffect(() => {
    const loadAssignments = async () => {
    try {
      const res = await fetch("/api/fetchSprint");
      if (!res.ok) throw new Error("Failed to fetch assignments");
      const dataAssignments: Assignment[] = await res.json();
      
      const resDates = await fetch("api/fetchSprintDates");
      if (!resDates.ok) throw new Error("Failed to fetch sprint dates");
      const dataDates: SprintDates = await resDates.json();

      setAssignments(dataAssignments);
      setSprintDates(dataDates);
    } catch (err) {
      console.error(err);
      setError("Could not load assignments");
    }
  };

  loadAssignments();
}, []);
  // Get the current week's Sunday
  const getCurrentWeekSunday = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const sunday = new Date(now);
    sunday.setDate(now.getDate() - dayOfWeek);
    sunday.setHours(0, 0, 0, 0);
    return sunday;
  };

  // Calculate which columns an assignment should span
  const getAssignmentSpan = (assignment: Assignment) => {
    if (!sprintDates) return null;

    const weekSunday = getCurrentWeekSunday();
    const sprintStart = new Date(sprintDates.startDate);
    const dueDate = new Date(assignment.DueDate);

    // Determine the actual start for this week's view
    const viewStart = sprintStart < weekSunday ? weekSunday : sprintStart;
    
    // Calculate start column (0-6)
    const startCol = Math.max(0, Math.floor((viewStart.getTime() - weekSunday.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Calculate end column (0-6)
    const endCol = Math.min(6, Math.floor((dueDate.getTime() - weekSunday.getTime()) / (1000 * 60 * 60 * 24)));

    // Only show if it overlaps with current week
    if (endCol < 0 || startCol > 6) return null;

    return { startCol: Math.max(0, startCol), endCol: Math.min(6, endCol) };
  };

  // Group assignments into rows to avoid overlaps
  const arrangeAssignments = () => {
    if (!sprintDates) return [];

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
  }, [assignments, selectedWeekday]); 

  function EditPage({assignment, onClose}: EditPageProps){
   return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      >
        <div className="bg-white p-6 rounded shadow-lg w-96">
          <h2 className="text-lg font-bold mb-4">Edit Assignment</h2>
          <p><strong>Class:</strong> {assignment.className}</p>
          <p><strong>Name:</strong> {assignment.Name}</p>
          <p><strong>Details:</strong> {assignment.Details}</p>
          {/* Add your input fields or edit form here */}
          <button
            onClick={onClose}
            className="globalButton mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
    }

    const assignmentRows = arrangeAssignments();

    return(
    <div>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      {/* Weekday labels */}
      <div className="calendar-week-days grid grid-cols-7 font-medium mb-2 text-gray-700">
        {daysOfWeek.map((d, index) => {
          const fullNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          return (
            <button
              key={d}
              onClick={() => {
                setSelectedWeekday(fullNames[index]); // store the full day name
                console.log('Clicking on:', d); // Log the day being clicked
                setWeekdayModalOpen(true);            // open the modal
              }}
              className="flex justify-center p-2 rounded"
            >
              {d}
            </button>
          );
          })}
      </div>

      {/* Gantt chart view */}
      <div className="relative border-t border-gray-300 overflow-auto h-[calc(100vh-10rem)]">
        {/* Assignment bars */}
        <div className="relative p-2">
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
          <div className="relative p-2">
            {assignmentRows.map((row, rowIndex) => (
              <div key={rowIndex} className="relative mb-1" style={{ height: 'auto', minHeight: '100px' }}>
                {row.map((assignment, assignmentIndex) => {
                  const span = getAssignmentSpan(assignment);
                  if (!span) return null;

                  const globalIndex = assignments.indexOf(assignment);
                  const isDone = doneSet.has(globalIndex);
                  const isHovered = hoveredAssignment === globalIndex;

                  const widthPercent = ((span.endCol - span.startCol + 1) / 7) * 100;
                  const leftPercent = (span.startCol / 7) * 100;

                  return (
                    <div
                      key={assignmentIndex}
                      className={`absolute border rounded-sm transition-all ${
                        isDone ? "bg-green-200" : "bg-blue-200"
                      }`}
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                        top: 0,
                        padding: '3px',
                        position: 'relative',
                        textAlign: 'center',
                        paddingBottom: isHovered ? '31px' : '4px',
                      }}
                      onMouseEnter={() => setHoveredAssignment(globalIndex)}
                      onMouseLeave={() => setHoveredAssignment(null)}
                    >
                      {/* Buttons - only show on hover */}
                      {isHovered && (
                        <div className="flex justify-between items-center mt-1" style={{ position: 'absolute', bottom: '3px', left: '8px', right: '8px' }}>
                          <button
                            onClick={() => markAsDone(globalIndex)}
                            className="globalButton bg-gray-300 px-2 py-1 rounded text-sm"
                          >
                            {isDone ? "Undo" : "Mark as Done"}
                          </button>
                          <button
                            onClick={() => {
                              setCurrentAssignment(assignment);
                              setEditOpen(true);
                            }}
                            className="globalButton bg-yellow-300 px-2 py-1 rounded text-sm ml-2"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                      
                      {/* Assignment details */}
                      <div className="text-sm flex-grow">
                        <div><strong>Class:</strong> {assignment.className}</div>
                        <div><strong>Name:</strong> {assignment.Name}</div>
                        <div><strong>Details:</strong> {assignment.Details}</div>
                      </div>
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
                  const isDone = doneSet.has(globalIndex);
                  
                  const due = new Date(assignment.DueDate);
                  const formattedDue = due.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });
                  
                  const colorNumber = getClassColorNumber(assignment.ClassId);
                  const colorClass = colorNumber === -1 ? 'color-default' : `color-${colorNumber}`;

                  return (
                    <li
                      key={`${assignment.ClassId}-${dailyIndex}`}
                      className={`assignment-card ${colorClass}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="class-badge">
                              {assignment.className}
                            </span>
                          </div>
                          <div className="assignment-title">
                            {assignment.Name}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            <strong>Due:</strong> {formattedDue}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => markAsDone(globalIndex)}
                            className="globalButton bg-gray-300 px-2 py-1 rounded text-sm"
                          >
                            {isDone ? "Undo" : "Mark as Done"}
                          </button>
                          <button
                            onClick={() => {
                              setCurrentAssignment(assignment);
                              setEditOpen(true);
                            }}
                            className="globalButton bg-yellow-300 px-2 py-1 rounded text-sm"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-center py-4">No assignments for {selectedWeekday}.</p>
            )}
          </div>
      
          {/* Close button */}
          <div className="flex justify-end h-5 w-115">
            <button
              onClick={() => setWeekdayModalOpen(false)}
              className="globalButton rounded h-5"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )}

    <div className="next-week-link">
      <div className="next-week-details">
        <a href="./src/about.tsx">Next week</a>
        <div className="next-week-arrow">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 268.832 268.832">
            <path d="M265.17 125.577l-80-80c-4.88-4.88-12.796-4.88-17.677 0-4.882 4.882-4.882 12.796 0 17.678l58.66 58.66H12.5c-6.903 0-12.5 5.598-12.5 12.5 0 6.903 5.597 12.5 12.5 12.5h213.654l-58.66 58.662c-4.88 4.882-4.88 12.796 0 17.678 2.44 2.44 5.64 3.66 8.84 3.66s6.398-1.22 8.84-3.66l79.997-80c4.883-4.882 4.883-12.796 0-17.678z"/>
          </svg>
        </div>
      </div>
    </div>

    </div>
    )
}
