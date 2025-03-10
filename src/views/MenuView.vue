<template>
  <div class="menu-container">
    <div class="menu-header">
      <h1>Menu Principal</h1>
      <button class="logout-button" @click="logout">Sair</button>
    </div>
    <div class="menu-content">
      <p>Salve salve! Pag inicialmente vazia.</p>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      localStorage.setItem('authenticated', 'false');
      this.$router.push('/');
    }
  },
  created() {
    if (localStorage.getItem('authenticated') !== 'true') {
      this.$router.push('/');
    }
  }
}
</script>

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
