'use client';
import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { Assignment } from './assignment';
import { getClassColorNumber } from '@/utils/classColors';

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
        <div className="editAssignment shadow-lg flex flex-col h-[calc(100vh-3rem)] p-6">
            
            <h1 className="text-xl font-semibold mb-4">Your Assignments</h1>
            {error && <p className="text-red-500">{error}</p>}

            <div className="flex-1 overflow-auto assignment-list">
              <ul className="space-y-4">
                {assignments.map((a, index) => {
                  const due = new Date(a.DueDate);
                  const formattedDue = due.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });
                  
                  const colorNumber = getClassColorNumber(a.ClassId);
                  const colorClass = colorNumber === -1 ? 'color-default' : `color-${colorNumber}`;

                  return (
                    <li
                      key={`${a.ClassId}-${index}`}
                      className={`assignment-card ${colorClass}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="class-badge">
                              {a.className}
                            </span>
                          </div>
                          <div className="assignment-title">
                            {a.Name}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            <strong>Due:</strong> {formattedDue}
                          </div>
                          {a.Details && (
                            <div className="text-sm text-gray-700 mt-2 p-2 bg-white rounded">
                              {a.Details}
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
        </div>
      );
}