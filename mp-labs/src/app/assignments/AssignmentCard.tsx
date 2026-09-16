'use client';

import { useEffect, useState } from "react";
import {
  getClassColorNumber,
  setClassColor,
  getAvailableColors,
  getPaletteColor,
} from '@/app/colors/classColors';
import { useClasses } from '@/app/context/ClassContext';
import { useAssignments } from '@/app/context/AssignmentContext';

export type Assignment = {
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

  isEditing?: boolean;

  onSave?: (assignment: Assignment) => void | Promise<void>;
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
  isEditing: initiallyEditing = false,
  onSave,
  onEdit,
  onMarkDone,
  onDelete,
  onHoverChange,
  className = '',
}: AssignmentCardProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isEditing, setIsEditing] = useState(initiallyEditing);

  const [editedAssignment, setEditedAssignment] =
    useState<Assignment>(assignment);

  const [editedColor, setEditedColor] =
    useState(getClassColorNumber(assignment.ClassId));

  const { classes, refreshClasses } = useClasses();
  const { refreshAssignments } = useAssignments();

  useEffect(() => {
    setEditedAssignment(assignment);
    setEditedColor(getClassColorNumber(assignment.ClassId));
  }, [assignment]);

  const colorNumber = isEditing
    ? editedColor
    : getClassColorNumber(assignment.ClassId);

  const colorClass =
    colorNumber === -1
      ? 'color-default'
      : `color-${colorNumber}`;

  const formatDueDate = () => {
    const dateStr = assignment.DueDate;

    if (!dateStr) return '';

    const match = dateStr.match(
      /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/
    );

    if (!match) return dateStr;

    const [_, year, month, day, hour, minute] = match;

    const displayDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute)
    );

    return displayDate.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const startEditing = () => {
    if (isEditing) return;

    setEditedAssignment(assignment);
    setEditedColor(getClassColorNumber(assignment.ClassId));
    setIsEditing(true);

    onEdit?.();
  };

  const handleCancel = () => {
    setEditedAssignment(assignment);
    setEditedColor(getClassColorNumber(assignment.ClassId));
    setIsEditing(false);
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      if (editedAssignment.ClassId && editedColor !== -1) {
        setClassColor(
          editedAssignment.ClassId,
          editedColor
        );
      }

      if (onSave) {
        await onSave(editedAssignment);
      }

      setIsEditing(false);

      await Promise.all([
        refreshClasses(),
        refreshAssignments(),
      ]);
    } catch (error) {
      console.error("Failed to save assignment:", error);
      alert("Failed to save assignment");
    }
  };

  const handleDelete = async () => {
    if (!assignment.Id) return;

    setIsDeleting(true);

    const assignmentId = assignment.Id;

    try {
      const response = await fetch("/api/deleteAssignment", {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ assignmentId })
      });

      if (!response.ok) {
        const responseText = await response.text();

        throw new Error(
          'Failed to delete assignment: ' + responseText
        );
      }

      onDelete?.();

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

  const handleClassChange = (className: string) => {
    const existingClass = classes?.find(
      (c: any) => c.className === className
    );

    setEditedAssignment(prev => ({
      ...prev,
      className,
      ClassId: existingClass?.id ?? null,
    }));

    /*
     * If this is an existing class, immediately show that
     * class's color while editing.
     */
    if (existingClass?.id) {
      setEditedColor(
        getClassColorNumber(existingClass.id)
      );
    }
  };

  return (
    <>
      <div
        className={`
          assignment-card
          ${colorClass}
          ${!isEditing ? 'cursor-pointer' : ''}
          transition-all
          hover:shadow-lg
          relative
          p-4
          ${className}
        `}
        style={{
          opacity: isDone ? 0.6 : 1
        }}
        onMouseEnter={() => onHoverChange?.(true)}
        onMouseLeave={() => onHoverChange?.(false)}
        onClick={isEditing ? handleCancel : startEditing}
      >

        {/* =====================================================
            MAIN CARD CONTENT
        ===================================================== */}

        <div className="flex items-start justify-between gap-6">

          {/* ===================================================
              LEFT SIDE - ASSIGNMENT INFORMATION
          =================================================== */}

          <div className="flex-1 min-w-0 space-y-4">

            {/* CLASS */}
            <div className="flex items-center gap-2 mb-2">

              {isEditing ? (
                <div className="w-full">

                  <input
                    list={`class-options-${index}`}
                    type="text"
                    value={editedAssignment.className}
                    placeholder="Class"
                    onChange={(e) =>
                      handleClassChange(e.target.value)
                    }
                    onClick={(e) => e.stopPropagation()}
                    className="
                      w-full
                      rounded-md
                      border
                      px-2
                      py-1
                      text-sm
                      bg-white
                    "
                  />

                  <datalist id={`class-options-${index}`}>
                    {classes?.map((c: any) => (
                      <option
                        key={c.ClassId}
                        value={c.className}
                      />
                    ))}
                  </datalist>

                </div>
              ) : (
                <span className="class-badge text-xs">
                  {assignment.className || "No class"}
                </span>
              )}

            </div>

            {/* ASSIGNMENT NAME */}
            {isEditing ? (

              <input
                type="text"
                value={editedAssignment.Name}
                placeholder="Assignment name"
                onChange={(e) =>
                  setEditedAssignment(prev => ({
                    ...prev,
                    Name: e.target.value
                  }))
                }
                onClick={(e) => e.stopPropagation()}
                className="
                  w-full
                  rounded-md
                  border
                  px-2
                  py-1
                  text-base
                  bg-white
                  mb-2
                "
              />

            ) : (

              <div className="assignment-title text-base">
                {assignment.Name}
              </div>

            )}

            {/* DUE DATE */}
            {isEditing ? (

              <input
                type="datetime-local"
                value={editedAssignment.DueDate}
                onChange={(e) =>
                  setEditedAssignment(prev => ({
                    ...prev,
                    DueDate: e.target.value
                  }))
                }
                onClick={(e) => e.stopPropagation()}
                className="
                  rounded-md
                  border
                  px-2
                  py-1
                  text-sm
                  bg-white
                  mb-2
                "
              />

            ) : (

              showDueDate && (
                <div className="text-sm text-gray-600 mb-2">
                  <strong>Due:</strong> {formatDueDate()}
                </div>
              )

            )}

            {/* DETAILS */}
            {isEditing ? (

              <textarea
                value={editedAssignment.Details}
                placeholder="Details"
                onChange={(e) =>
                  setEditedAssignment(prev => ({
                    ...prev,
                    Details: e.target.value
                  }))
                }
                onClick={(e) => e.stopPropagation()}
                className="
                  w-full
                  rounded-md
                  border
                  px-2
                  py-1
                  text-sm
                  bg-white
                  resize-none
                "
                rows={3}
              />

            ) : (

              showDetails &&
              assignment.Details && (
                <div className="text-sm text-gray-700 mt-2 p-2 rounded">
                  {assignment.Details}
                </div>
              )

            )}

          </div>

          {/* ===================================================
              RIGHT SIDE - CLASS COLOR
          =================================================== */}

          {isEditing && (
            <div
              className="
                flex-shrink-0
                pt-1
              "
              onClick={(e) => e.stopPropagation()}
            >

              <div className="text-xs font-semibold mb-2">
                Class Color
              </div>

              <div className="flex gap-2 flex-wrap max-w-[220px]">

                {getAvailableColors().map((color) => {

                  const selected =
                    editedColor === color;

                  const paletteColor =
                    getPaletteColor(color);

                  if (!paletteColor) {
                    return null;
                  }

                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() =>
                        setEditedColor(color)
                      }
                      className={`
                        w-7
                        h-7
                        rounded-full
                        border-2
                        ${selected
                          ? 'border-black scale-110'
                          : 'border-transparent'}
                        transition-transform
                        flex-shrink-0
                      `}
                      style={{
                        backgroundColor:
                          paletteColor.background,
                      }}
                      aria-label={`Color ${color}`}
                    />
                  );
                })}

              </div>

            </div>
          )}

          {/* ===================================================
              NORMAL CARD ACTIONS
          =================================================== */}

          {!isEditing &&
            isHovered &&
            (showCheckbox || showDeleteButton) && (

              <div className="flex flex-col gap-2 ml-4">

                {showCheckbox && onMarkDone && (
                  <div
                    className="checkbox-wrapper-31"
                    style={{ left: '6.5px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkDone();
                    }}
                  >

                    <input
                      type="checkbox"
                      checked={isDone}
                      readOnly
                    />

                    <svg viewBox="0 0 35.6 35.6">

                      <circle
                        className="background"
                        cx="17.8"
                        cy="17.8"
                        r="17.8"
                      />

                      <circle
                        className="stroke"
                        cx="17.8"
                        cy="17.8"
                        r="14.37"
                      />

                      <polyline
                        className="check"
                        points="11.78 18.12 15.55 22.23 25.17 12.87"
                      />

                    </svg>

                  </div>
                )}

                {showDeleteButton && onDelete && (
                  <div
                    className="delete-container"
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                  >

                    <label
                      onClick={() =>
                        setConfirmingDelete(true)
                      }
                    >

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

        {/* =====================================================
            SAVE / CANCEL
        ===================================================== */}

        {isEditing && (
          <div
            className="flex gap-2 mt-4"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              type="button"
              onClick={handleSave}
              className="globalButton px-4 py-2 rounded-md"
            >
              Save
            </button>
{/* 
            <button
              type="button"
              onClick={handleCancel}
              className="globalButton px-4 py-2 rounded-md"
            >
              Cancel
            </button> */}

          </div>
        )}

      </div>

      {/* =======================================================
          DELETE CONFIRMATION
      ======================================================= */}

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
            className="
              modalClass
              delete-dialog
              show
              z-50
              rounded-2xl
              shadow-lg
              flex
              flex-col
              items-center
              justify-center
              max-w-[90%]
              sm:max-w-[400px]
              mx-auto
              p-4
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <p
              className="
                text-lg
                font-semibold
                mb-4
                text-center
                break-words
                whitespace-normal
                w-full
              "
            >

              Are you sure you want to delete
              <br />

              this assignment:{' '}

              <span
                className="
                  font-bold
                  break-words
                  whitespace-normal
                  block
                "
                style={{
                  margin: '12px'
                }}
              >
                {assignment.Name}
              </span>

            </p>

            <div
              className="
                flex
                justify-center
                gap-8
                flex-wrap
              "
            >

              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="
                  globalButton
                  px-4
                  py-2
                  rounded-md
                "
              >
                {isDeleting
                  ? 'Deleting...'
                  : 'Yes'}
              </button>

              <button
                onClick={() =>
                  setConfirmingDelete(false)
                }
                className="
                  globalButton
                  px-4
                  py-2
                  rounded-md
                "
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