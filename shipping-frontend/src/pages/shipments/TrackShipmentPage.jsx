import React from 'react'
import { Button } from '../../components/ui/Button'
import { trackShipment } from '../../api/shipments'

export function TrackShipmentPage() {
  const [trackingNumber, setTrackingNumber] = React.useState('')
  const [shipment, setShipment] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setShipment(null)

    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number.')
      return
    }

    try {
      setLoading(true)
      const data = await trackShipment(trackingNumber.trim())
      setShipment(data)
    } catch (err) {
      console.error('Failed to track shipment', err)
      if (err.response && err.response.status === 404) {
        setError('No shipment found with that tracking number.')
      } else {
        setError('Failed to track shipment. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Track Shipment</h1>
      <section className="rounded-lg border bg-white p-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1">
            <label className="text-xs font-medium text-gray-700" htmlFor="trackingNumber">
              Tracking number
            </label>
            <input
              id="trackingNumber"
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              placeholder="e.g. RW-2025-0001"
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Track'}
          </Button>
        </form>
        {error && (
          <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}
      </section>

      {shipment && (
        <section className="rounded-lg border bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-600">
            Shipment Details
          </h2>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium text-gray-500">Tracking number</dt>
              <dd className="text-gray-900">{shipment.trackingNumber}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500">Status</dt>
              <dd className="text-gray-900">{shipment.status}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500">Origin</dt>
              <dd className="text-gray-900">{shipment.originAddress}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500">Destination</dt>
              <dd className="text-gray-900">{shipment.destinationAddress}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500">Products</dt>
              <dd className="text-gray-900">
                {(shipment.products ?? []).length === 0
                  ? '—'
                  : (shipment.products ?? [])
                      .map((p) => p.name)
                      .join(', ')}
              </dd>
            </div>
          </dl>
        </section>
      )}
    </div>
  )
}

export default TrackShipmentPage