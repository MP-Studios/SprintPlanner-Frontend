'use client';
import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import EditAssignments from './editAssignmentView';

type Assignment = {
  className: string;
  Name: string;
  DueDate: string;
  TaskDetails: string;
};

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<Assignment>({
    className: '',
    Name: '',
    DueDate: '',
    TaskDetails: '',
  });

  useEffect(() => {
    fetchAssignments();
  }, []);


  const fetchAssignments = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/assignments');
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
      const res = await fetch('http://localhost:8080/api/add-assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to save');
      // reset form
      setForm({ className: '', Name: '', DueDate: '', TaskDetails: '' });
      // re-fetch the list
      fetchAssignments();
    } catch (err) {
      console.error(err);
      alert('Error saving assignment');
    }
  };

  /* Adding new stuff for actually having multiple forms this is not functional yet until I add something else */
  const handleAddForm = () => {
    if (assignments.length < 6) {
      setAssignments([...assignments, { className: '', Name: '', DueDate: '', TaskDetails: '' }])
    }
  };

  return (
    <div className="assignment p-6 bg-[var(--background)] shadow-lg overflow-hidden h-screen flex flex-col">
      <h1 className="text-xl font-semibold mb-4 text-[var(--foreground)]">Assignments</h1>

      {/* New Assignment Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-3 flex gap-4">
        <div>
          <label className="block mb-1 font-medium text-[var(--foreground)]" htmlFor="className">
            Class Name
          </label>
          <input
            id="className"
            name="className"
            type="text"
            value={form.className}
            onChange={handleChange}
            className="w-full border border-[var(--border)] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="Math 101"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-[var(--foreground)]" htmlFor="Name">
            Assignment
          </label>
          <input
            id="Name"
            name="Name"
            type="text"
            value={form.Name}
            onChange={handleChange}
            className="w-full border border-[var(--border)] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            placeholder="Homework 1"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-[var(--foreground)]" htmlFor="DueDate">
            Due Date
          </label>
          <input
            id="DueDate"
            name="DueDate"
            type="date"
            value={form.DueDate}
            onChange={handleChange}
            className="w-full border border-[var(--border)] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-[var(--foreground)]" htmlFor="TaskDetails">
            Details
          </label>
          <input
            id="TaskDetails"
            name="TaskDetails"
            type="text"
            value={form.TaskDetails}
            onChange={handleChange}
            className="w-full border border-[var(--border)] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
        </div>

        <button
          type="submit"
          className="w-[20%] self-end block mb-1 bg-[var(--primary)] text-[var(--text-on-primary)] rounded hover:bg-[var(--primary-hover)] hover:text-[var(--text-on-primary)] transition-colors"
        >
          Submit
        </button>

      </form>

      {/* ► List of Assignments */}
      <div className="overflow-auto flex-1">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          assignments.map((a, i) => (
            <p key={i} className="mb-2 text-[var(--foreground)]">
              <strong>{a.className}</strong>: {a.Name}{' '}
              <span className="text-[var(--secondary)]">(Due: {a.DueDate})</span>
            </p>
          ))
        )}
      </div>
    </div>

  );
}