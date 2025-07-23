'use client'

import { createClient } from '@supabase/supabase-js'
import { SupabaseAuthClient } from '@supabase/supabase-js/dist/module/lib/SupabaseAuthClient';
import { useEffect, useState, FormEvent, ChangeEvent } from 'react';

export default function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!email || !password){
            setError("Please fill in all fields.");
            return;
        }
        setLoading(true);
    }

    return(
        <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3b82f6] via-[#6366f1] to-[#38bdf8] overflow-hidden">
      {/* Optional: Subtle blurred abstract shape */}
      <div
        className="absolute left-[-120px] top-[-120px] w-[400px] h-[400px] rounded-full bg-[#0ea5e9] opacity-20 blur-2xl pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute right-[-150px] bottom-[-150px] w-[400px] h-[400px] rounded-full bg-[#6366f1] opacity-20 blur-2xl pointer-events-none"
        aria-hidden
      />

      <section className="relative w-full max-w-md bg-white border border-[#e5e7eb] rounded-2xl shadow-xl px-8 py-10 flex flex-col gap-8 z-10">
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b] mb-2 tracking-tight">
            Sign in
          </h1>
          <p className="text-[#64748b] text-base">
            to access your account
          </p>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit} autoComplete="off">
          {error && (
            <div className="text-[#ef4444] text-xs px-3 py-2 bg-[#fef2f2] rounded mb-1 text-center">
              {error}
            </div>
          )}
          <label className="flex flex-col gap-2">
            <span className="text-[#64748b] text-sm font-medium">Email</span>
            <input
              type="email"
              value={email}
              className="
                rounded-lg border border-[#e5e7eb] bg-[#f1f5f9]
                px-4 py-3
                focus:border-[#2563eb] focus:ring-1 focus:ring-[#38bdf8]
                outline-none text-[#1e293b]
                placeholder:text-[#64748b]
                transition
                text-base
              "
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-[#64748b] text-sm font-medium">Password</span>
            <input
              type="password"
              value={password}
              className="
                rounded-lg border border-[#e5e7eb] bg-[#f1f5f9]
                px-4 py-3
                focus:border-[#2563eb] focus:ring-1 focus:ring-[#38bdf8]
                outline-none text-[#1e293b]
                placeholder:text-[#64748b]
                transition
                text-base
              "
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="
              mt-4 w-full
              bg-[#2563eb] hover:bg-[#1d4ed8]
              text-white text-base font-semibold
              rounded-lg py-3
              transition
              disabled:opacity-60
              shadow-sm
            "
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div className="text-center text-[#64748b] text-sm">
          Don’t have an account?{" "}
          <a href="/register" className="text-[#2563eb] hover:underline font-medium">Sign up</a>
        </div>
      </section>
    </main>
    );
}