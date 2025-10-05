'use client';
import { useEffect, useState, FormEvent, ChangeEvent } from 'react';

import { Assignment } from './assignment';

export default function AssignmentsPage() {
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
      const res = await fetch("/api/fetchBacklog/");
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


  const fetchAssignments = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/backlog');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setAssignments(data);
    } catch (err) {
      console.error(err);
      setError('Error fetching assignments');
    }
  };
  
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
      
      const payload = {
  Name: form.Name,
  className: form.className,
  Details: form.Details,
  taskCompleted: false,
  DueDate: form.DueDate ? new Date(form.DueDate).toISOString() : null
};
    const res = await fetch("/api/fetchSaveAssignment", {
        method: "POST",              
        headers: {
        "Content-Type": "application/json",
      },
        body: JSON.stringify(payload),   
      });  
      if(!res.ok){
        const errorText = await res.text();
        alert("Error Saving your dumb assignment: " + errorText);
      }

      const data = await res.json();
      
      // reset form
      setForm({ className: '', Name: '', DueDate: '' , Details: ''});
      // re-fetch the list
      loadData();
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
    <div className="newAssignment p-40 overflow-hidden mx-auto rounded-2xl h-screen flex flex-col">
    <form onSubmit={handleSubmit} className="p-6 space-y-4 flex flex-col">
      <div className="w-full">
        <label className="assignmentInfo p-6 text-lg font-medium text-black">
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
        <label className="assignmentInfo p-6 text-lg font-medium text-black">
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
        <label className="assignmentInfo p-6 text-lg font-medium text-black">
          Due Date
        </label>
        <input
          id="DueDate"
          name="DueDate"
          type="date"
          value={form.DueDate}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          placeholder="mm/dd/yyyy"
        />
      </div>

      <div className="w-full">
        <label className="assignmentInfo p-6 text-lg font-medium text-black ">
          Details
        </label>
        <input
          id="Details"
          name="Details"
          type="text"
          value={form.Details}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          placeholder= 'Super cool assignment'
        />
      </div>

        <button
          type="submit"
          className="absolute bottom-6 right-6 outline-2 globalButton w-[20%] self-end block text-md text-grey rounded flex-center"
        >
          Submit
        </button>
      </form>

      {/* ► List of Assignments */}
      <div className="overflow-auto flex-1">
        {error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          assignments.map((a, i) => (
            <p key={i} className="mb-2">
              <strong>{a.className}</strong>: {a.Name}{' '}
              <span className="text-gray-500">(Due: {a.DueDate})</span>
            </p>
          ))
        )}
      </div>
    </div>
  );
}