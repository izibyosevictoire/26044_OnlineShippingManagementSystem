import React from 'react'
import Pagination from '../../components/ui/Pagination'
import { fetchPayments, updatePayment, deletePayment } from '../../api/payments'
import { Button } from '../../components/ui/Button'

export function PaymentsPage() {
  const [page, setPage] = React.useState(1)
  const pageSize = 10
  const [payments, setPayments] = React.useState([])
  const [totalItems, setTotalItems] = React.useState(0)
  const [search, setSearch] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [selectedPayment, setSelectedPayment] = React.useState(null)
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const [saveError, setSaveError] = React.useState('')
  const [form, setForm] = React.useState({
    amount: '',
    paymentMethod: 'CASH',
    status: 'PAID',
    paymentDate: '',
  })

  React.useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError('')
        const data = await fetchPayments({ page: page - 1, size: pageSize })
        setPayments(data.content ?? [])
        setTotalItems(data.totalElements ?? data.content?.length ?? 0)
      } catch (e) {
        console.error('Failed to load payments', e)
        setError('Failed to load payments from server.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [page])

  const handleRowClick = (payment) => {
    setSelectedPayment((prev) => (prev?.id === payment.id ? null : payment))
  }

  const openEditForm = () => {
    if (!selectedPayment) return
    setSaveError('')
    setForm({
      amount: selectedPayment.amount ?? '',
      paymentMethod: selectedPayment.paymentMethod ?? 'CASH',
      status: selectedPayment.status ?? 'PAID',
      paymentDate: selectedPayment.paymentDate
        ? selectedPayment.paymentDate.slice(0, 16)
        : '',
    })
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setSaveError('')
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedPayment) return
    setSaveError('')

    const amountNumber = Number(form.amount)
    if (Number.isNaN(amountNumber) || amountNumber <= 0) {
      setSaveError('Amount must be a positive number.')
      return
    }

    const payload = {
      amount: amountNumber,
      paymentMethod: form.paymentMethod,
      status: form.status,
      paymentDate: form.paymentDate ? new Date(form.paymentDate).toISOString() : null,
    }

    if (selectedPayment.shipmentId) {
      payload.shipment = { id: selectedPayment.shipmentId }
    }

    try {
      setSaving(true)
      await updatePayment(selectedPayment.id, payload)
      setIsFormOpen(false)
      setSelectedPayment(null)
      // reload current page
      const data = await fetchPayments({ page: page - 1, size: pageSize })
      setPayments(data.content ?? [])
      setTotalItems(data.totalElements ?? data.content?.length ?? 0)
    } catch (err) {
      console.error('Failed to update payment', err)
      setSaveError('Failed to update payment.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedPayment) return
    const ok = window.confirm('Delete this payment?')
    if (!ok) return
    try {
      await deletePayment(selectedPayment.id)
      setSelectedPayment(null)
      const data = await fetchPayments({ page: page - 1, size: pageSize })
      setPayments(data.content ?? [])
      setTotalItems(data.totalElements ?? data.content?.length ?? 0)
    } catch (err) {
      console.error('Failed to delete payment', err)
      setError('Failed to delete payment.')
    }
  }

  const filtered = React.useMemo(() => {
    const term = search.toLowerCase().trim()
    if (!term) return payments
    return payments.filter((p) =>
      [
        p.primaryProductName,
        p.productNames?.join(' '),
        p.shipmentTrackingNumber,
        p.status,
        p.paymentMethod,
        p.amount,
        'unlinked payment',
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(term),
    )
  }, [search, payments])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-1">Payments</h1>
          <p className="text-sm text-slate-600">Manage and track all payment transactions</p>
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by product, shipment, status..."
          className="w-full sm:w-80 h-10 rounded-lg border border-slate-300 bg-white/70 px-4 text-sm placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          type="button"
          onClick={() => {
            setPage(1)
            fetchPayments({ page: 0, size: pageSize }).then((data) => {
              setPayments(data.content ?? [])
              setTotalItems(data.totalElements ?? data.content?.length ?? 0)
            })
          }}
          className="bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded-lg transition shadow-sm"
        >
          Refresh
        </Button>
        <Button
          type="button"
          onClick={openEditForm}
          disabled={!selectedPayment}
          className="bg-green-600 text-white hover:bg-green-700 font-semibold rounded-lg transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Edit
        </Button>
        <Button
          type="button"
          onClick={handleDelete}
          disabled={!selectedPayment}
          className="bg-red-600 text-white hover:bg-red-700 font-semibold rounded-lg transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Delete
        </Button>
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
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Method</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    Loading payments...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                    No payments found. Try adjusting your search.
                  </td>
                </tr>
              ) : (
                filtered.map((payment) => (
                  <tr
                    key={payment.id}
                    onClick={() => handleRowClick(payment)}
                    className={`border-b border-slate-100 cursor-pointer transition ${
                      selectedPayment?.id === payment.id ? 'bg-blue-50' : 'hover:bg-slate-50/50'
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-slate-700">
                      {payment.primaryProductName ||
                        (payment.productNames && payment.productNames.length > 0
                          ? payment.productNames.join(', ')
                          : payment.shipmentTrackingNumber || 'Unlinked payment')}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{payment.amount}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        payment.status === 'PAID' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{payment.paymentMethod}</td>
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

      {isFormOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl bg-white border border-slate-200 p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">Edit Payment</h2>
              <button
                type="button"
                onClick={closeForm}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                ✕
              </button>
            </div>
            {saveError && (
              <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {saveError}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700" htmlFor="amount">
                  Amount
                </label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  value={form.amount}
                  onChange={handleFormChange}
                  className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700" htmlFor="paymentMethod">
                  Method
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleFormChange}
                  className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <option value="CASH">CASH</option>
                  <option value="CARD">CARD</option>
                  <option value="MOBILE_MONEY">MOBILE_MONEY</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleFormChange}
                  className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <option value="PAID">PAID</option>
                  <option value="PENDING">PENDING</option>
                  <option value="FAILED">FAILED</option>
                  <option value="REFUNDED">REFUNDED</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700" htmlFor="paymentDate">
                  Payment date/time (optional)
                </label>
                <input
                  id="paymentDate"
                  name="paymentDate"
                  type="datetime-local"
                  value={form.paymentDate}
                  onChange={handleFormChange}
                  className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={closeForm} disabled={saving}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Update payment'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentsPage
