'use client';
import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { Assignment } from './assignment';

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
              {assignments.map((a) => {
                const due = new Date(a.DueDate);
                const formattedDue = `${due.getUTCFullYear()}-${String(due.getUTCMonth()+1).padStart(2,'0')}-${String(due.getUTCDate()).padStart(2,'0')} ${String(due.getUTCHours()).padStart(2,'0')}:${String(due.getUTCMinutes()).padStart(2,'0')}:${String(due.getUTCSeconds()).padStart(2,'0')}`;

                return (
                  <li key={a.className + a.Name} className="border p-4 rounded-sm">
                    <div><strong>Class:</strong> {a.className}</div>
                    <div><strong>Name:</strong> {a.Name}</div>
                    <div><strong>Due:</strong> {formattedDue}</div>
                    <div><strong>Details:</strong> {a.Details}</div>
                  </li>
                );
              })}
            </ul>
        </div>
      );
}
  
