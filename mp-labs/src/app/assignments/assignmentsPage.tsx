'use client'
import { useState } from "react"
import AssignmentsPage from "./assignment"
import EditAssignments from "./editAssignmentView"
import { FC, ReactNode } from "react";

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
                <img src="https://cdn.dribbble.com/assets/dribbble-ball-1col-dnld-e29e0436f93d2f9c430fde5f3da66f94493fdca66351408ab0f96e2ec518ab17.png" 
                alt="" />
            </a>
            </div>
            <div className="flex-grow mb-4">
                <AssignmentsPage/>
            </div>
        </div>
    );

    
}