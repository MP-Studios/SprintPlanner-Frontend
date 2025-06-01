'use client';
import { useEffect, useState } from 'react';

type Assignment = {
  className: string;
  name: string;
  dueDate: string;
};

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/assignments")
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch');
        }
        return res.json();
      })
      .then(data => {
        setAssignments(data);
      })
      .catch(err => {
        console.error(err);
        setError('Error fetching assignments');
      });
  }, []);

  return (
    <div>
      <h1>Assignments</h1>
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        assignments.flat().map((a, i) => (
          <p key={i}>
            <strong>{a.className}</strong>: {a.name} (Due: {a.dueDate})
          </p>
        ))
      )}
    </div>
  );
}
