'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/utils/supabase/client';

type ClassItem = {
  id: string;
  name: string;
}

type ClassContextType = {
  classes: ClassItem[];
  addClass: (ClassItem: ClassItem) => void;
  deleteClass: (classId: string) => Promise<boolean>;
  refreshClasses: () => Promise<void>;
};

const ClassContext = createContext<ClassContextType | undefined>(undefined);

const STORAGE_KEY = 'app-classes';

export function ClassProvider({ children }: { children: ReactNode }) {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshClasses = async () => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const res = await fetch("/api/fetchBacklog/", { //database only hit on reload! (the rest the page also hits database on reload)
          headers: {
            "Authorization": `Bearer ${session.access_token}`
          },
        });
        
        if (res.ok) {
            const assignments = await res.json();
            if (Array.isArray(assignments)) {
              const uniqueClasses = [
                ...new Map(
                  assignments
                    .filter((a: any) => a.className && a.ClassId)
                    .map((a: any) => [a.ClassId, { id: a.ClassId, name: a.className }])
                ).values(),
              ];
              console.log('ClassProvider: Fetched classes: ', uniqueClasses);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(uniqueClasses));
              setClasses(uniqueClasses);
            }
        }
      }
    } catch (err) {
      console.error('ClassProvider: Failed to fetech classes', err);
    }
  };
  
  // Load classes from localStorage and migrate from backlog if needed
  useEffect(() => {
    const initializeClasses = async () => {
      console.log('ClassProvider: Initializing...');
      
      // Load from localStorage normally
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const classNames = JSON.parse(stored) as ClassItem[];
            setClasses(classNames);
        }
      } catch (err) {
        console.error('ClassProvider: Failed to load classes from localStorage', err);
      }
      refreshClasses();
      setIsLoading(false);
    };    
    initializeClasses();
  }, []);
  
  const addClass = (classItem: ClassItem) => {
    console.log('ClassProvider: addClass called with:', classItem);
    setClasses(prev => {
      console.log('ClassProvider: Current classes:', prev);
      if (prev.some(c => c.id === classItem.id)) {
        console.log('ClassProvider: Class already exists, skipping');
        return prev;
      }
      const updated = [...prev, classItem];
      console.log('ClassProvider: Updated classes:', updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      console.log('ClassProvider: Saved to localStorage');
      return updated;
    });
  };
  
  const deleteClass = async (classId: string): Promise<boolean> => {
    try {
      console.log("Attempting to delete:", classId);

      const response = await fetch(`/api/deleteClass`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ classId }),
      });

      console.log(response);
  
      if (!response.ok) {
        const errText = await response.text();
        console.error("Failed to delete class:", errText);
        return false;
      }
      
      console.log("deleting this ho:", classId);
      setClasses((prev) => {
        const updated = prev.filter(c => c.id !== classId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        console.log("ClassProvider: Class removed and saved to localStorage:", updated);
        console.log("updated: " + updated);
        return updated;
      });
      console.log("classes: " + classes);
  
      console.log("ClassProvider: Class deleted successfully.");
      return true;
  
    } catch (error) {
      console.error("Error deleting class:", error);
      return false;
    }
  };
  
  
  console.log('ClassProvider: Rendering with classes:', classes);
  
  if (isLoading) {
    return null; // or a loading spinner
  }
  
  return (
    <ClassContext.Provider value={{ classes, addClass, deleteClass, refreshClasses }}>
      {children}
    </ClassContext.Provider>
  );
}

export function useClasses() {
  const context = useContext(ClassContext);
  if (!context) throw new Error('useClasses must be used inside ClassProvider');
  return context;
}