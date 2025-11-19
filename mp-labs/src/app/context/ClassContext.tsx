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
  removeClass: (classId: string) => Promise<boolean>;
};

const ClassContext = createContext<ClassContextType | undefined>(undefined);

const STORAGE_KEY = 'app-classes';
const MIGRATION_KEY = 'classes-migrated'; // Track if we've already migrated

export function ClassProvider({ children }: { children: ReactNode }) {
  const [classes, setClasses] = useState<ClassItem[]>([]);
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
                
                  localStorage.setItem(STORAGE_KEY, JSON.stringify(uniqueClasses));
                  setClasses(uniqueClasses);
                }
              
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
          if (stored) {
            try {
              const classNames = JSON.parse(stored) as ClassItem[]; // assert string[]
              setClasses(classNames);
            } catch (err) {
              console.error('Failed to parse classes', err);
              setClasses([]);
            }
          }
        } catch (err) {
          console.error('ClassProvider: Failed to load classes from localStorage', err);
        }
      }
      
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
  
  const removeClass = async (classId: string): Promise<boolean> => {
    try {
      console.log("Attempting to delete:", classId);

      const response = await fetch(`/api/deleteClass?classId=${classId}`, {
        method: "DELETE",
      });

      console.log(response);
  
      if (!response.ok) {
        const errText = await response.text();
        console.error("Failed to delete class:", errText);
        //alert("Failed to delete class. Please try again.");
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
      //window.location.reload();

  
      console.log("ClassProvider: Class deleted successfully.");
      return true;
  
    } catch (error) {
      console.error("Error deleting class:", error);
      //alert("An unexpected error occurred while deleting the class.");
      return false;
    }
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