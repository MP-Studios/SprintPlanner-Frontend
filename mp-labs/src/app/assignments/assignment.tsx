'use client';
import { useEffect, useState, FormEvent, ChangeEvent } from 'react';

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

  // useEffect(() => {
  //   fetch("http://localhost:8080/api/assignments")
  //     .then(res => {
  //       if (!res.ok) {
  //         throw new Error('Failed to fetch');
  //       }
  //       return res.json();
  //     })
  //     .then(data => {
  //       setAssignments(data);
  //     })
  //     .catch(err => {
  //       console.error(err);
  //       setError('Error fetching assignments');
  //     });
  // }, []);

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
      setForm({ className: '', Name: '', DueDate: '' , TaskDetails: ''});
      // re-fetch the list
      fetchAssignments();
    } catch (err) {
      console.error(err);
      alert('Error saving assignment');
    }
  };

  return (
    <div className="assignment p-6 bg-white rounded-3xl shadow-lg overflow-hidden w-1/4 h-screen flex flex-col">
      <h1 className="text-xl font-semibold mb-4">Assignments</h1>

      {/*  New Assignment Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <div>
          <label className="block mb-1 font-medium" htmlFor="className">
            Class Name
          </label>
          <input
            id="className"
            name="className"
            type="text"
            value={form.className}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
            placeholder="e.g. Math 101"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium" htmlFor="Name">
            Assignment Name
          </label>
          <input
            id="Name"
            name="Name"
            type="text"
            value={form.Name}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
            placeholder="e.g. Problem Set 5"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium" htmlFor="DueDate">
            Due Date
          </label>
          <input
            id="DueDate"
            name="DueDate"
            type="date"
            value={form.DueDate}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium" htmlFor="TaskDetails">
            Task Details
          </label>
          <input
            id="TaskDetails"
            name="TaskDetails"
            type="text"
            value={form.TaskDetails}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Add Assignment
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
              <span className="text-gray-500">(Due: {a.DueDate})</span>
            </p>
          ))
        )}
      </div>
    </div>
  );
}
