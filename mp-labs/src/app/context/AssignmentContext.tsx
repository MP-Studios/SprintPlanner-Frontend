'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

type Assignment = {
  className: string;
  Name: string;
  Details: string;
  DueDate: string;
  ClassId?: string;
  Id?: string;
  Status?: number;
};

type AssignmentContextType = {
  assignments: Assignment[];
  doneSet: Set<number>;
  loading: boolean;
  error: string | null;
  markAsDone: (index: number) => Promise<void>;
  refreshAssignments: () => Promise<void>;
};

const AssignmentContext = createContext<AssignmentContextType | undefined>(undefined);

export function AssignmentProvider({ children }: { children: ReactNode }) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [doneSet, setDoneSet] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAssignments = async (accessToken: string) => {
    try {
      setLoading(true);
      const res = await fetch('/api/fetchBacklog', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error('Failed to fetch assignments');
      const dataAssignments: Assignment[] = await res.json();

      setAssignments(dataAssignments);

      const initialDoneSet = new Set<number>();
      dataAssignments.forEach((a, i) => {
        if (a.Status === 1) initialDoneSet.add(i);
      });
      setDoneSet(initialDoneSet);
      setError(null);
    } catch (err) {
      console.error('Error loading assignments:', err);
      setError('Could not load assignments');
    } finally {
      setLoading(false);
    }
  };

  const markAsDone = async (index: number) => {
    const assignment = assignments[index];
    if (!assignment?.Id) {
      alert('Cannot update assignment: Missing ID');
      return;
    }

    const newStatus = assignment.Status === 1 ? 0 : 1;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('You must be logged in to update assignments');
        return;
      }

      const res = await fetch('/api/updateAssignmentStatus', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ assignmentId: assignment.Id, status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update assignment status');

      // local update
      setAssignments(prev =>
        prev.map((a, i) => (i === index ? { ...a, Status: newStatus } : a))
      );
      setDoneSet(prev => {
        const s = new Set(prev);
        newStatus === 1 ? s.add(index) : s.delete(index);
        return s;
      });
    } catch (e) {
      console.error('Error updating assignment status:', e);
      alert('Failed to update assignment status.');
    }
  };

 // ✅ reliable session restoration
useEffect(() => {
    let mounted = true;
  
    const init = async () => {
      setLoading(true);
  
      // First, try to get the session
      let { data: { session } } = await supabase.auth.getSession();
      
      // If no session, try refreshing it (important after server redirects)
      if (!session) {
        const { data: { session: refreshedSession }, error } = await supabase.auth.refreshSession();
        if (!error && refreshedSession) {
          session = refreshedSession;
        }
      }
  
      if (mounted && session?.access_token) {
        await loadAssignments(session.access_token);
      } else if (mounted) {
        setAssignments([]);
        setDoneSet(new Set());
        setLoading(false);
      }
  
      // Listen for future auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (!mounted) return;
        
        if (session?.access_token) {
          await loadAssignments(session.access_token);
        } else {
          setAssignments([]);
          setDoneSet(new Set());
          setLoading(false);
        }
      });
  
      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    };
  
    init();
  }, []);
  

  return (
    <AssignmentContext.Provider
      value={{
        assignments,
        doneSet,
        loading,
        error,
        markAsDone,
        refreshAssignments: async () => {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.access_token) await loadAssignments(session.access_token);
        },
      }}
    >
      {children}
    </AssignmentContext.Provider>
  );
}

export function useAssignments() {
  const ctx = useContext(AssignmentContext);
  if (!ctx) throw new Error('useAssignments must be used within AssignmentProvider');
  return ctx;
}
