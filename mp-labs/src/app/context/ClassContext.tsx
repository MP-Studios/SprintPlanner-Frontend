'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/utils/supabase/client';

type ClassContextType = {
  classes: string[];
  addClass: (className: string) => void;
  removeClass: (className: string) => void;
};

const ClassContext = createContext<ClassContextType | undefined>(undefined);

const STORAGE_KEY = 'app-class-names';
const MIGRATION_KEY = 'classes-migrated'; // Track if we've already migrated

export function ClassProvider({ children }: { children: ReactNode }) {
  const [classes, setClasses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load classes from localStorage and migrate from backlog if needed
  useEffect(() => {
    const initializeClasses = async () => {
      console.log('ClassProvider: Initializing...');
      
      // Check if we've already migrated
      const hasMigrated = localStorage.getItem(MIGRATION_KEY);
      
      if (!hasMigrated) {
        console.log('ClassProvider: First time load, migrating from backlog...');
        try {
          const supabase = createClient();
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            const res = await fetch("/api/fetchBacklog/", {
              headers: {
                "Authorization": `Bearer ${session.access_token}`
              },
            });
            
            if (res.ok) {
              const assignments = await res.json();
              console.log('ClassProvider: Fetched assignments:', assignments);
              
              // Extract unique class names
              const uniqueClasses = [...new Set(
                assignments
                  .map((a: any) => a.className)
                  .filter((name: string) => name && name.trim())
              )];
              
              console.log('ClassProvider: Extracted unique classes:', uniqueClasses);
              
              if (uniqueClasses.length > 0) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(uniqueClasses));
                setClasses(uniqueClasses);
              }
              
              // Mark migration as complete
              localStorage.setItem(MIGRATION_KEY, 'true');
            }
          }
        } catch (err) {
          console.error('ClassProvider: Migration failed', err);
        }
      } else {
        // Load from localStorage normally
        console.log('ClassProvider: Loading from localStorage...');
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          console.log('ClassProvider: Raw localStorage value:', stored);
          if (stored) {
            const classNames = JSON.parse(stored);
            console.log('ClassProvider: Parsed classes:', classNames);
            setClasses(classNames);
          } else {
            console.log('ClassProvider: No classes found in localStorage');
            setClasses([]);
          }
        } catch (err) {
          console.error('ClassProvider: Failed to load classes from localStorage', err);
        }
      }
      
      setIsLoading(false);
    };
    
    initializeClasses();
  }, []);
  
  const addClass = (className: string) => {
    console.log('ClassProvider: addClass called with:', className);
    setClasses(prev => {
      console.log('ClassProvider: Current classes:', prev);
      if (prev.includes(className)) {
        console.log('ClassProvider: Class already exists, skipping');
        return prev;
      }
      const updated = [...prev, className];
      console.log('ClassProvider: Updated classes:', updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      console.log('ClassProvider: Saved to localStorage');
      return updated;
    });
  };
  
  const removeClass = (className: string) => {
    setClasses(prev => {
      const updated = prev.filter(c => c !== className);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      console.log('ClassProvider: Removed class:', className);
      return updated;
    });
  };
  
  console.log('ClassProvider: Rendering with classes:', classes);
  
  if (isLoading) {
    return null; // or a loading spinner
  }
  
  return (
    <ClassContext.Provider value={{ classes, addClass, removeClass }}>
      {children}
    </ClassContext.Provider>
  );
}

export function useClasses() {
  const context = useContext(ClassContext);
  if (!context) throw new Error('useClasses must be used inside ClassProvider');
  return context;
}