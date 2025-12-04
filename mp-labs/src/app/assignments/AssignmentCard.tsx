'use client';

import { useState } from "react";
import { getClassColorNumber } from '@/app/colors/classColors';
import { useClasses } from '@/app/context/ClassContext';
import { useAssignments } from '@/app/context/AssignmentContext';

type Assignment = {
    className: string;
    Name: string;
    DueDate: string;
    Details: string;
    ClassId?: string | null;
    Id?: string;
    Status?: number;
};

type AssignmentCardProps = {
  assignment: Assignment;
  index: number;
  isDone?: boolean;
  isHovered?: boolean;
  showDetails?: boolean;
  showDueDate?: boolean;
  showCheckbox?: boolean;
  showDeleteButton?: boolean;
  onEdit?: () => void;
  onMarkDone?: () => void;
  onDelete?: () => void;
  onHoverChange?: (hovered: boolean) => void;
  className?: string;
};

export default function AssignmentCard({
  assignment,
  index,
  isDone = false,
  isHovered = false,
  showDetails = true,
  showDueDate = true,
  showCheckbox = true,
  showDeleteButton = true,
  onEdit,
  onMarkDone,
  onDelete,
  onHoverChange,
  className = '',
}: AssignmentCardProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const colorNumber = getClassColorNumber(assignment.ClassId);
  const colorClass = colorNumber === -1 ? 'color-default' : `color-${colorNumber}`;
  const { refreshAssignments } = useAssignments();
  const { refreshClasses } = useClasses();

  // Format due date
  const formatDueDate = () => {
    const due = new Date(assignment.DueDate);
    
    return due.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const handleDelete = async () => {
    if (!assignment.Id) return;
    
    setIsDeleting(true);
    const assignmentId = assignment.Id;
    try {
      const response = await fetch("/api/deleteAssignment", {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignmentId })
      });

      if (!response.ok) {
        const responseText = await response.text();
        throw new Error('Failed to delete assignment: ' + responseText);
      }

      //alert(`${assignment.Name} successfully deleted!`);
      if (onDelete) onDelete();
      setConfirmingDelete(false);
      await Promise.all([
        refreshClasses(),
        refreshAssignments(),
      ]);
    } catch (err) {
      console.error(err);
      alert('Failed to delete assignment');
    } finally {
      setIsDeleting(false);
      setConfirmingDelete(false);
    }
  };

  return (
    <>
      <div
        className={`assignment-card ${colorClass} cursor-pointer transition-all hover:shadow-lg relative p-4 ${className}`}
        style={{ opacity: isDone ? 0.6 : 1 }}
        onMouseEnter={() => onHoverChange?.(true)}
        onMouseLeave={() => onHoverChange?.(false)}
        onClick={onEdit}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Class Badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className="class-badge text-xs">
                {assignment.className}
              </span>
            </div>

            {/* Assignment Title */}
            <div className={`assignment-title text-base`}>
              {assignment.Name}
            </div>

            {/* Due Date */}
            {showDueDate && (
              <div className="text-sm text-gray-600 mb-2">
                <strong>Due:</strong> {formatDueDate()}
              </div>
            )}

            {/* Details */}
            {showDetails && assignment.Details && (
              <div className="text-sm text-gray-700 mt-2 p-2 rounded">
                {assignment.Details}
              </div>
            )}
          </div>

          {/* Action Buttons - Show on Hover */}
          {isHovered && (showCheckbox || showDeleteButton) && (
            <div className="flex flex-col gap-2 ml-4">
              {/* Checkbox */}
              {showCheckbox && onMarkDone && (
                <div
                  className="checkbox-wrapper-31"
                  style={{ left: '6px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkDone();
                  }}
                >
                  <input type="checkbox" checked={isDone} readOnly />
                  <svg viewBox="0 0 35.6 35.6">
                    <circle className="background" cx="17.8" cy="17.8" r="17.8"></circle>
                    <circle className="stroke" cx="17.8" cy="17.8" r="14.37"></circle>
                    <polyline
                      className="check"
                      points="11.78 18.12 15.55 22.23 25.17 12.87"
                    ></polyline>
                  </svg>
                </div>
              )}

              {/* Delete Button */}
              {showDeleteButton && onDelete && (
                <div 
                  className="delete-container"
                  onClick={(e) => e.stopPropagation()}
                >
                  <label onClick={() => setConfirmingDelete(true)}>
                    <div className="delete-wrapper">
                      <div className="delete-lid"></div>
                      <div className="delete-can"></div>
                    </div>
                  </label>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmingDelete && (
        <div 
          className="delete-dialog-overlay" 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              e.stopPropagation();
              setConfirmingDelete(false);
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
              <span className="font-bold break-words whitespace-normal block text-wrap" style= {{margin:'12px'}}>
                {assignment.Name}
              </span>
            </p>
            <div className="flex justify-center gap-8 flex-wrap">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="globalButton px-4 py-2 rounded-md"
              >
                {isDeleting ? 'Deleting...' : 'Yes'}
              </button>

              <button
                onClick={() => setConfirmingDelete(false)}
                className="globalButton px-4 py-2 rounded-md"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}