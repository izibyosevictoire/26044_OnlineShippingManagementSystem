import apiClient from './axiosInstance'

// Backend: ShipmentController is mapped at /api/shipments

export async function fetchShipments({ page = 0, size = 10 }) {
  const response = await apiClient.get('/shipments', {
    params: { page, size },
  })
  return response.data // Spring Data Page<Shipment>
}

export async function fetchShipmentById(id) {
  const response = await apiClient.get(`/shipments/${id}`)
  return response.data
}

export async function createShipment(payload) {
  const response = await apiClient.post('/shipments', payload)
  return response.data
}

export async function updateShipment(id, payload) {
  const response = await apiClient.put(`/shipments/${id}`, payload)
  return response.data
}

export async function deleteShipment(id) {
  await apiClient.delete(`/shipments/${id}`)
}

export async function trackShipment(trackingNumber) {
  const response = await apiClient.get(`/shipments/track/${trackingNumber}`)
  return response.data
}

export async function fetchShipmentSummary() {
  const response = await apiClient.get('/shipments/summary')
  return response.data
}

export default {
  fetchShipments,
  fetchShipmentById,
  createShipment,
  updateShipment,
  deleteShipment,
  trackShipment,
  fetchShipmentSummary,
}
