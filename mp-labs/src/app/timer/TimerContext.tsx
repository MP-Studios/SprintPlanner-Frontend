'use client';

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

type TimerMode = 'Pomodoro' | 'Short Break' | 'Long Break';

type TimerContextType = {
  timerValue: number;
  isActive: boolean;
  mode: TimerMode;
  totalTime: number;
  setTimerValue: (value: number) => void;
  setIsActive: (value: boolean) => void;
  setMode: (mode: TimerMode) => void;
  setTotalTime: (value: number) => void;
  resetTimer: (mode: TimerMode, minutes: number) => void;
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: ReactNode }) {
  const [timerValue, setTimerValue] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<TimerMode>('Pomodoro');
  const [totalTime, setTotalTime] = useState(25 * 60);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
    };
    localStorage.setItem('pomodoroTimer', JSON.stringify(state));
  }, [timerValue, isActive, mode, totalTime]);

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
      
      // Play a beep sound using Web Audio API
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Create a pleasant beep sound
        oscillator.frequency.value = 800; // Frequency in Hz
        oscillator.type = 'sine'; // Sine wave for a pure tone
        
        // Fade out the sound
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
        
        // Play for 1 second
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);
      } catch (error) {
        console.log('Could not play completion sound:', error);
      }
    }
  }, [timerValue, isActive]);

  const resetTimer = (newMode: TimerMode, minutes: number) => {
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
        setTimerValue,
        setIsActive,
        setMode,
        setTotalTime,
        resetTimer,
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