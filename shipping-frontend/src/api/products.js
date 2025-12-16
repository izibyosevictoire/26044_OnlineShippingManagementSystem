import apiClient from './axiosInstance'

// Backend: ProductController is mapped at /api/products

export async function fetchProducts({ page = 0, size = 10 }) {
  const response = await apiClient.get('/products', {
    params: { page, size },
  })
  return response.data // Spring Data Page<Product>
}

export async function createProduct(payload) {
  const response = await apiClient.post('/products', payload)
  return response.data
}

export async function updateProduct(id, payload) {
  const response = await apiClient.put(`/products/${id}`, payload)
  return response.data
}

export async function deleteProduct(id) {
  await apiClient.delete(`/products/${id}`)
}

export default {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
}