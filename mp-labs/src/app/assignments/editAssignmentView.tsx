'use client';
import { useEffect, useState, FormEvent, ChangeEvent } from 'react';

type Assignment = {
    className: string;
    Name: string;
    DueDate: string;
    TaskDetails: string;
  };

export default function AlternateView() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAssignments();
      }, []);

    const fetchAssignments = async () => {
        try {
          const res = await fetch('http://localhost:8080/api/assignments');
          if (!res.ok) throw new Error('Failed to fetch');
          const data = await res.json();
          setAssignments(data);
        } catch (err) {
          console.error(err);
          setError('Error fetching assignments');
        }
      }; 

      return (
        <div className="editAssignment p-6 bg-white shadow-lg overflow-hidden h-screen flex flex-col">
            <h1 className="text-xl font-semibold mb-4">Assignments</h1>
            
        </div>
      );
}
  
