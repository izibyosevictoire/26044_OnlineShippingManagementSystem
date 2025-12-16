import apiClient from './axiosInstance'

export async function signup(payload) {
  const response = await apiClient.post('/auth/signup', payload)
  return response.data
}

export async function login({ email, password }) {
  const response = await apiClient.post('/auth/login', { email, password })
  return response.data
}

export async function verifyTwoFactor({ email, code }) {
  const response = await apiClient.post('/auth/verify-2fa', { email, code })
  return response.data
}

export async function requestPasswordReset({ email }) {
  const response = await apiClient.post('/auth/forgot-password', { email })
  return response.data
}

export async function resetPassword({ token, newPassword }) {
  const response = await apiClient.post('/auth/reset-password', { token, newPassword })
  return response.data
}

export default {
  signup,
  login,
  verifyTwoFactor,
  requestPasswordReset,
  resetPassword,
}