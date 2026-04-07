'use client';

import { useStats } from '@/app/context/StatsContext';
import { getClassColorNumber } from '@/app/colors/classColors';
import { useState, useEffect } from 'react';
import { useLoading } from '../context/LoadingContext';

type ClassStats = {
  total: number;
  completed: number;
  className: string;
  classId: string | null;
};

export default function StatsPage() {
  const { assignments, loading, error } = useStats();
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    if (loading) {
      showLoading("Loading statistics...");
    } else {
      hideLoading();
    }
  }, [loading, showLoading, hideLoading]);

  // Calculate stats from assignments - now using Status field from database
  const total = assignments.length;
  const completed = assignments.filter(a => a.Status === 1).length;

  // Group by class
  const byClassMap: Record<string, ClassStats> = {};
  
  assignments.forEach((assignment) => {
    const className = assignment.className || 'Unassigned';
    const classId = assignment.ClassId || null;
    const key = classId || 'unassigned';
    
    if (!byClassMap[key]) {
      byClassMap[key] = { 
        total: 0, 
        completed: 0,
        className: className,
        classId: classId
      };
    }
    
    byClassMap[key].total++;
    if (assignment.Status === 1) {
      byClassMap[key].completed++;
    }
  });

  const byClass = Object.values(byClassMap);

  // Get current view stats (either overall or filtered by class)
  let displayTotal = total;
  let displayCompleted = completed;
  let displayClassName = 'All Classes';
  let displayClassId: string | null = null;

  if (selectedClass !== 'all') {
    const classData = byClass.find(c => (c.classId || 'unassigned') === selectedClass);
    if (classData) {
      displayTotal = classData.total;
      displayCompleted = classData.completed;
      displayClassName = classData.className;
      displayClassId = classData.classId;
    }
  }

  const displayPending = displayTotal - displayCompleted;
  const completionRate = displayTotal > 0 
    ? Math.round((displayCompleted / displayTotal) * 100) 
    : 0;

  // Calculate pie chart segments
  const completedDegrees = displayTotal > 0 ? (displayCompleted / displayTotal) * 360 : 0;

  // Get color class for the selected class (for pie chart)
  const colorNumber = displayClassId ? getClassColorNumber(displayClassId) : -1;
  const pieChartCompletedColor = colorNumber === -1 ? '#10b981' : getPieChartColor(colorNumber);

  return (
    <div className="min-h-screen bg-[#e9f8eb] flex items-center justify-center p-8">
      <div className="w-full max-w-5xl">
        <h1 className="text-4xl font-bold text-[#3a554c] mb-8 text-center">Sprint Statistics</h1>

        {/* Class Filter Dropdown */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <label className="block text-sm font-medium text-[#3a554c] mb-2">
            Filter by Class:
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-[#3a554c] font-medium focus:outline-none focus:ring-2 focus:ring-[#a2c9b8] focus:border-transparent"
          >
            <option value="all">All Classes</option>
            {byClass.map((classData) => (
              <option key={classData.classId || 'unassigned'} value={classData.classId || 'unassigned'}>
                {classData.className}
              </option>
            ))}
          </select>
        </div>

        {/* Main Stats Display */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-[#3a554c] mb-6 text-center">
            {displayClassName}
          </h2>

          {/* Pie Chart */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-64 h-64 mb-6">
              {/* SVG Pie Chart */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle (pending) */}
                {completionRate < 100 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#BBBBBB"
                      strokeWidth="20"
                    />
                  )}
                {/* Completed segment */}
                {displayTotal > 0 && (
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={pieChartCompletedColor}
                    strokeWidth="20"
                    strokeLinecap="round"
                    strokeDasharray={completionRate === 100 ? '251.2 251.2' : `${(completedDegrees / 360) * 251.2} 251.2`}
                    className="transition-all duration-1000"
                  />
                )}
              </svg>
              
              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#3a554c]">
                    {completionRate}%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Complete</div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded" 
                  style={{ backgroundColor: pieChartCompletedColor }}
                />
                <span className="font-medium">
                  Completed: <span className="text-[#3a554c] font-bold">{displayCompleted}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#BBBBBB] rounded"></div>
                <span className="font-medium">
                  Pending: <span className="text-[#3a554c] font-bold">{displayPending}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-900">{displayTotal}</div>
              <div className="text-sm text-blue-600 mt-1">Total</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-900">{displayCompleted}</div>
              <div className="text-sm text-green-600 mt-1">Completed</div>
            </div>
            <div className="bg-[#CCCCCC] rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-[#545454]">{displayPending}</div>
              <div className="text-sm text-[#555555] mt-1">Pending</div>
            </div>
          </div>
        </div>

        {/* Class Breakdown (when viewing all classes) */}
        {selectedClass === 'all' && byClass.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-[#3a554c] mb-6">Breakdown by Class</h2>
            <div className="space-y-4">
              {byClass.map((classData) => {
                const classRate = classData.total > 0
                  ? Math.round((classData.completed / classData.total) * 100)
                  : 0;

                const colorNum = getClassColorNumber(classData.classId);
                const progressBarColor = getProgressBarColor(colorNum);

                return (
                  <div 
                    key={classData.classId || 'unassigned'}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedClass(classData.classId || 'unassigned')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-[#3a554c]">{classData.className}</h3>
                      <span className="text-sm text-gray-600">
                        {classData.completed}/{classData.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${classRate}%`,
                          backgroundColor: progressBarColor
                        }}
                      />
                    </div>
                    <div className="text-right text-sm text-gray-600 mt-1">
                      {classRate}% complete
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to get pie chart color based on class color number
// These match the exact colors from globals.css (the hover/border colors)
function getPieChartColor(colorNumber: number): string {
  const colors: Record<number, string> = {
    0: '#66C7F4',  // Blue (color-0)
    1: '#a082fb',  // Purple (color-1)
    2: '#86EFAC',  // Green (color-2)
    3: '#FFB347',  // Orange (color-3)
    4: '#F9A8D4',  // Pink (color-4)
    5: '#5EEAD4',  // Teal (color-5)
    6: '#FACC15',  // Yellow (color-6)
    7: '#FB7185',  // Rose (color-7)
  };
  return colors[colorNumber] || '#10b981'; // Default green if no class selected
}

// Helper function to get progress bar color based on class color number
// These match the exact colors from globals.css (the hover/border colors)
function getProgressBarColor(colorNumber: number): string {
  const colors: Record<number, string> = {
    0: '#66C7F4',  // Blue (color-0)
    1: '#a082fb',  // Purple (color-1)
    2: '#86EFAC',  // Green (color-2)
    3: '#FFB347',  // Orange (color-3)
    4: '#F9A8D4',  // Pink (color-4)
    5: '#5EEAD4',  // Teal (color-5)
    6: '#FACC15',  // Yellow (color-6)
    7: '#FB7185',  // Rose (color-7)
  };
  return colors[colorNumber] || '#a2c9b8'; // Default to your app color
}
