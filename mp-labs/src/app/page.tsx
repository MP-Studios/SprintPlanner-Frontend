'use client'

import CalendarView from "./calendar/page";
import AssignmentContainer from "./assignments/assignmentsPage";
import { useLoading } from "./context/LoadingContext";
import { useEffect, useState, useRef } from "react";

export default function Dashboard() {
    const { showLoading, hideLoading } = useLoading()
    const [sidebarWidth, setSidebarWidth] = useState(35); // percentage
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        showLoading('Loading your dashboard...');
        const timer = setTimeout(() => {
            hideLoading();
        }, 1500);
        
        return () => clearTimeout(timer);
    }, []);
    
    // Handle mouse move during drag
    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
          if (!isDragging || !containerRef.current) return;
          
          const containerWidth = containerRef.current.offsetWidth;
          const newWidth = (e.clientX / containerWidth) * 100;
          
          // If dragged to less than 10%, close the sidebar
          if (newWidth < 10) {
              setIsSidebarOpen(false);
              setSidebarWidth(35); // Reset to default for next open
          } else if (newWidth >= 10 && newWidth <= 60) {
              setIsSidebarOpen(true);
              setSidebarWidth(newWidth);
          }
      };

      const handleMouseUp = () => {
          setIsDragging(false);
      };

      if (isDragging) {
          document.addEventListener('mousemove', handleMouseMove);
          document.addEventListener('mouseup', handleMouseUp);
      }

      return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
      };
  }, [isDragging]);
  
  return (
    <div ref={containerRef} className="flex h-full relative">
      {/* Left: assignments - resizable */}
      <div 
        className="h-full overflow-auto transition-all"
        style={{ 
          width: isSidebarOpen ? `${sidebarWidth}%` : '0%',
          transition: isDragging ? 'none' : 'width 0.3s'
        }}
      >
        {isSidebarOpen && <AssignmentContainer/>}
      </div>

      {/* Resize handle - draggable divider */}
      {isSidebarOpen && (
        <div
          onMouseDown={() => setIsDragging(true)}
          className="w-1 bg-gray-300 hover:bg-[#a2c9b8] cursor-col-resize transition-colors flex-shrink-0 relative group"
          style={{ cursor: 'col-resize' }}
        >
          {/* Visual indicator on hover */}
          <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-[#a2c9b8] group-hover:opacity-20" />
        </div>
      )}

      {/* Show a small handle when sidebar is closed */}
      {!isSidebarOpen && (
        <div
          onMouseDown={() => {
            setIsSidebarOpen(true);
            setIsDragging(true);
          }}
          className="w-2 bg-gray-200 hover:bg-[#a2c9b8] cursor-col-resize transition-colors flex-shrink-0 relative group"
          style={{ cursor: 'col-resize' }}
          title="Drag to open sidebar"
        >
          {/* Visual indicator */}
          <div className="absolute inset-y-0 left-0 right-0 group-hover:bg-[#a2c9b8] group-hover:opacity-30" />
        </div>
      )}

      {/* Right: calendar - adjusts to remaining space */}
      <div 
        className="h-full"
        style={{ 
          width: isSidebarOpen ? `${100 - sidebarWidth}%` : '100%',
          transition: isDragging ? 'none' : 'width 0.3s'
        }}
      >
        <CalendarView />
      </div>
    </div>
  );
}