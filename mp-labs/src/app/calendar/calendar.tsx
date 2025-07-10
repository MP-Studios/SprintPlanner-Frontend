"use client"
import { useState, useEffect } from "react";
import DailyCalendar from "./dailyAssignmentView";
import Daily from "../favicon.ico";
import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key')


const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];


const isLeapYear = (year: number) =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

const getFebDays = (year: number) => (isLeapYear(year) ? 29 : 28);

export default function Calendar() {
  const [showAlternativeView, setShowAlternativeView] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [showMonthList, setShowMonthList] = useState(false);
  const [time, setTime] = useState(new Date());

  // Days in each month
  const daysOfMonth = [
    31,
    getFebDays(currentYear),
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Generate days array with blanks for first day offset
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const totalDays = daysOfMonth[currentMonth];
  const daysArray = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    daysArray.push(null); // empty slots for offset
  }
  for (let day = 1; day <= totalDays; day++) {
    daysArray.push(day);
  }

  const today = new Date();

  const toggleMonthList = () => setShowMonthList(!showMonthList);

  const selectMonth = (index: number) => {
    setCurrentMonth(index);
    setShowMonthList(false);
  };

  return (
    <div className="calendar p-6 bg-white shadow-lg overflow-hidden h-screen ml-auto">
      <div className="calendar-header flex justify-between items-center mb-4">

        
        <span
          className="month-picker cursor-pointer font-semibold text-lg"
          onClick={toggleMonthList}
        >
          {monthNames[currentMonth]}
        </span>
        <div className="year-picker flex items-center space-x-4">
          <button
            onClick={() => setCurrentYear((y) => y - 1)}
            className="year-change cursor-pointer px-2 rounded hover:bg-gray-200"
          >
            &lt;
          </button>
          <span id="year" className="font-semibold text-lg">{currentYear}</span>
          <button
            onClick={() => setCurrentYear((y) => y + 1)}
            className="year-change cursor-pointer px-2 rounded hover:bg-gray-200"
          >
            &gt;
          </button>
        </div>
      </div>

      {showMonthList && (
        <div className="month-list grid grid-cols-3 gap-2 mb-4">
          {monthNames.map((name, idx) => (
            <div
              key={name}
              className="cursor-pointer p-2 rounded hover:bg-blue-100 text-center"
              onClick={() => selectMonth(idx)}
            >
              {name}
            </div>
          ))}
        </div>
      )}

      <div className="calendar-week-days grid grid-cols-7 text-center font-medium mb-2 text-gray-700">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="flex items-left justify-left">{d}</div>
        ))}
      </div>

      <div className="calendar-days grid grid-cols-7 gap-1 text-center h-100">
        {daysArray.map((day, idx) =>
          day ? (
            <div
              key={idx}
              className={`p-2 rounded  h-50 flex items-center justify-center ${
                day === today.getDate() &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear()
                  ? "bg-blue-500 text-white font-bold"
                  : "text-gray-800"
              }`}
            >
              {day}
            </div>
          ) : (
            <div key={idx} />
          )
        )}
      </div>

      <div className="date-time-formate mt-6 text-center space-y-2">
        {showAlternativeView ? <AlternateView /> : <DefaultView />}
        <button
        onClick={() => setShowAlternativeView(!showAlternativeView)}
        className="bg-#c5e7f5 text-black px-4 py-2 rounded hover:bg-blue-600"
      >
        {showAlternativeView ? (
         <img src={"../favicon.ico"} alt="Alt icon" width={24} height={24} />
        ) : (
          <img src={"../favicon.ico"} alt="Default icon" width={24} height={24} />
            )}
      </button>
        
       
      </div>
    </div>


  );
}


function DefaultView(){
  return <p></p>
}

function AlternateView(){
  return  <DailyCalendar /> //</div>
}
