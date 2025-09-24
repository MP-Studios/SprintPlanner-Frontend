'use client'
import { useState } from "react"
import AssignmentsPage from "./assignment"
import EditAssignments from "./editAssignmentView"
import { FC, ReactNode } from "react";
// import  Modal  from "react-bootstrap";
// import Draggable from "react-dragsgable";

export default function AssignmentContainer() {
    const [showAlternativeView, setShowAlternativeView] = useState(false);

    return (
        <div className="assignment p-6 bg-white shadow-lg h-screen flex flex-col">
            <div className="flex items-center justify-end mb-4">
            <label className="collection">
                <input type="checkbox" />
                <div>
                    <span></span>
                </div>
            </label>
            <a className="dribbble" 
            href="https://dribbble.com/shots/4788602-Add-to-Collection-Animation" target="_blank">
            </a>
            </div>
            <div className="flex-grow mb-4">
                <AssignmentsPage/>
            </div>
        </div>
    );

    
}