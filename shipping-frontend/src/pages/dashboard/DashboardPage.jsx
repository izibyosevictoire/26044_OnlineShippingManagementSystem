import React from 'react'
import { fetchShipmentSummary } from '../../api/shipments'
import { Button } from '../../components/ui/Button'

export function DashboardPage() {
  const [summary, setSummary] = React.useState({
    totalShipments: 0,
    created: 0,
    inTransit: 0,
    delivered: 0,
    cancelled: 0,
    recentShipments: [],
  })
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const loadSummary = React.useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const data = await fetchShipmentSummary()
      setSummary({
        totalShipments: data.totalShipments ?? 0,
        created: data.created ?? 0,
        inTransit: data.inTransit ?? 0,
        delivered: data.delivered ?? 0,
        cancelled: data.cancelled ?? 0,
        recentShipments: data.recentShipments ?? [],
      })
    } catch (e) {
      console.error('Failed to load dashboard summary', e)
      setError('Could not load dashboard data from the server.')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadSummary()
  }, [loadSummary])

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-1">Dashboard</h1>
          <p className="text-sm text-slate-600">Welcome back! Here's your shipping overview.</p>
        </div>
        <Button type="button" variant="secondary" onClick={loadSummary} disabled={loading} className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-400">
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <SummaryCard label="Total Shipments" value={summary.totalShipments} icon="📦" color="blue" />
        <SummaryCard label="Created" value={summary.created} icon="✨" color="purple" />
        <SummaryCard label="In Transit" value={summary.inTransit} icon="🚚" color="orange" />
        <SummaryCard label="Delivered" value={summary.delivered} icon="✅" color="green" />
        <SummaryCard label="Cancelled" value={summary.cancelled} icon="⚠️" color="red" />
      </section>

      {/* Recent Shipments */}
      <section className="rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-1">Recent Shipments</h2>
            <p className="text-xs text-slate-600">Track your latest shipments</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/50 text-xs font-semibold uppercase tracking-wide text-slate-700">
              <tr>
                <th className="px-4 py-3">Tracking Code</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Origin</th>
                <th className="px-4 py-3">Destination</th>
                <th className="px-4 py-3">Products</th>
                <th className="px-4 py-3">Created At</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    Loading latest shipments...
                  </td>
                </tr>
              ) : summary.recentShipments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No shipments found. Start creating shipments to see them here.
                  </td>
                </tr>
              ) : (
                summary.recentShipments.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                    <td className="px-4 py-3 font-semibold text-blue-600">{item.trackingNumber}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{item.originAddress}</td>
                    <td className="px-4 py-3 text-slate-700">{item.destinationAddress}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {(item.products ?? [])
                        .map((p) => p.name)
                        .join(', ')}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function SummaryCard({ label, value, icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    red: 'bg-red-50 border-red-200 text-red-700',
  }

  return (
    <div className={`rounded-xl border p-5 transition hover:shadow-md hover:-translate-y-1 cursor-pointer ${colorClasses[color] || colorClasses.blue}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold uppercase tracking-wide opacity-75">{label}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
}

function getStatusBadgeColor(status) {
  const colors = {
    'CREATED': 'bg-slate-100 text-slate-700',
    'IN_TRANSIT': 'bg-orange-100 text-orange-700',
    'DELIVERED': 'bg-green-100 text-green-700',
    'CANCELLED': 'bg-red-100 text-red-700',
  }
  return colors[status] || 'bg-slate-100 text-slate-700'
}

export default DashboardPage
