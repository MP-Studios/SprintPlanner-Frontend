'use client'

import { login, signup } from './actions'
import { createClient } from '@/utils/supabase/client'
import  "../styles/google-button.css";

export default function Login() {
  const supabase = createClient()

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: '#edf7f2' }}>
      <section className="relative w-full max-w-md bg-white border border-[#e5e7eb] rounded-2xl shadow-xl px-8 py-10 flex flex-col gap-8 z-10">

        <div>
          <h1 className="text-3xl font-bold text-[#1e293b] mb-2 tracking-tight">
            Sign in
          </h1>
          <p className="text-[#64748b] text-base">to access your account</p>
        </div>

        {/* Form login */}
        <form method="post" className="flex flex-col gap-4" autoComplete="off">
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
            className="globalButton mt-4 w-full text-white text-base font-semibold rounded-lg py-3 transition disabled:opacity-60 shadow-sm"
            style={{ transform: "none" }}
          >
            Sign In
          </button>

          <div className="text-center text-[#64748b] text-sm">Don’t have an account?</div>

          {/* Sign Up button */}
          <button
            type="submit"
            formAction={signup}
            className="globalButton mt-4 w-full text-white text-base font-semibold rounded-lg py-3 transition disabled:opacity-60 shadow-sm"
            style={{ transform: "none" }}
          >
            Sign Up
          </button>
        </form>

       <button className="gsi-material-button" onClick={signInWithGoogle}>
  <div className="gsi-material-button-state"></div>
  <div className="gsi-material-button-content-wrapper">
    <div className="gsi-material-button-icon">
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        style={{ display: "block" }}
      >
        <path
          fill="#EA4335"
          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
        />
        <path
          fill="#4285F4"
          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
        />
        <path
          fill="#FBBC05"
          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
        />
        <path
          fill="#34A853"
          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
        />
        <path fill="none" d="M0 0h48v48H0z" />
      </svg>
    </div>

    <span className="gsi-material-button-contents">Continue with Google</span>
    <span style={{ display: "none" }}>Continue with Google</span>
  </div>
</button>

      </section>
    </main>
  )
}
