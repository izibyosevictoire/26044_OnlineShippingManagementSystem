import React from 'react'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="flex h-12 items-center justify-between border-t border-slate-200 bg-gradient-to-r from-slate-100 to-blue-50 px-6 text-xs text-slate-600 shadow-sm">
      <span>© {year} ShipEase | Online Shipping Management</span>
      <span className="text-slate-500">All rights reserved.</span>
    </footer>
  )
}

export default Footer
