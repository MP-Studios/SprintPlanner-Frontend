'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/utils/supabase/client';
import { getAllAssignments } from '../api/apiConstant';

type Assignment = {
  className: string;
  Name: string;
  Details: string;
  DueDate: string;
  ClassId?: string;
  Id?: string;
  Status?: number;
};

type StatsContextType = {
  assignments: Assignment[];
  loading: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
};

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export function StatsProvider({ children }: { children: ReactNode }) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllAssignments = async () => {
    try {
      setLoading(true);

      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        console.error("StatsContext: No auth token found");
        setError("Not authenticated");
        setAssignments([]);
        return;
      }

      const response = await fetch("/api/fetchStats", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,// this is bad let's fix after it works :)
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch all assignments');
      }

      const assignmentsData: Assignment[] = await response.json();
      setAssignments(assignmentsData || []);
      setError(null);
      
    } catch (err) {
      console.error(err);
      setError("Could not load assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAssignments();
  }, []);

  return (
    <StatsContext.Provider 
      value={{
        assignments,
        loading,
        error,
        refreshStats: loadAllAssignments
      }}
    >
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
}
