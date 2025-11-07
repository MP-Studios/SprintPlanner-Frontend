"use client";
import { useTimer } from "./TimerContext";

export default function Page() {
  const { timerValue, isActive, mode, totalTime, setIsActive, resetTimer } = useTimer();

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
      <h1 className="text-6xl font-bold text-[#3a554c] mb-24">Pomodoro Timer</h1>
      
      <div className="flex gap-16 mb-24">
        <button
          className="globalButton rounded px-8 py-4 text-xl"
          onClick={() => handleModeChange("Pomodoro", 25)}
        >
          Pomodoro
        </button>
        <button
          className="globalButton rounded px-8 py-4 text-xl"
          onClick={() => handleModeChange("Short Break", 5)}
        >
          Short Break
        </button>
        <button
          className="globalButton rounded px-8 py-4 text-xl"
          onClick={() => handleModeChange("Long Break", 15)}
        >
          Long Break
        </button>
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

      <div className="flex gap-16">
        <button
          className="globalButton rounded px-10 py-4 text-xl"
          onClick={() => setIsActive(!isActive)}
        >
          {isActive ? "Pause" : "Start"}
        </button>
        <button
          className="globalButton rounded px-10 py-4 text-xl"
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

