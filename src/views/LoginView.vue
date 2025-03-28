<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Bem-vindo(a)</h2>
      <img src="../assets/imagens/1200px-Logo_Visiona.png" alt="Logo Visiona" width="100%" />
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">E-mail:</label>
          <input type="text" id="email" v-model="email" required autocomplete="email" />
        </div>
        <div class="form-group">
          <label for="password">Senha:</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            autocomplete="current-password"
          />
        </div>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        <button type="submit" :disabled="isLoading" class="login-button">
          <span v-if="!isLoading">Entrar</span>
          <span v-else class="loading-spinner"></span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      isLoading: false,
      errorMessage: '',
    }
  },
  methods: {
    validateFields() {
      if (this.email === '' || this.password === '') {
        this.errorMessage = 'Preencha todos os campos'
        return false
      }
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
      if (!emailRegex.test(this.email)) {
        this.errorMessage = 'Um e-mail válido é necessário'
        return false
      }
      return true
    },
    handleLogin() {
      this.isLoading = true
      this.errorMessage = ''

      const isValid = this.validateFields()
      if (!isValid) {
        this.isLoading = false
        return
      }

      this.$axios
        .post('/auth/login', {
          email: this.email,
          senha: this.password,
        })
        .then((response) => {
          localStorage.setItem('token', response.data)
          this.$router.push('/home')
        })
        .catch((error) => {
          console.error('API Error:', error)
          this.errorMessage = 'Erro ao tentar fazer login'
          this.isLoading = false
        })
        .finally(() => {
          this.isLoading = false
        })
    },
  },
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('../assets/imagens/slide-visiona-vcub.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.login-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
}

.login-card h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.login-button {
  width: 100%;
  padding: 0.8rem;
  background-color: #ffad00;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  position: relative;
  height: 44px;
}

.login-button:hover {
  background-color: #ff6e00;
}

.login-button:disabled {
  background-color: #fed8b1;
  cursor: not-allowed;
}

.error-message {
  color: #e53935;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: center;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
