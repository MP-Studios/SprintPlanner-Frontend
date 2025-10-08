"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [timerValue, setTimerValue] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState("Pomodoro");
  const [totalTime, setTotalTime] = useState(25 * 60);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timerValue > 0) {
      interval = setInterval(() => setTimerValue((t) => t - 1), 1000);
    } else if (timerValue === 0) {
      setIsActive(false);
      alert("Time’s up!");
    }
    return () => clearInterval(interval || undefined);
  }, [isActive, timerValue]);

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleModeChange = (newMode: string, minutes: number) => {
    setMode(newMode);
    setTimerValue(minutes * 60);
    setTotalTime(minutes * 60);
    setIsActive(false);
  };

  // Calculate percentage of time left (0–100)
  const progress = (timerValue / totalTime) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#e9f8eb] text-white">
      <h1 className="text-4xl font-bold text-[#3a554c]">Pomodoro Timer</h1>
      <br></br>
        <div className="flex gap-6">
            <button
            className="globalButton rounded px-5 py-2"
            onClick={() => handleModeChange("Pomodoro", 25)}
            >
            Pomodoro
            </button>
            <button
            className="globalButton rounded px-5 py-2"
            onClick={() => handleModeChange("Short Break", 5)}
            >
            Short Break
            </button>
            <button
            className="globalButton rounded px-5 py-2"
            onClick={() => handleModeChange("Long Break", 15)}
            >
            Long Break
            </button>
        </div>
        <br>
        </br>

      {/* Progress Circle */}
      <div>
        <div
            className="w-52 h-52 rounded-full flex items-center justify-center"
            style={{
            background: `conic-gradient(#3a554c ${progress}%, #e9f8eb ${progress}% 100%)`,
            }}
        >
            <div className="w-[88%] h-[88%] bg-[#e9f8eb] rounded-full flex items-center justify-center">
            <h2 className="text-4xl font-bold text-[#3a554c]">
                {formatTime(timerValue)}
            </h2>
            </div>
        </div>
      </div>
      <br>
      </br>
      <div className="flex gap-6">
        <button
          className="globalButton rounded px-6 py-2"
          onClick={() => setIsActive(!isActive)}
        >
          {isActive ? "Pause" : "Start"}
        </button>
        <button
          className="globalButton rounded px-6 py-2"
          onClick={() =>
            handleModeChange(
              mode,
              mode === "Pomodoro" ? 25 : mode === "Short Break" ? 5 : 15
            )
          }
        >
          Reset
        </button>
      </div>
    </div>
  );
}
