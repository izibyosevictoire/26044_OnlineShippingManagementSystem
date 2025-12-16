import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authApi from '../api/auth'

const AuthContext = createContext(null)

const STORAGE_KEY = 'shipping_auth_state'

export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return { user: null, token: null }
      return JSON.parse(raw)
    } catch {
      return { user: null, token: null }
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const login = async (email, password) => {
    const data = await authApi.login({ email, password })
    // Backend sends { message, email }, 2FA happens on separate screen
    return data
  }

  const verifyTwoFactor = async (email, code) => {
    const data = await authApi.verifyTwoFactor({ email, code })
    setState({ user: data.user, token: data.token })
    return data
  }

  const signup = async (payload) => {
    const data = await authApi.signup(payload)
    return data
  }

  const logout = () => {
    setState({ user: null, token: null })
    navigate('/login')
  }

  const requestPasswordReset = async (email) => {
    return authApi.requestPasswordReset({ email })
  }

  const resetPassword = async (token, newPassword) => {
    return authApi.resetPassword({ token, newPassword })
  }

  const value = {
    user: state.user,
    token: state.token,
    isAuthenticated: Boolean(state.token && state.user),
    login,
    verifyTwoFactor,
    signup,
    logout,
    requestPasswordReset,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}