import React from 'react'
import Pagination from '../../components/ui/Pagination'
import { Button } from '../../components/ui/Button'
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../api/products'

export function ProductsPage() {
  const [page, setPage] = React.useState(1)
  const pageSize = 10
  const [products, setProducts] = React.useState([])
  const [totalItems, setTotalItems] = React.useState(0)
  const [search, setSearch] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const [saving, setSaving] = React.useState(false)
  const [saveError, setSaveError] = React.useState('')
  const [editingId, setEditingId] = React.useState(null)
  const [formMode, setFormMode] = React.useState('create') // 'create' | 'edit'
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [selectedProduct, setSelectedProduct] = React.useState(null)
  const [form, setForm] = React.useState({
    name: '',
    description: '',
    price: '',
    weight: '',
  })

  async function loadProducts(pageToLoad = page) {
    try {
      setLoading(true)
      setError('')
      const data = await fetchProducts({ page: pageToLoad - 1, size: pageSize })
      setProducts(data.content ?? [])
      setTotalItems(data.totalElements ?? data.content?.length ?? 0)
    } catch (e) {
      console.error('Failed to load products', e)
      setError('Failed to load products from server.')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    loadProducts(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const filtered = React.useMemo(() => {
    const term = search.toLowerCase().trim()
    if (!term) return products
    return products.filter((p) =>
      [p.name, p.description, p.price, p.weight]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(term),
    )
  }, [search, products])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', weight: '' })
    setEditingId(null)
    setSaveError('')
  }

  const openCreateForm = () => {
    setFormMode('create')
    resetForm()
    setIsFormOpen(true)
  }

  const openEditForm = (product) => {
    const target = product || selectedProduct
    if (!target) return
    setFormMode('edit')
    setEditingId(target.id)
    setSaveError('')
    setForm({
      name: target.name ?? '',
      description: target.description ?? '',
      price: target.price ?? '',
      weight: target.weight ?? '',
    })
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    resetForm()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaveError('')

    if (!form.name || !form.price) {
      setSaveError('Name and price are required.')
      return
    }

    const priceValue = Number(form.price)
    const weightValue = form.weight === '' ? null : Number(form.weight)

    if (Number.isNaN(priceValue) || priceValue <= 0) {
      setSaveError('Price must be a positive number.')
      return
    }

    if (weightValue !== null && (Number.isNaN(weightValue) || weightValue < 0)) {
      setSaveError('Weight must be zero or a positive number.')
      return
    }

    const payload = {
      name: form.name,
      description: form.description,
      price: priceValue,
      weight: weightValue,
    }

    try {
      setSaving(true)
      if (editingId) {
        await updateProduct(editingId, payload)
      } else {
        await createProduct(payload)
      }
      resetForm()
      setPage(1)
      await loadProducts(1)
    } catch (e) {
      console.error('Failed to save product', e)
      setSaveError('Failed to save product. Make sure name is unique and fields are valid.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteSelected = async () => {
    if (!selectedProduct) return
    const ok = window.confirm(`Delete product ${selectedProduct.name}?`)
    if (!ok) return
    try {
      await deleteProduct(selectedProduct.id)
      setSelectedProduct(null)
      await loadProducts(page)
    } catch (e) {
      console.error('Failed to delete product', e)
      setError('Failed to delete product.')
    }
  }

  const handleRowClick = (product) => {
    setSelectedProduct((prev) => (prev?.id === product.id ? null : product))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-1">Products</h1>
          <p className="text-sm text-slate-600">Manage and catalog all shipping products</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button type="button" onClick={openCreateForm} className="bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded-lg transition shadow-sm">
            Create
          </Button>
          <Button
            type="button"
            onClick={() => openEditForm()}
            disabled={!selectedProduct}
            className="bg-green-600 text-white hover:bg-green-700 font-semibold rounded-lg transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Edit
          </Button>
          <Button
            type="button"
            onClick={handleDeleteSelected}
            disabled={!selectedProduct}
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
          placeholder="Search by name, description, price..."
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
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Weight</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-right">Actions</th>
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
                    Loading products...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    No products found. Try adjusting your search.
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr
                    key={product.id}
                    onClick={() => handleRowClick(product)}
                    className={`border-b border-slate-100 cursor-pointer transition ${
                      selectedProduct?.id === product.id ? 'bg-blue-50' : 'hover:bg-slate-50/50'
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-slate-700">{product.name}</td>
                    <td className="px-4 py-3 text-slate-700">${product.price}</td>
                    <td className="px-4 py-3 text-slate-700">{product.weight ? `${product.weight} kg` : '-'}</td>
                    <td className="px-4 py-3 text-slate-700 truncate">{product.description}</td>
                    <td className="px-4 py-3 text-right text-xs text-slate-500">Click to select</td>
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
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {formMode === 'edit' ? 'Edit Product' : 'New Product'}
              </h2>
              <button
                type="button"
                onClick={closeForm}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            {saveError && (
              <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {saveError}
              </div>
            )}
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-medium text-gray-700" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700" htmlFor="price">
                  Price
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700" htmlFor="weight">
                  Weight (kg)
                </label>
                <input
                  id="weight"
                  name="weight"
                  type="number"
                  step="0.01"
                  value={form.weight}
                  onChange={handleChange}
                  className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-medium text-gray-700" htmlFor="description">
                  Description
                </label>
                <input
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="h-9 w-full rounded-md border border-gray-300 px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                />
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
                  {saving ? 'Saving...' : formMode === 'edit' ? 'Update product' : 'Create product'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductsPage