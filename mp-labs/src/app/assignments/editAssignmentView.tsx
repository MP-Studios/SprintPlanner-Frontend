'use client';
import { useEffect, useState, FormEvent, ChangeEvent } from 'react';

type Assignment = {
    className: string;
    Name: string;
    DueDate: string;
    TaskDetails: string;
  };

export default function EditAssignments() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [error, setError] = useState<string | null>(null);

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

      return (
        <div className="editAssignment p-6 shadow-lg overflow-hidden h-screen flex flex-col">
            <h3 className="text-xl font-semibold mb-4">Your Assignments</h3>
            
            {error && <p className="text-red-500">{error}</p>}

            <ul className="space-y-4">
                {assignments.map((a) => (
                    <li key={a.className} className="border p-4 rounded-sm">
                        <div><strong>Class:</strong> {a.className}</div>
                        <div><strong>Name:</strong> {a.Name}</div>
                        <div><strong>Due:</strong> {a.DueDate}</div>
                        <div><strong>Details:</strong> {a.TaskDetails}</div>
                    </li>
                ))}
            </ul>
        </div>
      );
}
  
