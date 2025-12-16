import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'

export function WelcomePage() {
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center overflow-hidden relative">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-slate-200 rounded-full blur-3xl opacity-20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-2xl mx-auto px-4 sm:px-6">
        {/* Logo/Header */}
        <div className="mb-6">
          <div className="inline-block p-3 bg-white/60 backdrop-blur-sm rounded-2xl mb-6 shadow-sm">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-3 leading-tight">
            Welcome to ShipEase
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            Manage your shipments with ease. Fast, reliable, and simple.
          </p>
        </div>

        {/* Feature highlights - compact */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 w-full">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/80 hover:bg-white/80 transition">
            <div className="inline-block p-2 bg-blue-100 rounded-lg mb-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-slate-800 mb-1">Real-time Tracking</h3>
            <p className="text-xs text-slate-600">Track shipments instantly</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/80 hover:bg-white/80 transition">
            <div className="inline-block p-2 bg-green-100 rounded-lg mb-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-slate-800 mb-1">Secure Payments</h3>
            <p className="text-xs text-slate-600">Safe transactions</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/80 hover:bg-white/80 transition">
            <div className="inline-block p-2 bg-purple-100 rounded-lg mb-3">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-slate-800 mb-1">Easy Management</h3>
            <p className="text-xs text-slate-600">Simple to use</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center w-full">
          <Link to="/signup" className="flex-1 sm:flex-none">
            <Button className="w-full px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 font-medium rounded-lg transition shadow-md hover:shadow-lg">
              Create Account
            </Button>
          </Link>
          <Link to="/login" className="flex-1 sm:flex-none">
            <Button className="w-full px-6 py-3 bg-slate-700 text-white hover:bg-slate-800 font-medium rounded-lg transition shadow-md hover:shadow-lg">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default WelcomePage
