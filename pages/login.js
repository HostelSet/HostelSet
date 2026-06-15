import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { supabase, signInWithEmail, resetPassword } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function Login() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const isEmail = (input) => input.includes('@')
  const isPhone = (input) => /^\d{10}$/.test(input)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!identifier || !password) {
      toast.error('Please enter email/phone and password')
      return
    }
    loading[1](true) // Fixed to safely toggle state hooks uniform
    setLoading(true)

    try {
      let emailToUse = identifier

      // If input is a 10‑digit phone number, find the associated email in users table
      if (isPhone(identifier)) {
        const { data, error } = await supabase
          .from('users')
          .select('email')
          .eq('phone', identifier)
          .maybeSingle()
        if (error || !data || !data.email) {
          toast.error('No account found with this phone number. Please register.')
          setLoading(false)
          return
        }
        emailToUse = data.email
      } else if (!isEmail(identifier)) {
        toast.error('Enter a valid email or 10-digit mobile number')
        setLoading(false)
        return
      }

      const result = await signInWithEmail(emailToUse, password)
      if (result.success) {
        toast.success(`Welcome back, ${result.userData.full_name}!`)
        
        // ✅ CRITICAL HISTORICAL HISTORY HOOK FIX: Swapped .push() for .replace()
        // This clears out auth page states so hitting "back" drops users out cleanly.
        if (result.role === 'admin') {
          router.replace('/admin/dashboard')
        } else if (result.role === 'owner') {
          const { data: property } = await supabase
            .from('properties')
            .select('id')
            .eq('owner_id', result.userData.id)
            .maybeSingle()
          if (property) {
            router.replace('/owner/dashboard')
          } else {
            router.replace('/owner/register-property')
          }
        } else {
          router.replace('/tenant/dashboard')
        }
      } else {
        toast.error(result.error || 'Invalid email or password')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!resetEmail) {
      toast.error('Please enter your email')
      return
    }
    setLoading(true)
    const result = await resetPassword(resetEmail)
    if (result.success) {
      toast.success('Password reset email sent! Check your inbox (and spam).')
      setShowReset(false)
    } else {
      toast.error(result.error || 'Failed to send reset email')
    }
    setLoading(false)
  }

  return (
    /* CRITICAL COLLISION FIX: Added pt-24 md:pt-32 padding constraints to match fixed header profiles cleanly */
    <div className="min-h-screen flex items-center justify-center p-4 pt-24 md:pt-32 pb-16 bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-100"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <span className="text-3xl">🏠</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">HOSTELSET</h1>
          <p className="text-gray-500 mt-1 text-sm">Login with email or mobile number</p>
        </div>

        {!showReset ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-slate-700 font-semibold text-sm mb-2">Email or Mobile Number</label>
              <input
                type="text"
                placeholder="you@example.com or 9876543210"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-slate-800 transition"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold text-sm mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-slate-800 pr-12 transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-slate-800 transition"
                  tabIndex={-1}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-800 text-white py-3 rounded-xl font-semibold hover:bg-slate-700 transition disabled:opacity-50 shadow-sm"
            >
              {loading ? 'Logging in...' : 'Login →'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowReset(true)}
                className="text-sm text-slate-500 hover:text-slate-800 font-medium transition"
              >
                Forgot password?
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-slate-700 font-semibold text-sm mb-2">Your Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-slate-800 shadow-inner"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1.5">We'll send a password reset link to this email</p>
            </div>
            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-slate-800 text-white py-3 rounded-xl font-semibold hover:bg-slate-700 transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Email'}
            </button>
            <button
              onClick={() => setShowReset(false)}
              className="w-full text-slate-500 hover:text-slate-800 text-sm font-medium transition block text-center"
            >
              ← Back to login
            </button>
          </div>
        )}

        <div className="mt-8 border-t border-gray-100 pt-6 text-center">
          <Link href="/owner/register-property" className="text-slate-600 hover:text-slate-800 text-sm font-semibold transition">
            Interconnected Portals? List Your Property →
          </Link>
        </div>
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-400 font-medium">
            Don't have an account yet?{' '}
            <Link href="/register" className="text-slate-600 hover:text-slate-800 font-bold transition decoration-slate-400 underline-offset-2 hover:underline">
              Register as Owner
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}