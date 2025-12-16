import axios from 'axios'

// Adjust baseURL if your Spring Boot server runs on a different port or context path
export const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
})

// Attach token later when we implement auth
apiClient.interceptors.request.use((config) => {
  // const token = localStorage.getItem('accessToken')
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`
  // }
  return config
})

export default apiClient
