'use client';
import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();
import { getClassColorNumber } from '@/app/colors/classColors';

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

function EditPage({assignment, onClose}: EditPageProps){
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Edit Assignment</h2>
        <p><strong>Class:</strong> {assignment.className}</p>
        <p><strong>Name:</strong> {assignment.Name}</p>
        <p><strong>Details:</strong> {assignment.Details}</p>
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

export default function EditAssignments() {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [editOpen, setEditOpen] = useState(false);
    const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);

    useEffect(() => {
      console.log('useEffect triggered!');
      const loadAssignments = async () => {
        try {
          // Get the user's session token
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError || !session) {
            setError('Not authenticated. Please log in.');
            return;
          }
          
          console.log('Making fetch request to /api/fetchBacklog');
  
          // Make the fetch call with Authorization header
          const res = await fetch('/api/fetchBacklog', {
            headers: {
              'Authorization': `Bearer ${session.access_token}`
            }
          });

          if (!res.ok) throw new Error('Failed to fetch assignments');
          
          const data = await res.json();
          setAssignments(data);
        } catch (err) {
          console.error(err);
          setError('Could not load assignments');
        }
      };
  
      loadAssignments();
    }, []);
      

      return (
        <div className="editAssignment p-6 shadow-lg overflow-hidden h-screen flex flex-col">
            <h1 className="text-xl font-semibold mb-4">Your Assignments</h1>
            {error && <p className="text-red-500">{error}</p>}

            <ul className="space-y-4 overflow-auto">
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
                    className={`assignment-card ${colorClass} cursor-pointer transition-all hover:shadow-lg`}
                    onClick={() => {
                      setCurrentAssignment(a);
                      setEditOpen(true);
                    }}
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

            {/* Edit modal */}
            {editOpen && currentAssignment && (
              <EditPage
                assignment={currentAssignment}
                onClose={() => setEditOpen(false)}
              />
            )}
        </div>
      );
}