import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { ShipmentsListPage } from './pages/shipments/ShipmentsListPage'
import { TrackShipmentPage } from './pages/shipments/TrackShipmentPage'
import { UsersPage } from './pages/users/UsersPage'
import { PaymentsPage } from './pages/payments/PaymentsPage'
import { ProductsPage } from './pages/products/ProductsPage'
import { LoginPage } from './pages/auth/LoginPage'
import { SignupPage } from './pages/auth/SignupPage'
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage'
import { TwoFactorPage } from './pages/auth/TwoFactorPage'
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage'
import { WelcomePage } from './pages/auth/WelcomePage'
import { useAuth } from './context/AuthContext.jsx'

function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (roles && roles.length > 0 && (!user || !roles.includes(user.role))) {
    return <div className="p-6 text-sm text-red-600">Access denied. You do not have permission to view this page.</div>
  }

  return children
}

function RoleBasedHome() {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role === 'ADMIN') {
    return <Navigate to="/dashboard" replace />
  }

  // Default landing page for non-admin users
  return <Navigate to="/shipments" replace />
}

export function App() {
  return (
      <Routes>
        {/* Welcome route */}
        <Route path="/welcome" element={<WelcomePage />} />

        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/2fa" element={<TwoFactorPage />} />

        {/* App routes */}
        <Route path="/" element={<RoleBasedHome />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/shipments"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ShipmentsListPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <AppLayout>
                <UsersPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payments"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <AppLayout>
                <PaymentsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <AppLayout>
                <ProductsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/track"
          element={
            <ProtectedRoute>
              <AppLayout>
                <TrackShipmentPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<RoleBasedHome />} />
      </Routes>
  )
}

export default App
