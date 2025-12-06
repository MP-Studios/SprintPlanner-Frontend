"use client"

import CalendarView from "./calendar/page";
import AssignmentContainer from "./assignments/assignmentsPage";
import { useLoading } from "./context/LoadingContext";
import { useEffect, useState, useRef } from "react";

export default function Dashboard() {
    const { showLoading, hideLoading } = useLoading();

    const [leftWidth, setLeftWidth] = useState(35); // % width
    const [isLeftOpen, setIsLeftOpen] = useState(true);
    const [isRightOpen, setIsRightOpen] = useState(true);

    const [isDragging, setIsDragging] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        showLoading('Loading your dashboard...');
        const timer = setTimeout(() => hideLoading(), 1500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !containerRef.current) return;

            const containerWidth = containerRef.current.offsetWidth;
            const percentLeft = (e.clientX / containerWidth) * 100;

            if (percentLeft < 20) {
                setIsLeftOpen(false);
                setLeftWidth(20);
                setIsRightOpen(true);
                return;
            }

            if (percentLeft > 70) {
                setIsRightOpen(false);
                setIsLeftOpen(true);
                setLeftWidth(100);
                return;
            }

            setIsLeftOpen(true);
            setIsRightOpen(true);
            setLeftWidth(percentLeft);
        };

        const handleMouseUp = () => setIsDragging(false);

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
      <div 
          ref={containerRef} 
          className="flex h-full w-full relative"
          style={{ 
              userSelect: isDragging ? 'none' : 'auto',
              WebkitUserSelect: isDragging ? 'none' : 'auto'
          }}
      >
  
          {/* LEFT PANEL */}
          <div
              className="h-full overflow-auto transition-all"
              style={{ 
                  width: isLeftOpen ? `${leftWidth}%` : '0%', 
                  transition: isDragging ? 'none' : 'width 0.3s',
                  userSelect: isDragging ? 'none' : 'auto',
                  WebkitUserSelect: isDragging ? 'none' : 'auto',
                  pointerEvents: isDragging ? 'none' : 'auto'
              }}
          >
              {isLeftOpen && <AssignmentContainer />}
          </div>
  
          {/* LEFT HANDLE WHEN CLOSED */}
          {!isLeftOpen && (
              <div
                  onMouseDown={() => { setIsLeftOpen(true); setLeftWidth(35); setIsDragging(true); }}
                  className="w-4 bg-gray-200 hover:bg-[#a2c9b8] cursor-col-resize flex-shrink-0"
                  title="Drag to open assignments"
              />
          )}
  
          {/* MIDDLE DIVIDER */}
          {isLeftOpen && isRightOpen && (
              <div
                  onMouseDown={() => setIsDragging(true)}
                  className="w-2 bg-gray-300 hover:bg-[#a2c9b8] cursor-col-resize flex-shrink-0"
              />
          )}
  
          {/* RIGHT PANEL */}
          <div
              className="h-full overflow-auto transition-all"
              style={{ 
                  width: isRightOpen ? `${100 - (isLeftOpen ? leftWidth : 0)}%` : '0%', 
                  transition: isDragging ? 'none' : 'width 0.3s',
                  userSelect: isDragging ? 'none' : 'auto',
                  WebkitUserSelect: isDragging ? 'none' : 'auto',
                  pointerEvents: isDragging ? 'none' : 'auto'
              }}
          >
              {isRightOpen && <CalendarView />}
          </div>
  
          {/* RIGHT HANDLE WHEN CLOSED */}
          {!isRightOpen && (
              <div
                  onMouseDown={() => { setIsRightOpen(true); setLeftWidth(65); setIsDragging(true); }}
                  className="w-4 bg-gray-200 hover:bg-[#a2c9b8] cursor-col-resize flex-shrink-0"
                  title="Drag to open calendar"
              />
          )}
  
      </div>
  );
}