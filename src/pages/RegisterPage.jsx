import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      setSuccess('Registration successful. Redirecting to login...')
      setForm({ name: '', email: '', password: '', confirmPassword: '' })
      setTimeout(() => navigate('/login'), 800)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create account"
      subtitle="Set up your FinTrackr profile and start in minutes"
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkTo="/login"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Full name</label>
          <input
            type="text"
            placeholder="Your name"
            required
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            placeholder="you@company.com"
            required
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            placeholder="Create a password"
            required
            value={form.password}
            onChange={(e) => handleChange('password', e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Confirm password
          </label>
          <input
            type="password"
            placeholder="Re-enter password"
            required
            value={form.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
        {success ? <p className="text-sm font-medium text-emerald-600">{success}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 font-medium text-white transition hover:bg-indigo-700"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <p className="text-center text-xs text-slate-500">
          By signing up, you agree to our{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-700">
            Terms & Privacy
          </Link>
          .
        </p>
      </form>
    </AuthLayout>
  )
}

