import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import { apiClient } from '../../api/axiosInstance'

export function Topbar() {
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState({ users: [], shipments: [], payments: [], products: [] })
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()

  React.useEffect(() => {
    const controller = new AbortController()
    const timeout = setTimeout(async () => {
      const term = query.trim()
      if (!term) {
        setResults({ users: [], shipments: [], payments: [], products: [] })
        setOpen(false)
        return
      }
      try {
        const response = await apiClient.get('/search', {
          params: { q: term },
          signal: controller.signal,
        })
        setResults(response.data)
        const hasAny =
          response.data.users?.length ||
          response.data.shipments?.length ||
          response.data.payments?.length ||
          response.data.products?.length
        setOpen(Boolean(hasAny))
      } catch (e) {
        if (e.name !== 'CanceledError') {
          console.error('Global search failed', e)
        }
      }
    }, 300)

    return () => {
      controller.abort()
      clearTimeout(timeout)
    }
  }, [query])

  const handleSelectUser = (user) => {
    setOpen(false)
    setQuery('')
    navigate('/users')
  }

  const handleSelectShipment = (shipment) => {
    setOpen(false)
    setQuery('')
    navigate('/shipments')
  }

  const handleSelectProduct = (product) => {
    setOpen(false)
    setQuery('')
    navigate('/products')
  }

  const handleSelectPayment = (payment) => {
    setOpen(false)
    setQuery('')
    navigate('/payments')
  }

  return (
    <header className="relative flex h-16 items-center justify-between border-b border-slate-200 bg-gradient-to-r from-white via-blue-50/30 to-slate-50 px-6 shadow-sm">
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="text-sm font-semibold text-slate-700">ShipEase Management</span>
      </div>
      <div className="relative flex items-center gap-4">
        <div className="relative">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search shipments, users, products..."
            className="h-9 w-56 rounded-lg border border-slate-300 bg-white/70 px-3 pl-8 text-sm text-slate-700 placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        {open &&
          (results.users.length +
            results.shipments.length +
            results.payments.length +
            results.products.length >
            0) && (
          <div className="absolute right-0 top-11 z-10 w-80 rounded-lg border border-slate-200 bg-white/95 backdrop-blur-sm p-3 text-sm shadow-xl">
            {results.users.length > 0 && (
              <div className="mb-3">
                <div className="mb-2 text-xs font-bold uppercase text-slate-600">Users</div>
                {results.users.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSelectUser(u)}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-blue-50 transition"
                  >
                    {u.fullName} <span className="text-slate-500">- {u.email}</span>
                  </button>
                ))}
              </div>
            )}
            {results.products.length > 0 && (
              <div className="mb-3">
                <div className="mb-2 text-xs font-bold uppercase text-slate-600">Products</div>
                {results.products.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectProduct(p)}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-blue-50 transition"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            )}
            {results.shipments.length > 0 && (
              <div className="mb-3">
                <div className="mb-2 text-xs font-bold uppercase text-slate-600">Shipments</div>
                {results.shipments.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectShipment(s)}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-blue-50 transition"
                  >
                    <span className="font-medium">{s.trackingNumber}</span> <span className="text-slate-500">- {s.status}</span>
                  </button>
                ))}
              </div>
            )}
            {results.payments.length > 0 && (
              <div>
                <div className="mb-2 text-xs font-bold uppercase text-slate-600">Payments</div>
                {results.payments.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPayment(p)}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-blue-50 transition"
                  >
                    {(p.primaryProductName ||
                      (p.productNames && p.productNames.length > 0 ? p.productNames.join(', ') : null) ||
                      p.shipmentTrackingNumber) ?? 'Payment'}{' '}
                    <span className="text-slate-500">- {p.status}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <Button variant="ghost" size="sm" type="button" className="text-slate-700 hover:bg-blue-100 hover:text-blue-700 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </Button>
      </div>
    </header>
  )
}

export default Topbar
