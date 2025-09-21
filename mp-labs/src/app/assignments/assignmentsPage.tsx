'use client'
import { useState } from "react"
//import AssignmentsPage from "./assignment"
import EditAssignments from "./editAssignmentView"
import Assignments from "./assignment"
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
                <img src="https://cdn.dribbble.com/assets/dribbble-ball-1col-dnld-e29e0436f93d2f9c430fde5f3da66f94493fdca66351408ab0f96e2ec518ab17.png" 
                alt="" />
            </a>
            </div>
            <div className="flex-grow mb-4">
                <EditAssignments/>
            </div>
            {showAlternativeView && (
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-50 p-6 rounded-2xl w-[500px] max-h-[40vh] relative overflow-hidden">
                    <h2 className="text-lg font-bold mb-4 text-black">Create new assignment</h2>
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