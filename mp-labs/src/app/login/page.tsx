'use client'

import { login, signup } from './actions'
import { useState } from 'react'
import { useLoading } from '../context/LoadingContext'

const PRIVACY_POLICY = `Last updated: March 2026

Planlli ("we," "our," or "us") is a academic assignment tracking service designed to help college and university students organize their coursework. This Privacy Policy explains what information we collect, how we use it, and the controls you have over your data.

**1. Information We Collect**

Account Information: When you create an account, we collect your email address.

Calendar & Assignment Data: If you choose to connect a calendar feed (such as a Canvas ICS link), we collect the information contained in that feed. For Canvas-based calendars, this may include assignment names, class names, due dates, and any details attached to those calendar events. For other calendar feeds, we collect whatever information is included in the ICS file you provide.

**2. How We Use Your Information**

We use the information we collect solely to provide the Planlli service — displaying your assignments in list and chart formats so you can track completion status and stay on top of your coursework. We do not sell your data or use it for advertising.

**3. How We Store and Protect Your Information**

All calendar and assignment data (including any FERPA-related information) is stored using encryption at rest. All communication between the app and our servers uses HTTPS with authentication to protect your data in transit.

**4. Your Controls and Deletion Rights**

You are in full control of your data. From the Settings tab in the app, you can:

- Delete your ICS calendar link — this will permanently remove the link and all associated assignment data from our database.
- Delete your account — this will permanently delete your account and all data associated with you from our systems.

**5. Third-Party Services**

We do not currently share your data with any third parties.

**6. Children and Student Notice**

Planlli is intended for use by college and university students. The Service is not directed to children under the age of 13, and we do not knowingly collect personal information from anyone under 13. If you believe a child under 13 has provided us with their information, please contact us so we can delete it.

Planlli is not affiliated with or endorsed by Canvas (Instructure) or any other learning management system. We do not access your Canvas account directly. Any calendar data is provided voluntarily by you in the form of an ICS link.

**7. Contact Us**

If you have any questions or concerns about this Privacy Policy or your data, you can reach us at:
Miguelwills713@gmail.com`

function PrivacyModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#1e293b]">Privacy Policy</h2>
          <button
            onClick={onClose}
            className="text-[#64748b] hover:text-[#1e293b] text-2xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-4 flex-1">
          {PRIVACY_POLICY.split('\n\n').map((block, i) => {
            if (block.startsWith('**') && block.endsWith('**')) {
              return (
                <h3 key={i} className="text-[#1e293b] font-semibold text-base mt-4 mb-1">
                  {block.replace(/\*\*/g, '')}
                </h3>
              )
            }
            if (block.startsWith('**')) {
              const [heading, ...rest] = block.split('\n')
              return (
                <div key={i} className="mb-3">
                  <h3 className="text-[#1e293b] font-semibold text-base mb-1">
                    {heading.replace(/\*\*/g, '')}
                  </h3>
                  {rest.map((line, j) => (
                    <p key={j} className="text-[#475569] text-sm leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
              )
            }
            return (
              <p key={i} className="text-[#475569] text-sm leading-relaxed mb-3">
                {block}
              </p>
            )
          })}
        </div>

        <div className="px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="globalButton w-full text-white text-base font-semibold rounded-xl py-3 transition-all duration-200"
            style={{ transform: 'none' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Login() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const { showLoading, hideLoading } = useLoading()

  async function handleLogin(formData: FormData) {
    showLoading('Signing in...')
    const result = await login(formData)
    if (result?.error) {
      hideLoading()
      setErrorMsg('Invalid email or password. Please try again.')
    } else {
      hideLoading()
      setErrorMsg(null)
      window.location.href = '/'
    }
  }

  async function handleSignup(formData: FormData) {
    const password = formData.get('password') as string
    const valid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{15,}$/.test(password)
    if (!valid) {
      setErrorMsg('Your password does not meet the requirements. Please try again.')
      return
    }
    await signup(formData)
  }

  return (
    <>
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}

      <main className="relative min-h-screen flex items-center justify-center overflow-hidden px-4" style={{ background: '#edf7f2' }}>
        <section className="relative bg-white rounded-3xl shadow-2xl px-12 py-12 flex flex-col items-center gap-6 z-10 w-full max-w-[580px] backdrop-blur-sm border border-gray-100">
          <div className='self-start w-full mb-2' style={{ marginLeft: '14px', marginRight: '14px', marginTop: '8px' }}>
            <h1 className="text-5xl font-bold text-[#1e293b] mb-3 tracking-tight">Sign In</h1>
            <p className="text-[#64748b] text-xl">to access your account</p>
          </div>

          <form method="post" className="flex flex-col gap-5 w-full" autoComplete="off">
            <label className="flex flex-col gap-2.5" style={{ marginLeft: '14px', marginRight: '14px' }}>
              <span className="text-[#64748b] text-lg font-semibold uppercase tracking-wide">Email</span>
              <input
                name="email"
                type="email"
                placeholder="you@company.com"
                required
                className="rounded-lg border border-[#e5e7eb] bg-[#f1f5f9] px-4 py-3 focus:border-[#2563eb] focus:ring-1 focus:ring-[#38bdf8] outline-none text-[#1e293b] placeholder:text-[#64748b] transition text-xl"
              />
            </label>

            <label className="flex flex-col gap-2.5" style={{ marginLeft: '14px', marginRight: '14px' }}>
              <span className="text-[#64748b] text-lg font-semibold uppercase tracking-wide">Password</span>
              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                className="rounded-lg border border-[#e5e7eb] bg-[#f1f5f9] px-4 py-3 focus:border-[#2563eb] focus:ring-1 focus:ring-[#38bdf8] outline-none text-[#1e293b] placeholder:text-[#64748b] transition text-xl"
              />
            </label>

            <div className="bg-[#f1f5f9] rounded-xl px-4 py-3 border border-[#e2e8f0]" style={{ marginLeft: '14px', marginRight: '14px' }}>
              <span className="text-sm text-[#64748b] leading-relaxed block text-center">
                Password must include at least 15 characters, one upper-case, one lower-case, one number, and one special character
              </span>
            </div>

            {errorMsg && (
              <div className="text-lg text-center" style={{ color: '#dc2626' }}>{errorMsg}</div>
            )}

            <button
              type="submit"
              formAction={handleLogin}
              className="globalButton mt-2 w-auto text-white text-base font-semibold rounded-xl py-4 transition-all duration-200 disabled:opacity-60 shadow-lg hover:shadow-xl"
              style={{ transform: 'none', marginLeft: '14px', marginRight: '14px', fontSize: '18px' }}
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
              className="globalButton text-base font-semibold rounded-xl py-4 transition-all duration-200"
              style={{ transform: 'none', marginLeft: '14px', marginRight: '14px', fontSize: '18px' }}
            >
              Sign Up
            </button>

            {/* Privacy Policy link */}
            <div className="flex justify-center" style={{ marginBottom: '8px' }}>
              <button
                type="button"
                onClick={() => setShowPrivacy(true)}
                className="text-sm text-[#94a3b8] hover:text-[#64748b] underline underline-offset-2 transition-colors"
              >
                Privacy Policy
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  )
}