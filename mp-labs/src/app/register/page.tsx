'use client'

import { register } from 'module';
import { useEffect, useState, FormEvent, ChangeEvent } from 'react';

export default function Register(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!email || !password || !confirmPassword) {
          setError("Please fill in all required fields.");
          return;
        }
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }
        setLoading(true);
    
        
    // let { data, error } = await supabase.auth.signUp({
    //     email: '',
    //     password: ''
    // })
  
    
      //   setLoading(false);
      //   if (error) {
      //     setError(error.message);
      //   } else {
      //     setSuccess("Check your email for a confirmation link!");
      //     setEmail("");
      //     setPassword("");
      //     setConfirmPassword("");
      //   }
      };

      return (
        <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3b82f6] via-[#6366f1] to-[#38bdf8] overflow-hidden">
          {/* Subtle abstract background shapes */}
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
                Create an Account
              </h1>
              <p className="text-[#64748b] text-base">
                Sign up to get started
              </p>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit} autoComplete="off">
              {error && (
                <div className="text-[#ef4444] text-xs px-3 py-2 bg-[#fef2f2] rounded mb-1 text-center">
                  {error}
                </div>
              )}
              {success && (
                <div className="text-[#22c55e] text-xs px-3 py-2 bg-[#f0fdf4] rounded mb-1 text-center">
                  {success}
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
                  required
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
                  placeholder="Create a password"
                  required
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-[#64748b] text-sm font-medium">Confirm Password</span>
                <input
                  type="password"
                  value={confirmPassword}
                  className="
                    rounded-lg border border-[#e5e7eb] bg-[#f1f5f9]
                    px-4 py-3
                    focus:border-[#2563eb] focus:ring-1 focus:ring-[#38bdf8]
                    outline-none text-[#1e293b]
                    placeholder:text-[#64748b]
                    transition
                    text-base
                  "
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  required
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
                {loading ? "Creating account..." : "Sign up"}
              </button>
            </form>
            <div className="text-center text-[#64748b] text-sm">
              Already have an account?{" "}
              <a href="/login" className="text-[#2563eb] hover:underline font-medium">Sign in</a>
            </div>
          </section>
        </main>
      );
}