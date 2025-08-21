'use client'
import { useState } from "react"
import AssignmentsPage from "./assignment"
import EditAssignments from "./editAssignmentView"

export default function AssignmentContainer() {
    const [showAlternativeView, setShowAlternativeView] = useState(false);

    return (
        <div className="assignment p-6 bg-[var(--surface)] shadow-lg h-screen flex flex-col text-[var(--foreground)]">
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => setShowAlternativeView(v => !v)}
                    className="mt-auto bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--text-on-primary)] px-4 py-2 rounded"
                >
                    {showAlternativeView ? 'Create Assignments' : 'Edit Assignments'}
                </button>
            </div>
            <div className="flex-grow mb-4">
                {showAlternativeView ? <AssignmentsPage /> : <EditAssignments />}
            </div>
        </div>
    );

}