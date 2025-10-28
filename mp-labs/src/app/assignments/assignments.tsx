'use client';
import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { getClassColorNumber } from '@/app/colors/classColors';
import { Assignment } from './assignment';
import { createClient } from '@/utils/supabase/client';

type AssignmentsPageProps = {
  onClose?: () => void;
}

export default function AssignmentsPage({onClose}: AssignmentsPageProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [error, setError] = useState<string | null>(null);

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
    } catch ( err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unexpected error");
      }
    }
  }
  
  useEffect(() => {
    loadData();
  }, []);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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
      
      // Convert the datetime-local value to ISO string properly
      // This ensures the local time is preserved when converting to ISO
      const localDate = new Date(form.DueDate);
      const isoDate = localDate.toISOString();
      
      console.log('Original input:', form.DueDate);
      console.log('Converted to ISO:', isoDate);
      
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
      
      if(!res.ok){
        const errorText = await res.text();
        alert("Error Saving assignment: " + errorText);
      }

      const data = await res.json();
      
      // reset form
      setForm({ className: '', Name: '', DueDate: '' , Details: ''});
      // re-fetch the list
      loadData();
      if(onClose) onClose();
    } catch (err) {
      console.error(err);
      alert('Error saving assignment');
    }
  };

  /* Adding new stuff for actually having multiple forms this is not functional yet until I add something else */
  const handleAddForm = () => {
    if(assignments.length < 6){
      setAssignments([...assignments, {className: '', Name: '', DueDate: '', Details: ''}])
    }
  };

  return (
    <div className="p-40 mx-auto rounded-2xl h-screen flex flex-col">
      <form onSubmit={handleSubmit} className="p-6 space-y-4 flex flex-col">
        <div className="w-full">
          <label className="p-6 text-lg font-medium text-black">
            Course Name
          </label>
          <input
            id="className"
            name="className"
            type="text"
            value={form.className}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Math 101"
          />
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
            Due Date & Time
          </label>
          <input
            id="DueDate"
            name="DueDate"
            type="datetime-local"
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
            className="globalButton mt-4 px-4 py-2 rounded outline-2"
          >
            Add Assignment
          </button>
        </div>
      </form>
    </div>
  );
}