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
  //isLoading: boolean;
};

const AssignmentContext = createContext<AssignmentContextType | undefined>(undefined);

export function AssignmentProvider({ children }: { children: ReactNode }) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [doneSet, setDoneSet] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        setError('Not authenticated. Please log in.');
        return;
      }

      const res = await fetch('/api/fetchBacklog', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!res.ok) throw new Error('Failed to fetch assignments');
      
      const dataAssignments: Assignment[] = await res.json();
      setAssignments(dataAssignments);

      // Initialize doneSet based on Status
      const initialDoneSet = new Set<number>();
      dataAssignments.forEach((assignment, index) => {
        if (assignment.Status === 1) {
          initialDoneSet.add(index);
        }
      });
      setDoneSet(initialDoneSet);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not load assignments');
    } finally {
      setLoading(false);
    }
  };

  const markAsDone = async (index: number) => {
    const assignment = assignments[index];
    
    if (!assignment.Id) {
      console.error("Assignment has no ID");
      alert("Cannot update assignment: Missing ID");
      return;
    }
  
    // Toggle status: if currently 1 (done), set to 0; otherwise set to 1
    const currentStatus = assignment.Status || 0;
    const newStatus = currentStatus === 1 ? 0 : 1;
  
    try {
      // Get auth token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        alert("You must be logged in to update assignments");
        return;
      }
  
      // Call API to update status in database
      const response = await fetch('/api/updateAssignmentStatus', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          assignmentId: assignment.Id,
          status: newStatus
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update assignment status');
      }
  
      console.log(`Assignment ${assignment.Id} status updated to ${newStatus}`);
  
      // Update local state to reflect the change
      setAssignments(prevAssignments => 
        prevAssignments.map((a, i) => 
          i === index ? { ...a, Status: newStatus } : a
        )
      );
  
      // Update doneSet for UI purposes
      setDoneSet((prev) => {
        const newSet = new Set(prev);
        if (newStatus === 1) {
          newSet.add(index);
        } else {
          newSet.delete(index);
        }
        return newSet;
      });
  
    } catch (error) {
      console.error("Error updating assignment status:", error);
      alert("Failed to update assignment status. Please try again.");
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  return (
    <AssignmentContext.Provider 
      value={{ 
        assignments, 
        doneSet, 
        loading, 
        error, 
        markAsDone,
        refreshAssignments: loadAssignments
      }}
    >
      {children}
    </AssignmentContext.Provider>
  );
}

export function useAssignments() {
  const context = useContext(AssignmentContext);
  if (context === undefined) {
    throw new Error('useAssignments must be used within an AssignmentProvider');
  }
  return context;
}