import React from "react";

export default function SplashPage() {
  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-center px-8 py-24 gap-12">
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold mb-4">Stay Ahead of Your Assignments.</h1>
          <p className="text-lg text-gray-600 mb-8">
            Upload your calendar. Get an instant backlog. Never let an assignment sneak up again.
          </p>
          <div className="flex gap-4">
            <button className="px-6 py-3 rounded-2xl bg-blue-600 text-white text-lg shadow-md">
              Get Started
            </button>
            <button className="px-6 py-3 rounded-2xl bg-white text-blue-600 border border-blue-600 text-lg shadow-md">
              See Features
            </button>
          </div>
        </div>

        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 text-center">
          <p className="text-gray-500 mb-4">Hand‑Drawn Art Placeholder</p>
          <div className="w-full h-64 bg-gray-200 rounded-2xl" >
             <img
      src="/favicon.ico"
      alt="Hand-drawn art"
      className="w-full h-full object-contain rounded-2xl"/>
        </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="px-8 pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Card 1 */}
        <div className="rounded-3xl p-6 shadow-lg bg-sky-200">
          <h2 className="text-2xl font-bold mb-2">Upload & Sort</h2>
          <p className="text-gray-700 mb-4">
            Upload your calendar and instantly get organized with a full backlog.
          </p>
          <div className="w-full h-40 bg-white rounded-xl shadow-inner" />
        </div>

        {/* Card 2 */}
        <div className="rounded-3xl p-6 shadow-lg bg-purple-200">
          <h2 className="text-2xl font-bold mb-2">Two‑Week Window</h2>
          <p className="text-gray-700 mb-4">
            Stay focused on what matters — no hidden deadlines.
          </p>
          <div className="w-full h-40 bg-white rounded-xl shadow-inner" />
        </div>

        {/* Card 3 */}
        <div className="rounded-3xl p-6 shadow-lg bg-indigo-400 text-white">
          <h2 className="text-2xl font-bold mb-2">Study Timers</h2>
          <p className="mb-4">A clean timer page for deep focus sessions.</p>
          <div className="w-full h-40 bg-indigo-200 rounded-xl" />
        </div>

        {/* Card 4 */}
        <div className="rounded-3xl p-6 shadow-lg bg-orange-200">
          <h2 className="text-2xl font-bold mb-2">Stats & Analytics</h2>
          <p className="text-gray-700 mb-4">Track your progress, time, and productivity trends.</p>
          <div className="w-full h-40 bg-white rounded-xl shadow-inner" />
        </div>
      </section>

      {/* Secondary CTA */}
      <section className="text-center pb-24">
        <h2 className="text-3xl font-semibold mb-4">Ready to stay organized?</h2>
        <button className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-lg shadow-md">
          Upload Calendar
        </button>
      </section>
    </div>
  );
}
