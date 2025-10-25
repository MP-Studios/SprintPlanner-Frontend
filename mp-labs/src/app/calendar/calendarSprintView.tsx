"use-client"

import { useEffect, useState } from "react";
import { getClassColorNumber } from '@/app/colors/classColors';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

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
    const [weekOffset, setWeekOffset] = useState(0);

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
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
      if (sessionError || !session) {
        setError('Not authenticated. Please log in.');
        return;
      }
      const res = await fetch('/api/assignments', {
        //if you fetch from api/fetchBacklog = only able to load first 1000 assignments
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (!res.ok) throw new Error("Failed to fetch assignments");
      const dataAssignments: Assignment[] = await res.json();
      
      const resDates = await fetch('api/fetchSprintDates', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
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
    sunday.setDate(now.getDate() - dayOfWeek + (weekOffset * 7));
    sunday.setHours(0, 0, 0, 0);
    return sunday;
  };

  // Calculate which columns an assignment should span
  const getAssignmentSpan = (assignment: Assignment) => {

    const weekSunday = getCurrentWeekSunday();
    const dueDate = new Date(assignment.DueDate);
    const assignmentStart = new Date(assignment.DueDate);
    assignmentStart.setDate(dueDate.getDate() - 14);
    
    // Calculate start column (0-6)
    const startCol = Math.max(0, Math.floor((assignmentStart.getTime() - weekSunday.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Calculate end column (0-6)
    const endCol = Math.min(6, Math.floor((dueDate.getTime() - weekSunday.getTime()) / (1000 * 60 * 60 * 24)));

    // Only show if it overlaps with current week
    if (endCol < 0 || startCol > 6) return null;

    return { startCol, endCol };
  };

  // Group assignments into rows to avoid overlaps
  const arrangeAssignments = () => {
    //if (!sprintDates) return [];

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
    const [formData, setFormData] = useState({
      className: assignment.className,
      name: assignment.Name,
      details: assignment.Details || '',
      dueDate: assignment.DueDate
    });
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
  
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
        
        console.log('Assignment object:', assignment);
        console.log('Assignment ID:', assignmentId);
        
        if (!assignmentId) {
          throw new Error("Assignment ID not found");
        }
  
        const response = await fetch(`/api/update-assignment/${assignmentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            className: formData.className,
            name: formData.name,
            details: formData.details,
            dueDate: formData.dueDate
          })
        });
  
        console.log('Response status:', response.status);
        const responseText = await response.text();
        console.log('Response body:', responseText);
  
        if (!response.ok) {
          throw new Error('Failed to update assignment: ' + responseText);
        }
  
        // Success! Reload assignments and close modal
        alert('Assignment updated successfully!');
        window.location.reload();
        onClose();
      } catch (err) {
        console.error(err);
        setSaveError(err instanceof Error ? err.message : 'Failed to save changes');
      } finally {
        setSaving(false);
      }
    };
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="newAssignmentModal rounded-2xl w-[500px] max-h-[80vh] relative overflow-y-auto pointer-events-auto">
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
                value={formData.dueDate.slice(0, 16)} // Format for datetime-local input
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
              className="globalButton flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            className="globalButton bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Return to Current Week
          </button>
        )}
      </div>

      {/* Weekday labels */}
      <div className="calendar-week-days grid grid-cols-7 font-medium mb-2 text-gray-700">
        {daysOfWeek.map((d, index) => {
          const fullNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          return (
            <button
              key={d}
              onClick={() => {
                setSelectedWeekday(fullNames[index]);
                console.log('Clicking on:', d);
                setWeekdayModalOpen(true);
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

                  const colorNumber = getClassColorNumber(assignment.ClassId);
                  const colorClass = colorNumber === -1 ? 'color-default' : `color-${colorNumber}`;

                  return (
                    <div
                      key={assignmentIndex}
                      className={`assignment-card absolute transition-all cursor-pointer ${colorClass} ${isHovered ? "shadow-lg" : ""}`}
                      style={{
                        opacity: isDone ? 0.6 : 1,
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                        top: 0,
                        position: 'relative',
                        paddingBottom: isHovered ? '31px' : '4px',
                      }}
                      onMouseEnter={() => setHoveredAssignment(globalIndex)}
                      onMouseLeave={() => setHoveredAssignment(null)}
                      onClick={() => {
                        setCurrentAssignment(assignment);
                        setEditOpen(true);
                      }}
                    >
                      {/* Button - only show on hover */}
                      {isHovered && (
                        <div className="flex justify-center items-center mt-1" style={{ position: 'absolute', bottom: '3px', left: '8px', right: '8px' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsDone(globalIndex);
                            }}
                            className="globalButton bg-gray-300 px-2 py-1 rounded text-sm"
                          >
                            {isDone ? "Undo" : "Mark as Done"}
                          </button>
                        </div>
                      )}
                      
                      {/* Assignment details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="class-badge">
                            {assignment.className}
                          </span>
                        </div>
                        <div className="assignment-title">
                          {assignment.Name}
                        </div>
                        {assignment.Details && (
                          <div className="text-sm text-gray-700 mt-2">
                            {assignment.Details}
                          </div>
                        )}
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

    {/* make her functional */}
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
    )
}
