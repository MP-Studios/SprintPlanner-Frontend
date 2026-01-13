'use client';
import { useEffect, useRef, useState } from 'react';
import { useAssignments } from '@/app/context/AssignmentContext';
import { useClasses } from '@/app/context/ClassContext';
import editAssignments from './editAssignments';
import AssignmentCard from './AssignmentCard';

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
  const { updateAssignmentLocal } = useAssignments();
  const { updateClassNameLocal } = useClasses();

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

      // Determine what changed
      const classNameChanged = formData.className !== assignment.className;
      const classIdChanged = assignment.ClassId;

      // Create updated assignment object
      const updatedAssignment: Assignment = {
        ...assignment,
        className: formData.className,
        Name: formData.name,
        Details: formData.details,
        DueDate: formData.dueDate,
      };

      // OPTIMISTIC UPDATE: Update UI immediately
      if (classNameChanged && classIdChanged) {
        // Update class name in ClassContext (affects all assignments with this ClassId)
        updateClassNameLocal(classIdChanged, formData.className);
      } else {
        // Just update this single assignment
        updateAssignmentLocal(assignmentId, updatedAssignment);
      }

      // Call parent's onSave for local state
      onSave(updatedAssignment);
      
      // Close modal immediately - user doesn't need to wait
      onClose();

      // Send update to server in background
      const response = await editAssignments(assignmentId, formData);
      
      if (!response.ok) {
        const responseText = await response.text();
        console.error('Failed to update on server:', responseText);
        // Optionally: show a toast notification that sync failed
        // and offer to retry or refresh
      }

    } catch (err) {
      console.error(err);
      setSaveError(err instanceof Error ? err.message : 'Failed to save changes');
      setSaving(false);
      // Don't close modal if there's an error
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
   
    return (
        <div className="editAssignment p-6 shadow-lg overflow-hidden h-screen flex flex-col">
            {error && <p className="text-red-500">{error}</p>}

            <ul className="space-y-4 overflow-auto" style={{padding: '0px 0px 150px 0px'}} >
              {assignments.map((a, index) => (
                <li key={a.Id ?? `${a.ClassId ?? 'no-class'}-${a.Name}-${index}`}>
                  <AssignmentCard
                    assignment={a}
                    index={index}
                    isDone={doneSet.has(index)}
                    isHovered={hoveredAssignment === index}
                    showDetails={true}
                    showDueDate={true}
                    showCheckbox={true}
                    showDeleteButton={true}
                    onEdit={() => {
                      setCurrentAssignment(a);
                      setEditOpen(true);
                    }}
                    onMarkDone={() => markAsDone(index)}
                    onDelete={async () => {
                      // Only refresh after delete, not after edit
                      // (delete needs full refresh to recalculate indices)
                    }}
                    onHoverChange={(hovered) => setHoveredAssignment(hovered ? index : null)}
                  />
                </li>
              ))}
            </ul>

            {/* Edit modal */}
            {editOpen && currentAssignment && (
              <EditPage
                key={currentAssignment.Id ?? currentAssignment.ClassId ?? currentAssignment.Name}
                assignment={currentAssignment}
                onClose={() => setEditOpen(false)}
                onSave={(updated) => {
                  // Local state update handled by context
                  // No need to do anything here
                }}
              />
            )}
        </div>
      );
}