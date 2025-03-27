<script>
import axios from 'axios'
import CadastroArea from "@/components/CadastroArea.vue"; // Importação do componente

export default {
  components: {
    CadastroArea, // Registro do componente para uso no template
  },
  data() {
    return {
      apiResponse: '',
      error: '',
      loading: false
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token')
      this.$router.push('/');
    },
    async testApi() {
      this.loading = true
      this.error = ''
      this.apiResponse = ''

      try {
        const response = await axios.get('/api/cargos', {
          auth: {
            username: 'admin',
            password: '12345'
          },
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        this.apiResponse = response.data
      } catch (error) {
        console.error('API Error:', error)
        this.error = `Error: ${error.response?.data?.message || error.message}`
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<template>
  <div class="menu-container">
    <div class="menu-header">
      <button class="logout-button" @click="logout">Sair</button>
    </div>
    <div class="menu-content">

      <!-- Adicionando o componente CadastroArea -->
      <CadastroArea />
    </div>
  </div>
</template>

<style scoped>
.menu-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.logout-button {
  padding: 0.5rem 1rem;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #d32f2f;
}

.menu-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
</style>
