'use client'

import { login, signup } from './actions'
import { useState } from 'react'
import { useLoading } from '../context/LoadingContext'

export default function Login(){
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const { showLoading, hideLoading } = useLoading()

  async function handleLogin(formData: FormData) {
    showLoading('Signing in...')
    const result = await login(formData)
    if (result?.error) {
      hideLoading();
      setErrorMsg('Invalid email or password. Please try again.')
    } else {
      hideLoading();
      setErrorMsg(null)
      window.location.href = '/'
    }
  }

  async function handleSignup(formData: FormData) {
    const password = formData.get('password') as string

    // regex for your requirements
    const valid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{15,}$/.test(password)
    if (!valid) {
      setErrorMsg('Your password does not meet the requirements. Please try again')
      return
    }

    // if passes, call the server action
    await signup(formData)
  }
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{background: '#edf7f2'}}>
      {/* Blurred background shapes */}
      {/* <div
        className="absolute left-[-120px] top-[-120px] w-[400px] h-[400px] rounded-full bg-[#0ea5e9] opacity-20 blur-2xl pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute right-[-150px] bottom-[-150px] w-[400px] h-[400px] rounded-full bg-[#6366f1] opacity-20 blur-2xl pointer-events-none"
        aria-hidden
      /> */}

      <section className="relative w-full max-w-md bg-white border border-[#e5e7eb] rounded-2xl shadow-xl px-8 py-10 flex flex-col gap-4 z-10">
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b] mb-2 tracking-tight" style= {{marginLeft:'10px', marginTop:'10px'}}>
            Sign In
          </h1>
          <p className="text-[#64748b] text-base" style= {{marginLeft:'10px'}}>to access your account</p>
        </div>

        {/* NOTE: no onSubmit here – formAction on buttons handles it */}
        <form method="post" className="flex flex-col gap-4" autoComplete="off">
          <label className="flex flex-col gap-2" style= {{marginLeft:'10px', marginRight:'10px'}}>
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

          <label className="flex flex-col gap-2" style= {{marginLeft:'10px', marginRight:'10px'}}>
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
          <span className="text-center text-sm text-[#64748b]" style= {{marginLeft:'10px', marginRight:'10px'}}>Password must include at least 15 characters, one upper-case, one lower-case, one number, and one special character</span>

          {errorMsg && (
            <div className="text-sm text-center" style={{ color: '#dc2626' }}>{errorMsg}</div>
          )}

          {/* Sign In button */}
          <button
            type="submit"
            formAction={handleLogin}
            className="globalButton
              mt-4 w-auto
              text-white text-base font-semibold
              rounded-lg py-3
              transition disabled:opacity-60
              shadow-sm
            " style = {{transform: "none", marginLeft:'10px', marginRight:'10px'}}
          >
            Log In
          </button>
          <div className="text-center text-[#64748b] text-sm">
          Don’t have an account?
          {/* Sign Up button */}
        </div>
          <button
            type="button"
            onClick={async (e) => {
              e.preventDefault()
              const form = e.currentTarget.form
              if (form) await handleSignup(new FormData(form))
            }}
            className="globalButton
              mt-4 w-auto
              text-white text-base font-semibold
              rounded-lg py-3
              transition disabled:opacity-60
              shadow-sm
            " style = {{transform: "none", marginLeft:'10px', marginRight:'10px', marginBottom:'6px'}}
          >
            Sign Up
          </button>
        </form>
      </section>
    </main>
  );
}