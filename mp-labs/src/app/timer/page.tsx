"use client";
import { useTimer } from "./TimerContext";
import { useState, useEffect } from "react";

export default function Page() {
  const { timerValue, isActive, mode, totalTime, repeatSound, setIsActive, setRepeatSound, resetTimer, stopSound } = useTimer();
  
  // Default times in minutes
  const [pomodoroTime, setPomodoroTime] = useState(25);
  const [shortBreakTime, setShortBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleModeChange = (newMode: "Pomodoro" | "Short Break" | "Long Break", minutes: number) => {
    resetTimer(newMode, minutes);
  };

  // Calculate percentage of time left (0–100)
  const progress = (timerValue / totalTime) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#e9f8eb] text-white py-20">
      <h1 className="text-6xl font-bold text-[#3a554c]">Pomodoro Timer</h1>
      
      <div className="flex gap-16 mb-24">
        <div className="flex flex-col items-center gap-3">
          <button
            className="globalButton rounded px-8 py-4 text-xl"
            onClick={() => handleModeChange("Pomodoro", pomodoroTime)}
          >
            Pomodoro
          </button>
          <input
            type="number"
            min="1"
            max="120"
            value={pomodoroTime}
            onChange={(e) => setPomodoroTime(Number(e.target.value))}
            className="w-20 text-center border-2 border-[#3a554c] rounded px-2 py-1 text-[#3a554c] bg-white"
            placeholder="25"
          />
          <span className="text-sm text-[#3a554c]">minutes</span>
        </div>
        
        <div className="flex flex-col items-center gap-3">
          <button
            className="globalButton rounded px-8 py-4 text-xl"
            onClick={() => handleModeChange("Short Break", shortBreakTime)}
          >
            Short Break
          </button>
          <input
            type="number"
            min="1"
            max="60"
            value={shortBreakTime}
            onChange={(e) => setShortBreakTime(Number(e.target.value))}
            className="w-20 text-center border-2 border-[#3a554c] rounded px-2 py-1 text-[#3a554c] bg-white"
            placeholder="5"
          />
          <span className="text-sm text-[#3a554c]">minutes</span>
        </div>
        
        <div className="flex flex-col items-center gap-3">
          <button
            className="globalButton rounded px-8 py-4 text-xl"
            onClick={() => handleModeChange("Long Break", longBreakTime)}
          >
            Long Break
          </button>
          <input
            type="number"
            min="1"
            max="60"
            value={longBreakTime}
            onChange={(e) => setLongBreakTime(Number(e.target.value))}
            className="w-20 text-center border-2 border-[#3a554c] rounded px-2 py-1 text-[#3a554c] bg-white"
            placeholder="15"
          />
          <span className="text-sm text-[#3a554c]">minutes</span>
        </div>
      </div>

      {/* Progress Circle */}
      <div className="mb-20">
        <div
          className="w-80 h-80 rounded-full flex items-center justify-center"
          style={{
            background: `conic-gradient(#3a554c ${progress}%, #e9f8eb ${progress}% 100%)`,
          }}
        >
          <div className="w-[88%] h-[88%] bg-[#e9f8eb] rounded-full flex items-center justify-center">
            <h2 className="text-7xl font-bold text-[#3a554c]">
              {formatTime(timerValue)}
            </h2>
          </div>
        </div>
      </div>
      
      {/* Timer Status Indicator */}
      <div className="text-center mb-16">
        <p className="text-2xl font-semibold text-[#3a554c]">
          {mode}
          {isActive && <span className="ml-2 text-lg">(Running)</span>}
        </p>
      </div>

      <div className="flex gap-16 mb-8">
        <button
          className="globalButton rounded px-10 py-4 text-xl"
          onClick={() => setIsActive(!isActive)}
        >
          {isActive ? "Pause" : "Start"}
        </button>
        <button
          className="globalButton rounded px-10 py-4 text-xl"
          onClick={() => {
            const currentModeTime = 
              mode === "Pomodoro" ? pomodoroTime : 
              mode === "Short Break" ? shortBreakTime : 
              longBreakTime;
            handleModeChange(mode, currentModeTime);
          }}
        >
          Reset
        </button>
      </div>
      
      {/* Repeat Sound Toggle - moved here for better visibility */}
      <div className="flex items-center gap-3 mb-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={repeatSound}
            onChange={(e) => setRepeatSound(e.target.checked)}
            className="w-5 h-5 accent-[#3a554c] cursor-pointer"
          />
          <span className="text-xl font-medium text-[#3a554c]">Repeat sound until stopped</span>
        </label>
      </div>
      
      {/* Stop Sound Button - only show if timer is at 0 AND repeat is enabled */}
      {timerValue === 0 && repeatSound && (
        <button
          className="globalButton rounded px-10 py-4 text-xl bg-red-400 hover:bg-red-500"
          onClick={stopSound}
        >
          Stop Sound
        </button>
      )}
    </div>
  );
}