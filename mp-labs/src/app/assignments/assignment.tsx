'use client';
import { useEffect, useState, FormEvent, ChangeEvent } from 'react';

type Assignment = {
  className: string;
  Name: string;
  DueDate: string;
  Details: string;
 taskCompleted: boolean;
};
  

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<Assignment>({
    className: '',
    Name: '',
    DueDate: '',
    Details: '',
    taskCompleted: false,
  });

//   const payload = {
//   className: form.className,
//   name: form.name,
//   details: form.details
// };
  
  
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
        className: form.className,
         Name: form.Name,
       Details: form.Details,
       taskCompleted: form.taskCompleted,
       DueDate: form.DueDate ? new Date(form.DueDate).toISOString() : null
      };
     
    console.log(form);
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

      // const data = await res.json();
      
      // reset form
      setForm({ className: '', Name: '', DueDate: '' , Details: '', taskCompleted: false});
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
      setAssignments([...assignments, {className: '', Name: '', DueDate: '', Details: '', taskCompleted: false}])
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
          <label className="block mb-1 font-medium flex" htmlFor="Name">
            Assignment
          </label>
          <input
            id="Name"
            name="Name"
            type="text"
            value={form.Name}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1"
            placeholder="Homework 1"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium flex" htmlFor="DueDate">
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
          <label className="block mb-1 font-medium flex" htmlFor="Details">
            Details
          </label>
          <input
            id="Details"
            name="Details"
            type="text"
            value={form.Details}
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
              <strong>{a.className}</strong>: {a.Name}{' '}
              <span className="text-gray-500">(Due: {a.DueDate})</span>
            </p>
          ))
        )}
      </div>
    </div>
  );
}