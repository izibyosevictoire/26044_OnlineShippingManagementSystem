import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext.jsx'

export function TwoFactorPage() {
  const { verifyTwoFactor } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email || ''
  const [code, setCode] = React.useState('')
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      setLoading(true)
      const data = await verifyTwoFactor(email, code)
      const role = data?.user?.role
      if (role === 'ADMIN') {
        navigate('/dashboard')
      } else {
        // Default dashboard for non-admins
        navigate('/shipments')
      }
    } catch (err) {
      console.error(err)
      setError('Invalid or expired verification code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="mb-1 text-2xl font-semibold">Two-factor authentication</h1>
        <p className="mb-1 text-xs text-gray-500">Signed in as {email || 'unknown user'}</p>
        <p className="mb-4 text-sm text-gray-500">
          Enter the 6-digit code sent to your email.
        </p>
        {error && (
          <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700" htmlFor="code">
              Verification code
            </label>
            <input
              id="code"
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm tracking-[0.5em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify and continue'}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Didn't receive a code? <button className="text-blue-600 hover:underline">Resend</button>
        </p>
        <p className="mt-1 text-center text-xs text-gray-400">
          <Link to="/login" className="hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default TwoFactorPage
