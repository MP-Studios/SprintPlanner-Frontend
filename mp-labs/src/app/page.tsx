"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function SplashPage() {
  const router = useRouter();
  
  const handleLoginClick = () => {
    router.push('/login');
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between w-full px-12 py-12 gap-12">
        <div className="flex-1 max-w-2xl">
          <h1 className="text-6xl lg:text-7xl font-bold mb-6 leading-tight text-gray-900">
            Stay Ahead of Your Assignments.
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
            Upload your calendar. Get an instant backlog. Never let an assignment sneak up again.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={handleLoginClick}
              className="px-8 py-4 rounded-2xl bg-blue-600 text-white text-lg font-semibold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all">
              Get Started
            </button>
            <button 
              onClick={handleLoginClick}
              className="px-8 py-4 rounded-2xl bg-white text-blue-600 border-2 border-blue-600 text-lg font-semibold shadow-lg hover:bg-blue-50 hover:shadow-xl transition-all">
              See Features
            </button>
          </div>
        </div>

        <div className="flex-1 max-w-xl w-full bg-white rounded-3xl shadow-2xl p-8">
          <p className="text-gray-500 mb-6 text-lg font-medium text-center">Meet Pebble the Bear!</p>
          <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden">
            <img
              src="/icon.png"
              alt="Pebble the Bear mascot"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-gradient-to-b from-white to-gray-50 py-16">
        <div className="w-full px-12">
          <h2 className="text-5xl font-bold mb-12 text-center text-gray-900">
            Ready to stay organized?
          </h2>
            <br></br>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-8 flex flex-col border-2 border-blue-100 hover:border-blue-300 transform hover:-translate-y-2">
              <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold mb-4 text-gray-900">Upload & Sort</h3>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed flex-grow">
                Upload your calendar and instantly get organized with a full backlog.
              </p>
              <div className="h-80 rounded-2xl overflow-hidden shadow-lg ring-2 ring-blue-200">
                <img
                  src="backlog.png"
                  alt="Calendar upload and backlog view"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-8 flex flex-col border-2 border-purple-100 hover:border-purple-300 transform hover:-translate-y-2">
              <div className="bg-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold mb-4 text-gray-900">Two-Week Window</h3>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed flex-grow">
                Stay focused on what matters — no hidden deadlines.
              </p>
              <div className="h-80 rounded-2xl overflow-hidden shadow-lg ring-2 ring-purple-200">
                <img
                  src="Sprint-View.png"
                  alt="Two-week sprint view"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-gradient-to-br from-green-50 to-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-8 flex flex-col border-2 border-green-100 hover:border-green-300 transform hover:-translate-y-2">
              <div className="bg-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold mb-4 text-gray-900">Study Timers</h3>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed flex-grow">
                A clean timer page for deep focus sessions.
              </p>
              <div className="h-80 rounded-2xl overflow-hidden shadow-lg ring-2 ring-green-200">
                <img
                  src="/timer.png"
                  alt="Pomodoro study timer"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Feature Card 4 */}
            <div className="bg-gradient-to-br from-orange-50 to-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-8 flex flex-col border-2 border-orange-100 hover:border-orange-300 transform hover:-translate-y-2">
              <div className="bg-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-3xl font-bold mb-4 text-gray-900">Stats & Analytics</h3>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed flex-grow">
                Track your progress, time, and productivity trends.
              </p>
              <div className="h-80 rounded-2xl overflow-hidden shadow-lg ring-2 ring-orange-200">
                <img
                  src="/stats.png"
                  alt="Productivity statistics dashboard"
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Separator Line */}
          <div className="my-16 border-t-2 border-gray-300"></div>
            <br></br>
            <br></br>
          {/* CTA Button */}
          <div className="text-center">
            <button 
              onClick={handleLoginClick}
              className="bg-blue-600 text-white px-12 py-5 rounded-2xl text-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-2xl transform hover:-translate-y-1">
              Sign Up Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}