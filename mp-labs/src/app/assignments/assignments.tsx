'use client';
import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { Assignment } from './assignment';
import { createClient } from '@/utils/supabase/client';
import { useClasses } from '@/app/context/ClassContext';

type AssignmentsPageProps = {
  onClose?: () => void;
}

export default function AssignmentsPage({onClose}: AssignmentsPageProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showNewClassInput, setShowNewClassInput] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  
  const { classes, addClass } = useClasses();

  const [form, setForm] = useState<Assignment>({
    className: '',
    Name: '',
    DueDate: '',
    Details: '',
  });

  async function loadData() {
    try {
      const supabase = createClient();
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        setError('Not authenticated. Please log in.');
        return;
      }

      const res = await fetch("/api/fetchBacklog/", {           
        headers: {
          "Authorization": `Bearer ${session.access_token}`
        }, 
      });
      const data = await res.json();

      setAssignments(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unexpected error");
      }
    }
  }
  
  useEffect(() => {
  }, []);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // If user selects "Add New Class..." option
    if (name === 'className' && value === '__ADD_NEW__') {
      setShowNewClassInput(true);
      setForm(prev => ({ ...prev, className: '' }));
      return;
    }
    
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddNewClass = () => {
    if (!newClassName.trim()) {
      alert('Please enter a class name');
      return;
    }

    // Add to localStorage via context
    addClass({id: crypto.randomUUID(), name: newClassName});
    
    // Set the newly added class as selected
    setForm(prev => ({ ...prev, className: newClassName }));
    setNewClassName('');
    setShowNewClassInput(false);
  };

  const handleCancelNewClass = () => {
    setShowNewClassInput(false);
    setNewClassName('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // simple validation
    if (!form.className || !form.Name || !form.DueDate) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      const supabase = createClient();
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        setError('Not authenticated. Please log in.');
        return;
      }
      
      // Create a date at midnight (00:00) in the user's local timezone
      const [year, month, day] = form.DueDate.split('-').map(Number);
      const localDate = new Date(year, month - 1, day, 0, 0, 0);
      const isoDate = localDate.toISOString();
      
      const payload = {
        Name: form.Name,
        className: form.className,
        Details: form.Details,
        taskCompleted: false,
        DueDate: isoDate
      };
      
      const res = await fetch("/api/fetchSaveAssignment", {
        method: "POST",              
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify(payload),   
      });  
      
      if (!res.ok) {
        const errorText = await res.text();
        alert("Error saving assignment");
        return;
      }

      const data = await res.json();
      if (!data) {
        alert("Error saving assignment.");
        return;
      }

      // Add the class to localStorage if it's not already there
      addClass({id: crypto.randomUUID(), name: form.className});
      
      // reset form
      setForm({ className: '', Name: '', DueDate: '', Details: '' });
      // re-fetch the list
      window.location.reload();
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      alert('Error saving assignment');
    }
  };

  return (
    <div className="p-40 mx-auto rounded-2xl h-90 flex flex-col">
      <form onSubmit={handleSubmit} className="p-6 space-y-4 flex flex-col">
        <div className="w-full">
          <label className="p-6 text-lg font-medium text-black">
            Course Name
          </label>
          
          {showNewClassInput ? (
            <div className="space-y-2">
              <input
                type="text"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter new class name"
                autoFocus
              />
              <div className="flex gap-6" style={{marginTop: "12px"}}>
                <button
                  type="button"
                  onClick={handleAddNewClass}
                  className="globalButton rounded"
                >
                  Add Class
                </button>
                <button
                  type="button"
                  onClick={handleCancelNewClass}
                  className="globalButton rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <select
              id="className"
              name="className"
              value={form.className}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select a class...</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.name}>
                  {cls.name}
                </option>
              ))}
              <option value="__ADD_NEW__">+ Add New Class...</option>
            </select>
          )}
        </div>

        <div className="w-full">
          <label className="p-6 text-lg font-medium text-black">
            Assignment
          </label>
          <input
            id="Name"
            name="Name"
            type="text"
            value={form.Name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Homework 1"
          />
        </div>

        <div className="w-full">
          <label className="p-6 text-lg font-medium text-black">
            Due Date
          </label>
          <input
            id="DueDate"
            name="DueDate"
            type="date"
            value={form.DueDate}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="w-full">
          <label className="p-6 text-lg font-medium text-black">
            Details
          </label>
          <input
            id="Details"
            name="Details"
            type="text"
            value={form.Details}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder='Super cool assignment'
          />
        </div>
        
        <div className="createAssignment w-full flex justify-end pr-6 mt-6">
          <button 
            type="submit"
            className="globalButton mt-4 px-4 py-2 rounded"
          >
            Add Assignment
          </button>
        </div>
      </form>
    </div>
  );
}