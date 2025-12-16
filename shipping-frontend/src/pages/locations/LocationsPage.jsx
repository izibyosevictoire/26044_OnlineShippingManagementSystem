import React from 'react'
import Pagination from '../../components/ui/Pagination'
import { apiClient } from '../../api/axiosInstance'

export function LocationsPage() {
  const [page, setPage] = React.useState(1)
  const pageSize = 10
  const [locations, setLocations] = React.useState([])
  const [totalItems, setTotalItems] = React.useState(0)
  const [search, setSearch] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError('')
        const response = await apiClient.get('/locations', {
          params: { page: page - 1, size: pageSize },
        })
        const data = response.data
        setLocations(data.content ?? [])
        setTotalItems(data.totalElements ?? data.content?.length ?? 0)
      } catch (e) {
        console.error('Failed to load locations', e)
        setError('Failed to load locations from server.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [page])

  const filtered = React.useMemo(() => {
    const term = search.toLowerCase().trim()
    if (!term) return locations
    return locations.filter((loc) =>
      [
        loc.province,
        loc.district,
        loc.sector,
        loc.cell,
        loc.village,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(term),
    )
  }, [search, locations])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-1">Locations</h1>
          <p className="text-sm text-slate-600">Manage shipping locations across all provinces</p>
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by province, district, sector..."
          className="w-full sm:w-80 h-10 rounded-lg border border-slate-300 bg-white/70 px-4 text-sm placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
        />
      </div>
      <div className="rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/50 text-xs font-semibold uppercase tracking-wide text-slate-700">
              <tr>
                <th className="px-4 py-3">Province</th>
                <th className="px-4 py-3">District</th>
                <th className="px-4 py-3">Sector</th>
                <th className="px-4 py-3">Cell</th>
                <th className="px-4 py-3">Village</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    Loading locations...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No locations found. Try adjusting your search.
                  </td>
                </tr>
              ) : (
                filtered.map((loc) => (
                  <tr key={loc.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                    <td className="px-4 py-3 font-medium text-slate-700">{loc.province}</td>
                    <td className="px-4 py-3 text-slate-700">{loc.district}</td>
                    <td className="px-4 py-3 text-slate-700">{loc.sector}</td>
                    <td className="px-4 py-3 text-slate-700">{loc.cell}</td>
                    <td className="px-4 py-3 text-slate-700">{loc.village}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <Pagination
            page={page}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  )
}

export default LocationsPage