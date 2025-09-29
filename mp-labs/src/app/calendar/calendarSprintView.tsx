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
    const daysToIndex = {
        Sun: 1,
        Mon: 2,
        Tue: 3,
        Wed: 4,
        Thu: 5,
        Fri: 6,
        Sat: 7,
    };
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

      <div className="calendar-week-days grid grid-cols-7 font-medium mb-2 text-gray-700">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="flex items-left">{d}</div>
        ))}
      </div>
       <div className="grid grid-cols-7 gap-2">
                {assignments.map((a, i) => {
                    const date = new Date(a.dueDate).getDay();
                    const isDone = doneSet.has(i);
                    return(
                    <div
                        key={i}
                        className={`border p-4 rounded-sm ${isDone ? "bg-green-200" : "bg-blue-200"}  text-left`}
                        style={{
                            gridColumnStart:1,
                            gridColumnEnd:date + 2,
                           
                        }}>
                        <div
                        className={`button-edit border p-4 rounded-sm text-left ${isDone ? "bg-green-200" : "bg-blue-200"}`}
                        ><button
                        onClick={() => {
                          markAsDone(i);
                          // setEditOpen(true);
                          // setCurrentAssignment(a);
                        }}
                        >Mark as Done</button></div>
                        <div><strong>Class:</strong> {a.className}</div>
                        <div><strong>Name:</strong> {a.name}</div>
                        {/* <div><strong>Due:</strong> {a.dueDate}</div> */}
                        <div><strong>Details:</strong> {a.taskDetails}</div>
                      {editOpen && currentAssignment && (
                  <EditPage
                  assignment={currentAssignment}
                  onClose={()=> setEditOpen(false)}
                  />
                )}
                </div>
                );
                })}
            </div>
        </div>

    )
}