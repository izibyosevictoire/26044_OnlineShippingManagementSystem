import React from 'react'
import Pagination from '../../components/ui/Pagination'
import { Button } from '../../components/ui/Button'
import { fetchShipments, createShipment, updateShipment, deleteShipment } from '../../api/shipments'
import { fetchProducts } from '../../api/products'
import { createPayment } from '../../api/payments'
import { apiClient } from '../../api/axiosInstance'

export function ShipmentsListPage() {
  const [page, setPage] = React.useState(1) // 1-based for UI
  const pageSize = 10
  const [shipments, setShipments] = React.useState([])
  const [totalItems, setTotalItems] = React.useState(0)
  const [search, setSearch] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const [saving, setSaving] = React.useState(false)
  const [saveError, setSaveError] = React.useState('')
  const [editingId, setEditingId] = React.useState(null)
  const [formMode, setFormMode] = React.useState('create') // 'create' | 'edit'
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [selectedShipment, setSelectedShipment] = React.useState(null)

  const [form, setForm] = React.useState({
    trackingNumber: '',
    originProvince: '',
    originDistrict: '',
    originSector: '',
    originCell: '',
    originVillage: '',
    destinationProvince: '',
    destinationDistrict: '',
    destinationSector: '',
    destinationCell: '',
    destinationVillage: '',
    status: 'PENDING',
    productIds: [],
    paymentAmount: '',
    paymentMethod: 'CASH',
  })

  const [provinces, setProvinces] = React.useState([])
  const [products, setProducts] = React.useState([])

  const [originDistricts, setOriginDistricts] = React.useState([])
  const [originSectors, setOriginSectors] = React.useState([])
  const [originCells, setOriginCells] = React.useState([])
  const [originVillages, setOriginVillages] = React.useState([])

  const [destinationDistricts, setDestinationDistricts] = React.useState([])
  const [destinationSectors, setDestinationSectors] = React.useState([])
  const [destinationCells, setDestinationCells] = React.useState([])
  const [destinationVillages, setDestinationVillages] = React.useState([])

  async function loadShipments(pageToLoad = page) {
    try {
      setLoading(true)
      setError('')
      const data = await fetchShipments({ page: pageToLoad - 1, size: pageSize })
      setShipments(data.content ?? [])
      setTotalItems(data.totalElements ?? data.content?.length ?? 0)
    } catch (e) {
      console.error('Failed to load shipments', e)
      setError('Failed to load shipments from server.')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    loadShipments(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  // Load provinces for Rwandan locations and products for shipment product dropdown
  React.useEffect(() => {
    async function loadMetadata() {
      try {
        const [provRes, productsPage] = await Promise.all([
          apiClient.get('/locations/provinces'),
          fetchProducts({ page: 0, size: 50 }),
        ])
        setProvinces(provRes.data ?? [])
        const data = productsPage
        const items = data.content ?? data
        setProducts(items ?? [])
      } catch (e) {
        console.error('Failed to load provinces/products', e)
      }
    }
    loadMetadata()
  }, [])

  // Location hierarchy loaders
  const loadOriginDistricts = async (province) => {
    if (!province) {
      setOriginDistricts([])
      setOriginSectors([])
      setOriginCells([])
      setOriginVillages([])
      return
    }
    try {
      const res = await apiClient.get(`/locations/provinces/${encodeURIComponent(province)}/districts`)
      setOriginDistricts(res.data ?? [])
      setOriginSectors([])
      setOriginCells([])
      setOriginVillages([])
    } catch (e) {
      console.error('Failed to load origin districts', e)
    }
  }

  const loadOriginSectors = async (district) => {
    if (!district) {
      setOriginSectors([])
      setOriginCells([])
      setOriginVillages([])
      return
    }
    try {
      const res = await apiClient.get(`/locations/districts/${encodeURIComponent(district)}/sectors`)
      setOriginSectors(res.data ?? [])
      setOriginCells([])
      setOriginVillages([])
    } catch (e) {
      console.error('Failed to load origin sectors', e)
    }
  }

  const loadOriginCells = async (sector) => {
    if (!sector) {
      setOriginCells([])
      setOriginVillages([])
      return
    }
    try {
      const res = await apiClient.get(`/locations/sectors/${encodeURIComponent(sector)}/cells`)
      setOriginCells(res.data ?? [])
      setOriginVillages([])
    } catch (e) {
      console.error('Failed to load origin cells', e)
    }
  }

  const loadOriginVillages = async (cell) => {
    if (!cell) {
      setOriginVillages([])
      return
    }
    try {
      const res = await apiClient.get(`/locations/cells/${encodeURIComponent(cell)}/villages`)
      setOriginVillages(res.data ?? [])
    } catch (e) {
      console.error('Failed to load origin villages', e)
    }
  }

  const loadDestinationDistricts = async (province) => {
    if (!province) {
      setDestinationDistricts([])
      setDestinationSectors([])
      setDestinationCells([])
      setDestinationVillages([])
      return
    }
    try {
      const res = await apiClient.get(`/locations/provinces/${encodeURIComponent(province)}/districts`)
      setDestinationDistricts(res.data ?? [])
      setDestinationSectors([])
      setDestinationCells([])
      setDestinationVillages([])
    } catch (e) {
      console.error('Failed to load destination districts', e)
    }
  }

  const loadDestinationSectors = async (district) => {
    if (!district) {
      setDestinationSectors([])
      setDestinationCells([])
      setDestinationVillages([])
      return
    }
    try {
      const res = await apiClient.get(`/locations/districts/${encodeURIComponent(district)}/sectors`)
      setDestinationSectors(res.data ?? [])
      setDestinationCells([])
      setDestinationVillages([])
    } catch (e) {
      console.error('Failed to load destination sectors', e)
    }
  }

  const loadDestinationCells = async (sector) => {
    if (!sector) {
      setDestinationCells([])
      setDestinationVillages([])
      return
    }
    try {
      const res = await apiClient.get(`/locations/sectors/${encodeURIComponent(sector)}/cells`)
      setDestinationCells(res.data ?? [])
      setDestinationVillages([])
    } catch (e) {
      console.error('Failed to load destination cells', e)
    }
  }

  const loadDestinationVillages = async (cell) => {
    if (!cell) {
      setDestinationVillages([])
      return
    }
    try {
      const res = await apiClient.get(`/locations/cells/${encodeURIComponent(cell)}/villages`)
      setDestinationVillages(res.data ?? [])
    } catch (e) {
      console.error('Failed to load destination villages', e)
    }
  }

  const filtered = React.useMemo(() => {
    const term = search.toLowerCase().trim()
    if (!term) return shipments
    return shipments.filter((s) =>
      [s.trackingNumber, s.status, s.originAddress, s.destinationAddress]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(term),
    )
  }, [search, shipments])

  const handleBasicChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleProductsChange = (e) => {
    const selectedIds = Array.from(e.target.selectedOptions).map((opt) => Number(opt.value))
    setForm((prev) => ({ ...prev, productIds: selectedIds }))
  }

  const handleOriginProvinceChange = (e) => {
    const province = e.target.value
    setForm((prev) => ({
      ...prev,
      originProvince: province,
      originDistrict: '',
      originSector: '',
      originCell: '',
      originVillage: '',
    }))
    loadOriginDistricts(province)
  }

  const handleOriginDistrictChange = (e) => {
    const district = e.target.value
    setForm((prev) => ({
      ...prev,
      originDistrict: district,
      originSector: '',
      originCell: '',
      originVillage: '',
    }))
    loadOriginSectors(district)
  }

  const handleOriginSectorChange = (e) => {
    const sector = e.target.value
    setForm((prev) => ({
      ...prev,
      originSector: sector,
      originCell: '',
      originVillage: '',
    }))
    loadOriginCells(sector)
  }

  const handleOriginCellChange = (e) => {
    const cell = e.target.value
    setForm((prev) => ({
      ...prev,
      originCell: cell,
      originVillage: '',
    }))
    loadOriginVillages(cell)
  }

  const handleOriginVillageChange = (e) => {
    const village = e.target.value
    setForm((prev) => ({
      ...prev,
      originVillage: village,
    }))
  }

  const handleDestinationProvinceChange = (e) => {
    const province = e.target.value
    setForm((prev) => ({
      ...prev,
      destinationProvince: province,
      destinationDistrict: '',
      destinationSector: '',
      destinationCell: '',
      destinationVillage: '',
    }))
    loadDestinationDistricts(province)
  }

  const handleDestinationDistrictChange = (e) => {
    const district = e.target.value
    setForm((prev) => ({
      ...prev,
      destinationDistrict: district,
      destinationSector: '',
      destinationCell: '',
      destinationVillage: '',
    }))
    loadDestinationSectors(district)
  }

  const handleDestinationSectorChange = (e) => {
    const sector = e.target.value
    setForm((prev) => ({
      ...prev,
      destinationSector: sector,
      destinationCell: '',
      destinationVillage: '',
    }))
    loadDestinationCells(sector)
  }

  const handleDestinationCellChange = (e) => {
    const cell = e.target.value
    setForm((prev) => ({
      ...prev,
      destinationCell: cell,
      destinationVillage: '',
    }))
    loadDestinationVillages(cell)
  }

  const handleDestinationVillageChange = (e) => {
    const village = e.target.value
    setForm((prev) => ({
      ...prev,
      destinationVillage: village,
    }))
  }

  const resetForm = () => {
    setForm({
      trackingNumber: '',
      originProvince: '',
      originDistrict: '',
      originSector: '',
      originCell: '',
      originVillage: '',
      destinationProvince: '',
      destinationDistrict: '',
      destinationSector: '',
      destinationCell: '',
      destinationVillage: '',
      status: 'PENDING',
      productIds: [],
      paymentAmount: '',
      paymentMethod: 'CASH',
    })
    setEditingId(null)
    setSaveError('')
    setOriginDistricts([])
    setOriginSectors([])
    setOriginCells([])
    setOriginVillages([])
    setDestinationDistricts([])
    setDestinationSectors([])
    setDestinationCells([])
    setDestinationVillages([])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaveError('')

    // basic shipment validation
    if (
      !form.trackingNumber ||
      !form.originProvince ||
      !form.originDistrict ||
      !form.originSector ||
      !form.originCell ||
      !form.originVillage ||
      !form.destinationProvince ||
      !form.destinationDistrict ||
      !form.destinationSector ||
      !form.destinationCell ||
      !form.destinationVillage
    ) {
      setSaveError('Tracking number, origin and destination (up to village) are required.')
      return
    }

    if (form.productIds.length === 0) {
      setSaveError('Please select at least one product for this shipment.')
      return
    }

    // optional payment validation
    let paymentAmountNumber = null
    if (form.paymentAmount !== '') {
      paymentAmountNumber = Number(form.paymentAmount)
      if (Number.isNaN(paymentAmountNumber) || paymentAmountNumber <= 0) {
        setSaveError('Payment amount must be a positive number.')
        return
      }
    }

    const originAddress = [
      form.originProvince,
      form.originDistrict,
      form.originSector,
      form.originCell,
      form.originVillage,
    ].join(' / ')

    const destinationAddress = [
      form.destinationProvince,
      form.destinationDistrict,
      form.destinationSector,
      form.destinationCell,
      form.destinationVillage,
    ].join(' / ')

    const payload = {
      trackingNumber: form.trackingNumber,
      originAddress,
      destinationAddress,
      status: form.status,
    }

    if (form.productIds.length > 0) {
      payload.products = form.productIds.map((id) => ({ id }))
    }

    try {
      setSaving(true)
      let savedShipment
      if (editingId) {
        savedShipment = await updateShipment(editingId, payload)
      } else {
        savedShipment = await createShipment(payload)
      }

      // If user entered payment info, create a payment linked to this shipment
      if (!editingId && paymentAmountNumber !== null) {
        try {
          await createPayment({
            shipment: { id: savedShipment.id },
            amount: paymentAmountNumber,
            paymentMethod: form.paymentMethod || 'CASH',
            status: 'PAID',
            paymentDate: new Date().toISOString(),
          })
        } catch (payErr) {
          console.error('Failed to create payment for shipment', payErr)
          // Do not block shipment creation because of payment
        }
      }
      resetForm()
      setIsFormOpen(false)
      setFormMode('create')
      setSelectedShipment(null)
      // Reload first page to see newest/updated shipment
      setPage(1)
      await loadShipments(1)
    } catch (e) {
      console.error('Failed to save shipment', e)
      setSaveError('Failed to save shipment. Make sure tracking number is unique and required fields are valid.')
    } finally {
      setSaving(false)
    }
  }

  const openCreateForm = () => {
    setFormMode('create')
    resetForm()
    setIsFormOpen(true)
  }

  const openEditForm = (shipment) => {
    const target = shipment || selectedShipment
    if (!target) return
    setFormMode('edit')
    setSaveError('')
    setEditingId(target.id)

    const parseAddress = (address) => (address ?? '').split(' / ')
    const [oProv, oDist, oSect, oCell, oVill] = parseAddress(target.originAddress)
    const [dProv, dDist, dSect, dCell, dVill] = parseAddress(target.destinationAddress)

    setForm({
      trackingNumber: target.trackingNumber ?? '',
      originProvince: oProv || '',
      originDistrict: oDist || '',
      originSector: oSect || '',
      originCell: oCell || '',
      originVillage: oVill || '',
      destinationProvince: dProv || '',
      destinationDistrict: dDist || '',
      destinationSector: dSect || '',
      destinationCell: dCell || '',
      destinationVillage: dVill || '',
      status: target.status ?? 'PENDING',
      productIds: (target.products ?? []).map((p) => p.id),
      paymentAmount: '',
      paymentMethod: 'CASH',
    })

    if (oProv) {
      loadOriginDistricts(oProv)
      if (oDist) {
        loadOriginSectors(oDist)
        if (oSect) {
          loadOriginCells(oSect)
          if (oCell) {
            loadOriginVillages(oCell)
          }
        }
      }
    }
    if (dProv) {
      loadDestinationDistricts(dProv)
      if (dDist) {
        loadDestinationSectors(dDist)
        if (dSect) {
          loadDestinationCells(dSect)
          if (dCell) {
            loadDestinationVillages(dCell)
          }
        }
      }
    }

    setIsFormOpen(true)
  }

  const handleDeleteSelected = async () => {
    if (!selectedShipment) return
    const ok = window.confirm(`Delete shipment ${selectedShipment.trackingNumber}?`)
    if (!ok) return
    try {
      await deleteShipment(selectedShipment.id)
      setSelectedShipment(null)
      await loadShipments(page)
    } catch (e) {
      console.error('Failed to delete shipment', e)
      setError('Failed to delete shipment.')
    }
  }

  const handleRowClick = (shipment) => {
    setSelectedShipment((prev) => (prev?.id === shipment.id ? null : shipment))
  }

  const closeForm = () => {
    setIsFormOpen(false)
    resetForm()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-1">Shipments</h1>
          <p className="text-sm text-slate-600">Create, manage, and track all shipments</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button type="button" onClick={openCreateForm} className="bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded-lg transition shadow-sm">
            Create
          </Button>
          <Button
            type="button"
            onClick={() => openEditForm()}
            disabled={!selectedShipment}
            className="bg-green-600 text-white hover:bg-green-700 font-semibold rounded-lg transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Edit
          </Button>
          <Button
            type="button"
            onClick={handleDeleteSelected}
            disabled={!selectedShipment}
            className="bg-red-600 text-white hover:bg-red-700 font-semibold rounded-lg transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="flex justify-end">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by tracking, status, origin, destination..."
          className="w-full sm:w-80 h-10 rounded-lg border border-slate-300 bg-white/70 px-4 text-sm placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
        />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white/70 backdrop-blur-sm p-6 shadow-sm hover:shadow-md transition">
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
                <th className="px-4 py-3">Tracking Number</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Origin</th>
                <th className="px-4 py-3">Destination</th>
                <th className="px-4 py-3">Products</th>
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
                    Loading shipments...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No shipments found. Try adjusting your search or create a new shipment.
                  </td>
                </tr>
              ) : (
                filtered.map((shipment) => (
                  <tr
                    key={shipment.id}
                    onClick={() => handleRowClick(shipment)}
                    className={`border-b border-slate-100 cursor-pointer transition ${
                      selectedShipment?.id === shipment.id ? 'bg-blue-50' : 'hover:bg-slate-50/50'
                    }`}
                  >
                    <td className="px-4 py-3 font-semibold text-blue-600">{shipment.trackingNumber}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        shipment.status === 'DELIVERED' 
                          ? 'bg-green-100 text-green-700' 
                          : shipment.status === 'IN_TRANSIT'
                          ? 'bg-orange-100 text-orange-700'
                          : shipment.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{shipment.originAddress}</td>
                    <td className="px-4 py-3 text-slate-700">{shipment.destinationAddress}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {(shipment.products ?? [])
                        .map((p) => p.name)
                        .join(', ')}
                    </td>
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
      </section>

      {isFormOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">
                {formMode === 'edit' ? 'Edit Shipment' : 'New Shipment'}
              </h2>
              <button
                type="button"
                onClick={closeForm}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                ✕
              </button>
            </div>
            {saveError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {saveError}
              </div>
            )}
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-medium text-gray-700" htmlFor="trackingNumber">
                  Tracking number
                </label>
                <input
                  id="trackingNumber"
                  name="trackingNumber"
                  value={form.trackingNumber}
                  onChange={handleBasicChange}
                  className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  placeholder="e.g. RW-2025-0001"
                  required
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase text-gray-600">Origin</p>
                <div className="space-y-2">
                  <select
                    id="originProvince"
                    value={form.originProvince}
                    onChange={handleOriginProvinceChange}
                    className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    required
                  >
                    <option value="">Select province</option>
                    {provinces.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <select
                    id="originDistrict"
                    value={form.originDistrict}
                    onChange={handleOriginDistrictChange}
                    className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    disabled={!originDistricts.length}
                    required
                  >
                    <option value="">Select district</option>
                    {originDistricts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <select
                    id="originSector"
                    value={form.originSector}
                    onChange={handleOriginSectorChange}
                    className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    disabled={!originSectors.length}
                    required
                  >
                    <option value="">Select sector</option>
                    {originSectors.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <select
                    id="originCell"
                    value={form.originCell}
                    onChange={handleOriginCellChange}
                    className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    disabled={!originCells.length}
                    required
                  >
                    <option value="">Select cell</option>
                    {originCells.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <select
                    id="originVillage"
                    value={form.originVillage}
                    onChange={handleOriginVillageChange}
                    className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    disabled={!originVillages.length}
                    required
                  >
                    <option value="">Select village</option>
                    {originVillages.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase text-gray-600">Destination</p>
                <div className="space-y-2">
                  <select
                    id="destinationProvince"
                    value={form.destinationProvince}
                    onChange={handleDestinationProvinceChange}
                    className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    required
                  >
                    <option value="">Select province</option>
                    {provinces.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <select
                    id="destinationDistrict"
                    value={form.destinationDistrict}
                    onChange={handleDestinationDistrictChange}
                    className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    disabled={!destinationDistricts.length}
                    required
                  >
                    <option value="">Select district</option>
                    {destinationDistricts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <select
                    id="destinationSector"
                    value={form.destinationSector}
                    onChange={handleDestinationSectorChange}
                    className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    disabled={!destinationSectors.length}
                    required
                  >
                    <option value="">Select sector</option>
                    {destinationSectors.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <select
                    id="destinationCell"
                    value={form.destinationCell}
                    onChange={handleDestinationCellChange}
                    className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    disabled={!destinationCells.length}
                    required
                  >
                    <option value="">Select cell</option>
                    {destinationCells.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <select
                    id="destinationVillage"
                    value={form.destinationVillage}
                    onChange={handleDestinationVillageChange}
                    className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    disabled={!destinationVillages.length}
                    required
                  >
                    <option value="">Select village</option>
                    {destinationVillages.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700" htmlFor="status">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleBasicChange}
                  className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="IN_TRANSIT">IN_TRANSIT</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700" htmlFor="products">
                  Products in this shipment
                </label>
                <select
                  id="products"
                  multiple
                  value={form.productIds.map(String)}
                  onChange={handleProductsChange}
                  className="h-24 w-full rounded-md border border-gray-300 px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-gray-500">
                  Hold Ctrl (Cmd on Mac) to select multiple products.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700" htmlFor="paymentAmount">
                  Payment amount (optional)
                </label>
                <input
                  id="paymentAmount"
                  name="paymentAmount"
                  type="number"
                  step="0.01"
                  value={form.paymentAmount}
                  onChange={handleBasicChange}
                  className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700" htmlFor="paymentMethod">
                  Payment method
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={form.paymentMethod}
                  onChange={handleBasicChange}
                  className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <option value="CASH">CASH</option>
                  <option value="CARD">CARD</option>
                  <option value="MOBILE_MONEY">MOBILE_MONEY</option>
                </select>
              </div>

              <div className="md:col-span-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : formMode === 'edit' ? 'Update shipment' : 'Create shipment'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShipmentsListPage
