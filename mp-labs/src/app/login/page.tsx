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
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden px-4" style={{background: '#edf7f2'}}>
      {/* Blurred background shapes */}
      {/* <div
        className="absolute left-[-120px] top-[-120px] w-[400px] h-[400px] rounded-full bg-[#0ea5e9] opacity-20 blur-2xl pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute right-[-150px] bottom-[-150px] w-[400px] h-[400px] rounded-full bg-[#6366f1] opacity-20 blur-2xl pointer-events-none"
        aria-hidden
      /> */}

      <section className="relative bg-white rounded-3xl shadow-2xl px-12 py-12 flex flex-col items-center gap-6 z-10 w-full max-w-[580px] backdrop-blur-sm border border-gray-100">
        <div className='self-start w-full mb-2' style={{marginLeft:'14px', marginRight:'14px', marginTop:'8px'}}>
          <h1 className="text-5xl font-bold text-[#1e293b] mb-3 tracking-tight">
            Sign In
          </h1>
          <p className="text-[#64748b] text-xl">to access your account</p>
        </div>

        {/* NOTE: no onSubmit here – formAction on buttons handles it */}
        <form method="post" className="flex flex-col gap-5" autoComplete="off">
          <label className="flex flex-col gap-2.5" style= {{marginLeft:'14px', marginRight:'14px'}}>
            <span className="text-[#64748b] text-lg font-semibold uppercase tracking-wide">Email</span>
            <input
              name="email"
              type="email"
              placeholder="you@company.com"
              required
              className="
                rounded-lg border border-[#e5e7eb] bg-[#f1f5f9]
                px-4 py-3 focus:border-[#2563eb] focus:ring-1 focus:ring-[#38bdf8]
                outline-none text-[#1e293b] placeholder:text-[#64748b]
                transition text-xl
              "
            />
          </label>

          <label className="flex flex-col gap-2.5" style= {{marginLeft:'14px', marginRight:'14px'}}>
            <span className="text-[#64748b] text-lg font-semibold uppercase tracking-wide">Password</span>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              className="
                rounded-lg border border-[#e5e7eb] bg-[#f1f5f9]
                px-4 py-3 focus:border-[#2563eb] focus:ring-1 focus:ring-[#38bdf8]
                outline-none text-[#1e293b] placeholder:text-[#64748b]
                transition text-xl
              "
            />
          </label>

          <div className="bg-[#f1f5f9] rounded-xl px-4 py-3 border border-[#e2e8f0]" style={{marginLeft:'14px', marginRight:'14px'}}>
            <span className="text-sm text-[#64748b] leading-relaxed block text-center">
              Password must include at least 15 characters, one upper-case, one lower-case, one number, and one special character
            </span>
          </div>

          {errorMsg && (
            <div className="text-lg text-center" style={{ color: '#dc2626' }}>{errorMsg}</div>
          )}

          {/* Sign In button */}
          <button
            type="submit"
            formAction={handleLogin}
            className="globalButton
            mt-2 w-auto
            text-white text-base font-semibold
            rounded-xl py-4
            transition-all duration-200 disabled:opacity-60
            shadow-lg hover:shadow-xl
            " style = {{transform: "none", marginLeft:'14px', marginRight:'14px', fontSize:'18px'}}
          >
            Log In
          </button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-lg">
              <span className="px-4 bg-white text-[#64748b]">Don't have an account?</span>
            </div>
          </div>

          <button
            type="button"
            onClick={async (e) => {
              e.preventDefault()
              const form = e.currentTarget.form
              if (form) await handleSignup(new FormData(form))
            }}
            className=" globalButton
              text-base font-semibold
              rounded-xl py-4
              transition-all duration-200
            " style={{transform:'none', marginLeft:'14px', marginRight:'14px', marginBottom:'8px', fontSize:'18px'}}
          >
            Sign Up
          </button>
        </form>
      </section>
    </main>
  );
}