'use client';

import { useState, useRef } from "react";
import Calendar from "./calendarSprintView";
import loadata from "../auth/loadData";
import { useClasses } from "../context/ClassContext";
import { useAssignments } from '@/app/context/AssignmentContext';
import { useLoading } from '../context/LoadingContext';

export default function AssignmentContainer() {
  const [icsLink, setIcsLink] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { refreshClasses } = useClasses();
  const { refreshAssignments } = useAssignments();
  const { showLoading, hideLoading } = useLoading();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleLinkUpload = async () => {
    const feedUrl = icsLink.trim();
    
    if (!feedUrl) return;

    try {
      showLoading("Saving assignments from calendar link...");
      setShowModal(false);

      const userId = await loadata();

      const response = await fetch("/api/saveAssignmentFromLink", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userId}`
        },
        body: JSON.stringify({ icsLink: feedUrl }),
      });

      if (response.ok && (await response.text()).toLowerCase() === 'true') {
        console.log("Assignments saved successfully from link!");
        
        await Promise.all([
          refreshAssignments(),
          refreshClasses()
        ]);

        setIcsLink("");
      } else {
        throw new Error("Failed to save assignments from link.");
      }

      hideLoading();
    } catch (error) {
      console.error("Error saving assignments from link:", error);
      hideLoading();
    }
  };

  return (
    <div className="assignment p-6 bg-white shadow-lg flex flex-col relative">
      {/* Upload Link Button */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="globalButton px-4 py-2 rounded"
        >
          Upload Link
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg mx-4">
            <h2 className="text-xl font-semibold mb-3">Upload Calendar Link</h2>
            <p className="text-sm text-gray-600 mb-6">
              Paste your Canvas calendar feed link below
            </p>
            <input
              ref={inputRef}
              type="text"
              placeholder="https://canvas.example.com/feeds/..."
              value={icsLink}
              onChange={(e) => setIcsLink(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowModal(false);
                  setIcsLink("");
                }}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 rounded hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLinkUpload}
                className="globalButton px-6 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!icsLink.trim()}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calendar */}
      <div className="flex-grow">
        <Calendar/>
      </div>
    </div>
  );
}