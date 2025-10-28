'use client';
import { useState } from 'react';
import { useAssignments } from '@/app/context/AssignmentContext';
import { getClassColorNumber } from '@/app/colors/classColors';

type Assignment = {
  className: string;
  Name: string;
  Details: string;
  DueDate: string;
  ClassId?: string;
  Id?: string;
  Status?: number;
};

type EditPageProps = {
  assignment: Assignment;
  onClose: () => void;
};

// Helper function to format date for datetime-local input
const formatDateTimeLocal = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

function EditPage({assignment, onClose}: EditPageProps){
  const [formData, setFormData] = useState({
    className: assignment.className,
    name: assignment.Name,
    details: assignment.Details || '',
    dueDate: assignment.DueDate
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    
    try {
      const assignmentId = (assignment as any).Id || (assignment as any).id;
      
      console.log('Assignment object:', assignment);
      console.log('Assignment ID:', assignmentId);
      
      if (!assignmentId) {
        throw new Error("Assignment ID not found");
      }

      const response = await fetch(`/api/update-assignment/${assignmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          className: formData.className,
          name: formData.name,
          details: formData.details,
          dueDate: formData.dueDate
        })
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response body:', responseText);

      if (!response.ok) {
        throw new Error('Failed to update assignment: ' + responseText);
      }

      // Success! Reload assignments and close modal
      alert('Assignment updated successfully!');
      window.location.reload();
      onClose();
    } catch (err) {
      console.error(err);
      setSaveError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="newAssignmentModal rounded-2xl w-[500px] max-h-[80vh] relative overflow-y-auto pointer-events-auto">
        <button
          onClick={onClose}
          disabled={saving}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
        >
          ✕
        </button>

        <h2 className="mb-4 text-xl font-bold text-black text-center">Edit Assignment</h2>
        
        {saveError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mx-2">
            {saveError}
          </div>
        )}

        <div className="space-y-4 px-2">
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Class Name</label>
            <input
              type="text"
              name="className"
              value={formData.className}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              disabled={saving}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black">Assignment Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              disabled={saving}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formatDateTimeLocal(formData.dueDate)}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              disabled={saving}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black">Details</label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2"
              disabled={saving}
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4 px-2 pb-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="globalButton flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EditAssignments() {
    const { assignments, doneSet, error, markAsDone } = useAssignments();
    const [editOpen, setEditOpen] = useState(false);
    const [currentAssignment, setCurrentAssignment] = useState<Assignment | null>(null);
    const [hoveredAssignment, setHoveredAssignment] = useState<number | null>(null);

    return (
        <div className="editAssignment p-6 shadow-lg overflow-hidden h-screen flex flex-col">
            <h1 className="text-xl font-semibold mb-4">Your Assignments</h1>
            {error && <p className="text-red-500">{error}</p>}

            <ul className="space-y-4 overflow-auto">
              {assignments.map((a, index) => {
                const due = new Date(a.DueDate);
                const formattedDue = due.toLocaleString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short'
                });
                
                const colorNumber = getClassColorNumber(a.ClassId);
                const colorClass = colorNumber === -1 ? 'color-default' : `color-${colorNumber}`;
                const isDone = doneSet.has(index);
                const isHovered = hoveredAssignment === index;

                return (
                  <li
                    key={`${a.ClassId}-${index}`}
                    className={`assignment-card ${colorClass} cursor-pointer transition-all hover:shadow-lg`}
                    style={{ opacity: isDone ? 0.6 : 1 }}
                    onMouseEnter={() => setHoveredAssignment(index)}
                    onMouseLeave={() => setHoveredAssignment(null)}
                  >
                    <div className="flex items-start justify-between">
                      <div 
                        className="flex-1"
                        onClick={() => {
                          setCurrentAssignment(a);
                          setEditOpen(true);
                        }}
                      >
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
                          <div className="text-sm text-gray-700 mt-2 p-2 rounded">
                            {a.Details}
                          </div>
                        )}
                      </div>
                      {isHovered && (
                        <div className="flex flex-col gap-2 ml-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsDone(index);
                            }}
                            className="globalButton bg-gray-300 px-2 py-1 rounded text-sm whitespace-nowrap"
                          >
                            {isDone ? "Undo" : "Mark as Done"}
                          </button>
                        </div>
                      )}
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