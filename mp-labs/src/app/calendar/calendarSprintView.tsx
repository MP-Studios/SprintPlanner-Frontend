"use-client"

import { useEffect, useState } from "react";
import { getSprintAssignments } from "../api/apiConstant";
type Assignment = {
  className: string;
  name: string;
  dueDate: string;
  taskDetails: string;
};

type EditPageProps = {
  assignment: Assignment;
  onClose: () => void;
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

      const data: Assignment[] = await res.json();
      setAssignments(data);
    } catch (err) {
      console.error(err);
      setError("Could not load assignments");
    }
  };

  loadAssignments();
}, []);
    function EditPage({assignment, onClose}: EditPageProps){
   return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Edit Assignment</h2>
        <p><strong>Class:</strong> {assignment.className}</p>
        <p><strong>Name:</strong> {assignment.name}</p>
        <p><strong>Details:</strong> {assignment.taskDetails}</p>
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
                setWeekdayModalOpen(true);            // open the modal
              }}
              className="flex justify-center p-2 rounded"
            >
              {d}
            </button>
          );
          })}
      </div>

      {/* Day columns */}
      <div className="days grid grid-cols-7 border-t border-gray-300 h-150">
        {daysOfWeek.map((day, index) => {
          const dayAssignments = assignments.filter(
            (a) => new Date(a.dueDate).getDay() === index
          );

          return (
            <div
              key={day}
              className={`border-r border-gray-300 flex flex-col items-start p-2 ${
                index === 6 ? "border-r-0" : ""
              }`}
            >
              {dayAssignments.map((a, i) => {
                const isDone = doneSet.has(i);
                return (
                  <div
                    key={i}
                    className={`border p-2 rounded-sm w-full ${
                      isDone ? "bg-green-200" : "bg-blue-200"
                    } mb-2`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <button
                        onClick={() => markAsDone(i)}
                        className="globalButton bg-gray-300 px-2 py-1 rounded text-sm"
                      >
                        {isDone ? "Undo" : "Mark as Done"}
                      </button>
                      <button
                        onClick={() => {
                          setCurrentAssignment(a);
                          setEditOpen(true);
                        }}
                        className="globalButton bg-yellow-300 px-2 py-1 rounded text-sm ml-2"
                      >
                        Edit
                      </button>
                    </div>
                    <div>
                      <strong>Class:</strong> {a.className}
                    </div>
                    <div>
                      <strong>Name:</strong> {a.name}
                    </div>
                    <div>
                      <strong>Details:</strong> {a.taskDetails}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Edit modal */}
      {editOpen && currentAssignment && (
        <EditPage
          assignment={currentAssignment}
          onClose={() => setEditOpen(false)}
        />
      )}

      {weekdayModalOpen && selectedWeekday && (
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div className="modalClass rounded shadow-lg w-100 h-40 flex flex-col">
          {/* Header */}
          <h2 className="text-lg font-bold p-6 pb-2 text-center w-full">{selectedWeekday} Details</h2>
      
          {/* Scrollable content */}
          <div className="flex-grow overflow-y-auto px-6 text-center">
            <p>
              Here you can add content specific to {selectedWeekday}.
            </p>
          </div>
      
          {/* Footer with Close button pinned bottom-right */}
          <div className="flex justify-end h-7 w-97">
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