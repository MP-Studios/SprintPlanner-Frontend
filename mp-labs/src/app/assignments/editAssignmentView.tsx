'use client';
import { useEffect, useRef, useState } from 'react';
import { useAssignments } from '@/app/context/AssignmentContext';
import { getClassColorNumber } from '@/app/colors/classColors';
import { on } from 'events';
import { editAssignment } from '../api/apiConstant';
import editAssignments from './editAssignments';

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
  onSave: (updatedAssignment: Assignment) => void;
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

function EditPage({assignment, onClose, onSave}: EditPageProps){
  
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
      
      if (!assignmentId) {
        throw new Error("Assignment ID not found");
      }

      const response = await editAssignments(assignmentId,formData);
      // const response2 = await fetch(`/api/updateAssignmentStatus/`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${assignmentId}`,
      //   },
      //   body: JSON.stringify({
      //     className: formData.className,
      //     name: formData.name,
      //     details: formData.details,
      //     dueDate: formData.dueDate
      //   })
      // });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response body:', responseText);

      if (!response.ok) {
        throw new Error('Failed to update assignment: ' + responseText);
      }
      const updatedAssignment: Assignment = {
      ...assignment,
      className: formData.className,
      Name: formData.name,
      Details: formData.details,
      DueDate: formData.dueDate,
    };

      // Success! Reload assignments and close modal
      //window.location.reload(); // this is probably dumb
      onSave(updatedAssignment);
      onClose();
    } catch (err) {
      console.error(err);
      setSaveError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        !saving
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, saving]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
    >
      <div 
        ref={modalRef}
        className="newAssignmentModal rounded-2xl w-[500px] max-h-[80vh] relative overflow-y-auto pointer-events-auto"
      >
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
              type="datetime-local"
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
            className="globalButton flex-1 text-white px-4 py-2 rounded disabled:bg-gray-400"
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
    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmingAssignment, setConfirmingAssignment] = useState<string | null>(null);
    // const { assignments, doneSet, error, markAsDone } = useAssignments();
   const [assignmentsState, setAssignmentsState] = useState<Assignment[]>(assignments);

    //delete assignment
    const handleDelete = async (aId: string, assignmentName: string) => {
      setIsDeleting(true);
      try {
        const response = await fetch("api/deleteAssignment", {
          method: "DELETE",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({assignmentId: aId})
        });

        console.log('Response status:', response.status);
        const responseText = await response.text();
        console.log('Response body:', responseText);

        if (!response.ok) {
          throw new Error('Failed to delete assignment: ' + responseText);
        }

        alert(`${assignmentName} successfully deleted!`);
        window.location.reload();
        setConfirmingAssignment(null);
      } catch (err) {
          console.error(err);
      } finally {
          setIsDeleting(false);
      }
    };

    const handleCancel = () => {
      setConfirmingAssignment(null);
    };

    return (
        <div className="editAssignment p-6 shadow-lg overflow-hidden h-screen flex flex-col">
            <h1 className="text-xl font-semibold mb-4">Your Assignments</h1>
            {error && <p className="text-red-500">{error}</p>}

            <ul className="space-y-4 overflow-auto" style={{padding: '0px 0px 150px 0px'}} >
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
                    className={`assignment-card ${colorClass} cursor-pointer transition-all hover:shadow-lg relative z-10`}
                    style={{ opacity: isDone ? 0.6 : 1 }}
                    onMouseEnter={() => {if (!confirmingAssignment) setHoveredAssignment(index)}}
                    onMouseLeave={() => {if (!confirmingAssignment) setHoveredAssignment(null)}}
                    onClick={() => {
                      if (confirmingAssignment) return;
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
                          <div className="text-sm text-gray-700 mt-2 p-2 rounded">
                            {a.Details}
                          </div>
                        )}
                      </div>
                      {isHovered && (
                        <div className="flex flex-col gap-2 ml-4">
                          <div
                            className="checkbox-wrapper-19"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsDone(index); // toggle done
                            }}
                          >
                            <input
                              type="checkbox"
                              id={`cbtest-${index}`}
                              checked={isDone}
                              readOnly
                            />
                            <label
                              htmlFor={`cbtest-${index}`}
                              className={`check-box ${isDone ? 'checked' : ''}`}
                            />
                          </div>
                          <div 
                            className="delete-container"
                            onClick={(e) => e.stopPropagation()}
                          >
                              <label onClick={() => setConfirmingAssignment(a.Id || `${a.ClassId}-${index}`)}>
                                <div className="delete-wrapper">
                                  <div className="delete-lid"></div>
                                  <div className="delete-can"></div>
                                </div>
                              </label>
                            </div>
                            {confirmingAssignment === (a.Id || `${a.ClassId}-${index}`) && (
                              <div 
                                className="delete-dialog-overlay" 
                                onClick={(e) => {
                                  if (e.target === e.currentTarget) {
                                    e.stopPropagation();
                                    handleCancel();
                                  }
                                }}
                              >
                                <div
                                  className="modalClass delete-dialog show z-50 rounded-2xl shadow-lg flex flex-col items-center justify-center max-w-[90%] sm:max-w-[400px] mx-auto p-4"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                <p className="text-lg font-semibold mb-4 text-center break-words whitespace-normal w-full max-w-full min-w-0">
                                  Are you sure you want to delete <br />
                                  this assignment:{" "}
                                  <span className="font-bold break-words whitespace-normal block text-wrap">
                                    {a.Name}
                                  </span>
                                </p>
                                <div className="flex justify-center gap-8 flex-wrap">
                                <button
                                  onClick={() => handleDelete(a.Id!, a.Name!)}
                                  disabled={isDeleting}
                                  className="globalButton px-4 py-2 rounded-md"
                                >
                                  Yes, Delete
                                </button>

                                <button
                                  onClick={handleCancel}
                                  className="globalButton px-4 py-2 rounded-md"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
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
                key={currentAssignment.Id ?? currentAssignment.ClassId ?? currentAssignment.Name}
                assignment={currentAssignment}
                onClose={() => setEditOpen(false)}
                onSave={(updated) => {
  setAssignmentsState((prev) =>
    prev.map((a) => (a.Id === updated.Id ? updated : a))
  );
}}
              />
            )}
        </div>
      );
}