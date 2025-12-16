import React from 'react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { Footer } from './Footer'

export function AppLayout({ children }) {
  return (
    <div className="flex h-screen w-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 text-slate-900">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-white/40 to-slate-50/60 backdrop-blur-sm">{children}</main>
        <Footer />
      </div>
    </div>
  )
}

export default AppLayout
