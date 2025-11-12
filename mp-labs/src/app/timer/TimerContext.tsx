'use client';

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

type TimerMode = 'Pomodoro' | 'Short Break' | 'Long Break';

type TimerContextType = {
  timerValue: number;
  isActive: boolean;
  mode: TimerMode;
  totalTime: number;
  repeatSound: boolean;
  setTimerValue: (value: number) => void;
  setIsActive: (value: boolean) => void;
  setMode: (mode: TimerMode) => void;
  setTotalTime: (value: number) => void;
  setRepeatSound: (value: boolean) => void;
  resetTimer: (mode: TimerMode, minutes: number) => void;
  stopSound: () => void;
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: ReactNode }) {
  const [timerValue, setTimerValue] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<TimerMode>('Pomodoro');
  const [totalTime, setTotalTime] = useState(25 * 60);
  const [repeatSound, setRepeatSound] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('pomodoroTimer');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setTimerValue(parsed.timerValue || 25 * 60);
        setIsActive(parsed.isActive || false);
        setMode(parsed.mode || 'Pomodoro');
        setTotalTime(parsed.totalTime || 25 * 60);
        setRepeatSound(parsed.repeatSound || false);
      } catch (e) {
        console.error('Failed to load timer state:', e);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const state = {
      timerValue,
      isActive,
      mode,
      totalTime,
      repeatSound,
    };
    localStorage.setItem('pomodoroTimer', JSON.stringify(state));
  }, [timerValue, isActive, mode, totalTime, repeatSound]);

  // Handle the timer countdown
  useEffect(() => {
    if (isActive && timerValue > 0) {
      intervalRef.current = setInterval(() => {
        setTimerValue((t) => t - 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timerValue]);

  // Handle timer completion with sound
  useEffect(() => {
    if (timerValue === 0 && isActive) {
      setIsActive(false);
      
      // Play a WAV sound
      try {
        const audio = new Audio('/timer-complete.wav');
        audio.volume = 0.5; // Adjust volume (0.0 to 1.0)
        
        if (repeatSound) {
          audio.loop = true; // Loop the sound
        }
        
        audioRef.current = audio;
        audio.play().catch(error => {
          console.log('Could not play completion sound:', error);
        });
      } catch (error) {
        console.log('Could not play completion sound:', error);
      }
    }
  }, [timerValue, isActive, repeatSound]);

  // Function to stop the sound
  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };

  const resetTimer = (newMode: TimerMode, minutes: number) => {
    stopSound(); // Stop any playing sound
    setMode(newMode);
    setTimerValue(minutes * 60);
    setTotalTime(minutes * 60);
    setIsActive(false);
  };

  return (
    <TimerContext.Provider
      value={{
        timerValue,
        isActive,
        mode,
        totalTime,
        repeatSound,
        setTimerValue,
        setIsActive,
        setMode,
        setTotalTime,
        setRepeatSound,
        resetTimer,
        stopSound,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}