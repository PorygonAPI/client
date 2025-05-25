<template>
  <div class="login-container">
    <div class="login-card">
      <img src="../assets/imagens/Porygon__1_-removebg-preview.png" alt="Logo Visiona" class="logo" />
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">E-mail</label>
          <input type="text" id="email" v-model="email" required autocomplete="email" />
        </div>
        <div class="form-group">
          <label for="password">Senha</label>
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

      this.$fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.email,
          senha: this.password,
        }),
      })
        .then((data) => {
          localStorage.setItem('token', data.token)
          localStorage.setItem('role', data.role)
          localStorage.setItem('nome', data.nome)
          localStorage.setItem('userId', data.id)
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
/* Container full screen com background desfocado */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url('../assets/imagens/earth-11595_1920.jpg') center/cover no-repeat;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

/* Card branco com sombra e borda arredondada */
.login-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgb(0 0 0 / 0.15);
  padding: 2.5rem 3rem;
  width: 100%;
  max-width: 420px;
  text-align: center;
  animation: fadeInUp 0.5s ease forwards;
}

/* Logo centralizada e com margem inferior */
.logo {
  width: 200px;
  margin: 0 auto 2rem;
  display: block;
}


/* Título com fonte suave e cor escura */
.login-card h2 {
  font-weight: 700;
  font-size: 1.8rem;
  margin-bottom: 2rem;
  color: #2c3e50;
}

/* Grupos de formulário */
.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

/* Labels com estilo moderno */
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #34495e;
  font-size: 1.2rem;
}

/* Inputs com bordas arredondadas e sombra leve */
.form-group input {
  width: 100%;
  padding: 0.9rem 1.1rem;
  font-size: 1.3rem;
  border: 1.5px solid #d1d8e0;
  border-radius: 8px;
  transition: border-color 0.3s, box-shadow 0.3s;
  outline-offset: 2px;
}

.form-group input:hover {
  border-color: #3498db;
  box-shadow: 0 0 8px #3498dbaa;
}


/* Efeito foco azul suave */
.form-group input:focus {
  border-color: #3498db;
  box-shadow: 0 0 8px #3498dbaa;
  outline: none;
}

/* Mensagem de erro em vermelho mais suave */
.error-message {
  color: #e74c3c;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
}

/* Botão grande, arredondado e em degradê azul elegante */
.login-button {
  width: 100%;
  padding: 0.9rem;
  background: linear-gradient(90deg, #5782dd, #1550b5);
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.35s ease, box-shadow 0.35s ease;
  box-shadow: 0 4px 12px #2563ebaa;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
}

/* Hover com sombra e leve escurecimento */
.login-button:hover:not(:disabled) {
  background: linear-gradient(90deg, #1e40af, #1e3a8a); /* azul mais escuro */
  box-shadow: 0 6px 20px #1d4ed899;
}

/* Disabled */
.login-button:disabled {
  background: #93c5fd; /* azul claro */
  box-shadow: none;
  cursor: not-allowed;
  color: #e0f2fe;
}


/* Spinner animado */
.loading-spinner {
  display: inline-block;
  width: 22px;
  height: 22px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

/* Fade in animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Spinner rotate */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
