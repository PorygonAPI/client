import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = '/'
    }
    /**TODO: Remover esse bloco abaixo após integração estiver completa */
    if (error.config.url === '/auth/login' && error.config.method === 'post') {
      const { email, senha } = JSON.parse(error.config.data)
      if (email === 'admin@teste.com' && senha === 'admin') {
        return Promise.resolve({
          status: 200,
          statusText: 'OK',
          data: 'mocked-token',
          headers: {},
          config: error.config,
          request: error.request,
        })
      }
    }


    return Promise.reject(error)
  },
)

export default {
  install: (app) => {
    app.config.globalProperties.$axios = instance
  },
}
