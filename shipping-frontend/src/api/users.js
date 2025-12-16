import apiClient from './axiosInstance'

// Backend: UserController is mapped at /api/users

export async function fetchUsers({ page = 0, size = 10 }) {
  const response = await apiClient.get('/users', {
    params: { page, size },
  })
  return response.data // Page<User>
}

export async function createUser(payload) {
  const response = await apiClient.post('/users', payload)
  return response.data
}

export default {
  fetchUsers,
  createUser,
}
