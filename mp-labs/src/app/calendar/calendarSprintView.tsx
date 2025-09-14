"use-client"

import { useEffect, useState } from "react";
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
            fetch('http://localhost:8080/api/assignments')
              .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch assignments');
                return res.json();
              })
              .then(setAssignments)
              .catch((err) => {
                console.error(err);
                setError('Could not load assignments');
              });
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
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
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
        {daysOfWeek.map((d) => (
          <div key={d} className="flex justify-center">
            {d}
          </div>
        ))}
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
                        className="bg-gray-300 px-2 py-1 rounded text-sm"
                      >
                        {isDone ? "Undo" : "Mark as Done"}
                      </button>
                      <button
                        onClick={() => {
                          setCurrentAssignment(a);
                          setEditOpen(true);
                        }}
                        className="bg-yellow-300 px-2 py-1 rounded text-sm ml-2"
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
    </div>
    )
}