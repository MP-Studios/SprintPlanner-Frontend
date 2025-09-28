'use client';
import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import EditAssignments from './editAssignmentView';
import FetchCurrentSprint from '../fetchLogic/fetchSprint';
import fetchBacklog from "../fetchLogic/fetchBacklog";

type Assignment = {
  className: string;
  name: string;
  dueDate: string;
  taskDetails: string;
};

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<Assignment>({
    className: '',
    name: '',
    dueDate: '',
    taskDetails: '',
  });
  
  useEffect(() => {
    fetchBacklog();
  }, []);

  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // simple validation
    if (!form.className || !form.name || !form.dueDate) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      const res = await fetchSaveAssignment(form);
      
      if (!res.ok) throw new Error('Failed to save'); // Make this a seperate View
      // reset form
      setForm({ className: '', name: '', dueDate: '' , taskDetails: ''});
      // re-fetch the list
      fetchSprint();
    } catch (err) {
      console.error(err);
      alert('Error saving assignment');
    }
  };

  /* Adding new stuff for actually having multiple forms this is not functional yet until I add something else */
  const handleAddForm = () => {
    if(assignments.length < 6){
      setAssignments([...assignments, {className: '', name: '', dueDate: '', taskDetails: ''}])
    }
  };

  return (
    <div className="assignment p-6 bg-white shadow-lg overflow-hidden h-screen flex flex-col">
      <h1 className="text-xl font-semibold mb-4">Assignments</h1>

      {/*  New Assignment Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-3 flex">
        <div>
          <label className="block mb-1 font-medium flex" htmlFor="className">
            Class Name
          </label>
          <input
            id="className"
            name="className"
            type="text"
            value={form.className}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
            placeholder="Math 101"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium flex" htmlFor="name">
            Assignment
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
            placeholder="Homework 1"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium flex" htmlFor="dueDate">
            Due Date
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium flex" htmlFor="taskDetails">
            Details
          </label>
          <input
            id="taskDetails"
            name="taskDetails"
            type="text"
            value={form.taskDetails}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <button
          type="submit"
          className="w-[20%] self-end block mb-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex-center"
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
              <strong>{a.className}</strong>: {a.name}{' '}
              <span className="text-gray-500">(Due: {a.dueDate})</span>
            </p>
          ))
        )}
      </div>
    </div>
  );
}