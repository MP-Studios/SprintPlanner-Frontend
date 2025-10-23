'use client'
import { useState, useRef, useEffect } from "react"
import Assignments from "./assignments"
import EditAssignments from "./editAssignmentView"
// import Assignments from "./assignment"
import { FC, ReactNode } from "react";

export default function AssignmentContainer() {
    const [showAlternativeView, setShowAlternativeView] = useState(false);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const checkboxRef = useRef<HTMLLabelElement | null>(null);
    <Assignments onClose={() => setShowAlternativeView(false)} />

    useEffect(() => {
        if (showAlternativeView && checkboxRef.current) {
            const rect = checkboxRef.current.getBoundingClientRect();
            setModalPosition({
                top: rect.top + window.scrollY,
                left: rect.right + 16,
            });
        }
    }, [showAlternativeView]);

    return (
        <div className="assignment p-6 bg-white shadow-lg h-screen flex flex-col">
            <div className="flex items-center justify-end mb-4">
            <label className="collection" ref={checkboxRef}>
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
            <div 
                className="absolute newAssignmentModal modalClass z-50 rounded-2xl shadow-lg w-96 h-80 flex flex-col"
                style={{
                    top: modalPosition.top,
                    left: modalPosition.left,
                }}
                >
                    <h2 className="mb-4 text-xl font-bold text-black text-center">Create New Assignment</h2>
                    <Assignments onClose={() => setShowAlternativeView(false)}/>
                    <button
                        onClick={() => setShowAlternativeView(false)}
                        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                        ✕
                    </button>
                </div>
            )}
        </div>
    );

    
}