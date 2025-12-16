import React from 'react'
import { NavLink } from 'react-router-dom'
import { Button } from '../ui/Button'
import { useAuth } from '../../context/AuthContext.jsx'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', roles: ['ADMIN'] },
  { to: '/shipments', label: 'Shipments' },
  { to: '/track', label: 'Track Shipment' },
  { to: '/products', label: 'Products', roles: ['ADMIN'] },
  { to: '/users', label: 'Users', roles: ['ADMIN'] },
  { to: '/payments', label: 'Payments', roles: ['ADMIN'] },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const role = user?.role

  const visibleItems = navItems.filter((item) => !item.roles || item.roles.includes(role))

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-gradient-to-b from-white via-slate-50 to-slate-100 shadow-sm">
      <div className="flex h-16 items-center border-b border-slate-200 px-4 text-lg font-bold bg-gradient-to-r from-blue-600 to-slate-600 text-white">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        ShipEase
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive 
                  ? 'bg-blue-100 text-blue-700 shadow-sm' 
                  : 'text-slate-700 hover:bg-white/50 hover:text-blue-600'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-200 p-4 bg-slate-50/50">
        <Button
          variant="secondary"
          className="w-full bg-red-600 text-white hover:bg-red-700 font-semibold rounded-lg transition shadow-sm"
          type="button"
          onClick={logout}
        >
          <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </Button>
      </div>
    </aside>
  )
}

export default Sidebar
