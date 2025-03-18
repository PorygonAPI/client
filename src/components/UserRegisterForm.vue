<template>
  <div class="register-container">
    <div class="register-card">
      <div class="card-header">
        <button class="back-button" type="button">
          <span>&larr;</span>
        </button>
        <h2>Cadastro de Usuário</h2>
      </div>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="fullName">Nome completo:</label>
          <input type="text" id="fullName" v-model="formData.fullName" required />
        </div>

        <div class="form-group">
          <label for="email">E-mail:</label>
          <input type="email" id="email" v-model="formData.email" required />
        </div>

        <div class="form-group">
          <label for="password">Senha:</label>
          <input type="password" id="password" v-model="formData.password" required />
        </div>

        <div class="form-group">
          <label for="role">Cargo:</label>
          <select id="role" v-model="formData.role">
            <option value="" disabled selected>Selecione um cargo</option>
          </select>
        </div>

        <div class="button-container">
          <button type="submit" class="register-button">Cadastrar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserRegisterForm',
  data() {
    return {
      formData: {
        fullName: '',
        email: '',
        password: '',
        role: ''
      }
    }
  },
  methods: {
    handleRegister() {
      console.log('Form data submitted:', this.formData)
    }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 1rem;
  background-color: white;
}

.register-card {
  background-color: white;
  border-radius: 0;
  box-shadow: none;
  padding: 2rem;
  width: 100%;
  max-width: 600px;
}

.card-header {
  position: relative;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.back-button {
  position: absolute;
  left: 0;
  top: 0;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #555;
  padding: 0;
}

.register-card h2 {
  text-align: center;
  margin-bottom: 1rem;
  color: #333;
  font-size: 1.8rem;
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #555;
  width: 100%;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #333;
  border-radius: 4px;
  font-size: 1rem;
  height: 40px;
  box-sizing: border-box;
}

.form-group select {
  background-color: white;
}

.button-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.register-button {
  width: 25%;
  padding: 0.8rem;
  background-color: #777777;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.register-button:hover {
  background-color: #555555;
}
</style>
