<template>
  <div class="error-container">
    <div class="error-card">
      <h2>Erro de Autenticação</h2>
      <p>{{ errorMessage || 'Ocorreu um erro durante o login. Verifique suas credenciais e tente novamente.' }}</p>
      <button @click="goToLogin" class="return-button">Voltar para Login</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      errorMessage: this.$route.query.message || ''
    }
  },
  methods: {
    goToLogin() {
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.error-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  text-align: center;
}

.error-card h2 {
  color: #e53935;
  margin-bottom: 1rem;
}

.error-card p {
  margin-bottom: 1.5rem;
  color: #555;
  line-height: 1.5;
}

.return-button {
  padding: 0.8rem 1.5rem;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.return-button:hover {
  background-color: #3367d6;
}
</style>
