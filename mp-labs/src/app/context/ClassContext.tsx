// ============================================
// UPDATED ClassContext.tsx
// ============================================
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
  updateClassNameLocal: (classId: string, newName: string) => void;
  isLoading: boolean;
};

const ClassContext = createContext<ClassContextType | undefined>(undefined);

const STORAGE_KEY = 'app-classes';

export function ClassProvider({ children }: { children: ReactNode }) {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshClasses = async () => {
    setIsLoading(true);
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
      console.error('ClassProvider: Failed to fetch classes', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const initializeClasses = async () => {
      console.log('ClassProvider: Initializing...');
      
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const classNames = JSON.parse(stored) as ClassItem[];
          setClasses(classNames);
        }
      } catch (err) {
        console.error('ClassProvider: Failed to load classes from localStorage', err);
      }
      await refreshClasses();
    };    
    initializeClasses();
  }, []);
  
  const addClass = (classItem: ClassItem) => {
    console.log('ClassProvider: addClass called with:', classItem);
    setClasses(prev => {
      if (prev.some(c => c.id === classItem.id)) {
        return prev;
      }
      const updated = [...prev, classItem];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // UPDATED: This now properly updates the class name
  const updateClassNameLocal = (classId: string, newName: string) => {
    console.log('ClassProvider: Updating class name locally:', classId, newName);
    setClasses(prev => {
      const updated = prev.map(c => 
        c.id === classId ? { ...c, name: newName } : c
      );
      console.log('ClassProvider: Updated classes:', updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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

      if (!response.ok) {
        const errText = await response.text();
        console.error("Failed to delete class:", errText);
        return false;
      }

      setClasses((prev) => {
        const updated = prev.filter(c => c.id !== classId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
  
      console.log("ClassProvider: Class deleted successfully.");
      return true;
  
    } catch (error) {
      console.error("Error deleting class:", error);
      return false;
    }
  };
  
  return (
    <ClassContext.Provider value={{ 
      classes, 
      addClass, 
      deleteClass, 
      refreshClasses, 
      updateClassNameLocal,
      isLoading 
    }}>
      {children}
    </ClassContext.Provider>
  );
}

export function useClasses() {
  const context = useContext(ClassContext);
  if (!context) throw new Error('useClasses must be used inside ClassProvider');
  return context;
}