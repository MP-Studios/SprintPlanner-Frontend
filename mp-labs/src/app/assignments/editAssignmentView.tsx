'use client';
import { useEffect, useState, FormEvent, ChangeEvent } from 'react';

type Assignment = {
    className: string;
    name: string;
    dueDate: string;
    taskDetails: string;
  };

export default function EditAssignments() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/fetchBacklog')
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

      return (
        <div className="editAssignment p-6 shadow-lg overflow-hidden h-screen flex flex-col">
            <h1 className="text-xl font-semibold mb-4">Your Assignments</h1>
            
            {error && <p className="text-red-500">{error}</p>}

            <ul className="space-y-4">
                {assignments.map((a) => (
                    <li key={a.className} className="border p-4 rounded-sm">
                        <div><strong>Class:</strong> {a.className}</div>
                        <div><strong>Name:</strong> {a.name}</div>
                        <div><strong>Due:</strong> {a.dueDate}</div>
                        <div><strong>Details=:</strong> {a.taskDetails}</div>
                    </li>
                ))}
            </ul>
        </div>
      );
}
  
