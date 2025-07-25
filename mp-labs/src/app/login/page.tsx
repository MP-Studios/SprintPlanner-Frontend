'use client'

import { useTransition } from 'react';
import { login, signup } from './actions'

export default function Login(){
  const [isPending, startTransition] = useTransition();

  // Generic click handler to submit the form to whichever action is set
  const handleActionClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    startTransition(() => {
      const form = e.currentTarget.form as HTMLFormElement | undefined;
      form?.requestSubmit();
    });
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3b82f6] via-[#6366f1] to-[#38bdf8] overflow-hidden">
      {/* Blurred background shapes */}
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
          <p className="text-[#64748b] text-base">to access your account</p>
        </div>

        {/* NOTE: no onSubmit here – formAction on buttons handles it */}
        <form className="flex flex-col gap-4" autoComplete="off">
          <label className="flex flex-col gap-2">
            <span className="text-[#64748b] text-sm font-medium">Email</span>
            <input
              name="email"
              type="email"
              placeholder="you@company.com"
              required
              className="
                rounded-lg border border-[#e5e7eb] bg-[#f1f5f9]
                px-4 py-3 focus:border-[#2563eb] focus:ring-1 focus:ring-[#38bdf8]
                outline-none text-[#1e293b] placeholder:text-[#64748b]
                transition text-base
              "
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-[#64748b] text-sm font-medium">Password</span>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              className="
                rounded-lg border border-[#e5e7eb] bg-[#f1f5f9]
                px-4 py-3 focus:border-[#2563eb] focus:ring-1 focus:ring-[#38bdf8]
                outline-none text-[#1e293b] placeholder:text-[#64748b]
                transition text-base
              "
            />
          </label>

          {/* Sign In button */}
          <button
            type="submit"
            formAction={login}
            onClick={handleActionClick}
            disabled={isPending}
            className="
              mt-4 w-full
              bg-[#2563eb] hover:bg-[#1d4ed8]
              text-white text-base font-semibold
              rounded-lg py-3
              transition disabled:opacity-60
              shadow-sm
            "
          >
            {isPending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="text-center text-[#64748b] text-sm">
          Don’t have an account?
          {/* Sign Up button */}
          <button
            type="submit"
            formAction={signup}
            onClick={handleActionClick}
            disabled={isPending}
            className="
              mt-4 w-full
              bg-[#2563eb] hover:bg-[#1d4ed8]
              text-white text-base font-semibold
              rounded-lg py-3
              transition disabled:opacity-60
              shadow-sm
            "
          >
            {isPending ? 'Signing up…' : 'Sign Up'}
          </button>
        </div>
      </section>
    </main>
  );
}