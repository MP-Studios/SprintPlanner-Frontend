'use client'
import { useState } from "react"
import Assignments from "./assignments"
import EditAssignments from "./editAssignmentView"
// import Assignments from "./assignment"
import { FC, ReactNode } from "react";

export default function AssignmentContainer() {
    const [showAlternativeView, setShowAlternativeView] = useState(false);

    return (
        <div className="assignment p-6 bg-white shadow-lg h-screen flex flex-col">
            <div className="flex items-center justify-end mb-4">
            <label className="collection">
                <input 
                    type="checkbox"
                    checked={showAlternativeView}
                    onChange={(e) => setShowAlternativeView(e.target.checked)}
                />
                <div>
                    <span></span>
                </div>
            </label>
            <a className="dribbble" 
            href="https://dribbble.com/shots/4788602-Add-to-Collection-Animation" target="_blank">
            </a>
            </div>
            <div className="flex-grow mb-4">
                <EditAssignments/>
            </div>
            {showAlternativeView && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="newAssignmentModal bg-gray-50 rounded-2xl w-[500px] max-h-[80vh] relative overflow-y-auto">
                    <h2 className="mb-4 text-xl font-bold text-black text-center">Create New Assignment</h2>
                    <Assignments/>
                    <button
                        onClick={() => setShowAlternativeView(false)}
                        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                        ✕
                    </button>
                </div>
            </div>
            )}
        </div>
    );

    
}