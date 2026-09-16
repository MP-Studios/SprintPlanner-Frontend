'use client'
import { useState, useRef, useEffect } from "react"
import Assignments from "./assignments"
import EditAssignments from "./editAssignmentView"
// import Assignments from "./assignment"
import { FC, ReactNode } from "react";
import AssignmentCard from "./AssignmentCard";
import {Assignment} from "./AssignmentCard";
export default function AssignmentContainer() {
    const [showAlternativeView, setShowAlternativeView] = useState(false);
const temp: Assignment = {
  className: "",
  Name: "",
  DueDate: "",
  Details: "",
  ClassId: null,
  Status: 0,
};
    return (
        <div className="assignment p-6 bg-white shadow-lg flex flex-col">
            <div className="flex items-center justify-between mb-4 ">
            <h1 className="text-xl font-semibold flex-grow">Your Assignments</h1>
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
                {/* <EditAssignments/> */}
            {/* </div> */}
            {showAlternativeView && (
     
                <AssignmentCard
                    assignment={temp}
                    index={0}
                    isEditing={true}
                    isDone={false}
                    isHovered={false}
                    showDetails={true}
                    showDueDate={true}
                        showCheckbox={true}
                    showDeleteButton={true}
                    onEdit={() => {
                        
                    }}
                    onMarkDone={() => null}
                    onDelete={async () => {
                      // Only refresh after delete, not after edit
                      // (delete needs full refresh to recalculate indices)
                    }}
                    onHoverChange={(hovered) => null}
                 
            // </div>
            />
            )}
            <EditAssignments/>
             </div> 
        </div>
    );    
}