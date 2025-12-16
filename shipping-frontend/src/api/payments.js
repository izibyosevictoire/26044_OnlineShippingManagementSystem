import apiClient from './axiosInstance'

// Backend: PaymentController is mapped at /api/payments

export async function fetchPayments({ page = 0, size = 10 }) {
  const response = await apiClient.get('/payments', {
    params: { page, size },
  })
  return response.data // Page<Payment>
}

export async function createPayment(payload) {
  const response = await apiClient.post('/payments', payload)
  return response.data
}

export async function updatePayment(id, payload) {
  const response = await apiClient.put(`/payments/${id}`, payload)
  return response.data
}

export async function deletePayment(id) {
  await apiClient.delete(`/payments/${id}`)
}

export default {
  fetchPayments,
  createPayment,
  updatePayment,
  deletePayment,
}
