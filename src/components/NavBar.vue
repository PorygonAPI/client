<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import 'primeicons/primeicons.css'


const route = useRoute();
const router = useRouter();
const nome = ref('User');
const showPopUp = ref(false);
const showMobileMenu = ref(false);

const userRole = ref(false);
const vectorRole = ref(false);
const areaRole = ref(false);
const dashboardRole = ref(false);
const talhaoRole = ref(false);
const editTalhaoRole = ref(false);

const verifyRole = (role) => {
  if (role === 'Administrador') {
    userRole.value = true;
    vectorRole.value = true;
    areaRole.value = true;
    dashboardRole.value = true;
    talhaoRole.value = true;
    editTalhaoRole.value = true;
  }
  if (role === 'Consultor') {
    userRole.value = false;
    vectorRole.value = false;
    areaRole.value = true;
    dashboardRole.value = true;
    talhaoRole.value = false;
    editTalhaoRole.value = false;
  }
  if (role === 'Analista') {
    userRole.value = false;
    dashboardRole.value = false;
    areaRole.value = false;
    vectorRole.value = false;
    talhaoRole.value = true;
    editTalhaoRole.value = true;
  }
};

const togglePopup = () => {
  showPopUp.value = !showPopUp.value;
};

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const logoff = () => {
  showPopUp.value = false;
  showMobileMenu.value = false;
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('nome');
  router.push('/');
};

onMounted(() => {
  const role = localStorage.getItem('role');
  nome.value = localStorage.getItem('nome') || 'User';
  if (role) {
    verifyRole(role);
  } else {
    userRole.value = false;
    vectorRole.value = false;
    areaRole.value = false;
    dashboardRole.value = false;
  }
});

router.beforeEach((to, from, next) => {
  if (to.path === '/home') {
    const role = localStorage.getItem('role');
    nome.value = localStorage.getItem('nome') || 'User';
    if (role) {
      verifyRole(role);
    } else {
      userRole.value = false;
      vectorRole.value = false;
      areaRole.value = false;
      dashboardRole.value = false;
    }
  }
  next();
});
</script>

<template>
  <nav v-if="route.path !== '/'" class="navbar">
    <div class="logo-container">
      <RouterLink to="/home">
        <img src="../assets/logo-preta-completa.svg" alt="logoVisiona" class="logo">
      </RouterLink>
    </div>

    <ul class="nav-links">
      <li v-if="talhaoRole"><RouterLink to="/analista/talhoes">Talhões</RouterLink></li>
      <li v-if="editTalhaoRole"><RouterLink to="/analista/edicao-talhoes">Edição de Talhões</RouterLink></li>
      <li v-if="userRole"><RouterLink to="/usuario">Usuários</RouterLink></li>
      <li v-if="areaRole"><RouterLink to="/areasagro">Áreas Agrícolas</RouterLink></li>
      <li v-if="vectorRole"><RouterLink to="/vetor">Vetores</RouterLink></li>
      <li v-if="dashboardRole"><RouterLink to="/dashboard">Dashboard</RouterLink></li>
    </ul>

    <div class="user-container">
      <div @click="togglePopup" class="user-info">
        <p>Bem vindo, <span>{{ nome }}</span></p>
        <img src="../assets/1946429.png" alt="user-icon" class="user-icon">
      </div>

      <button @click="toggleMobileMenu" class="mobile-menu-btn">
        ☰
      </button>

      <div v-if="showPopUp" class="popup">
        <p>Logado como <strong>{{ nome }}</strong></p>
        <button @click="logoff" class="logout-btn">Logoff</button>
      </div>
    </div>
  </nav>

  <div v-if="showMobileMenu" class="mobile-menu">
    <RouterLink v-if="talhaoRole" to="/analista/talhoes" @click="toggleMobileMenu">Talhões</RouterLink>
    <RouterLink v-if="editTalhaoRole" to="/analista/edicao-talhoes" @click="toggleMobileMenu">Editor de Talhões</RouterLink>
    <RouterLink v-if="userRole" to="/usuario" @click="toggleMobileMenu">Usuários</RouterLink>
    <RouterLink v-if="areaRole" to="/areasagro" @click="toggleMobileMenu">Áreas Agrícolas</RouterLink>
    <RouterLink v-if="vectorRole" to="/vetor" @click="toggleMobileMenu">Vetores</RouterLink>
    <RouterLink v-if="dashboardRole" to="/dashboard" @click="toggleMobileMenu">Dashboard</RouterLink>
    <button @click="logoff" class="logout-btn">Logoff</button>
  </div>
</template>

<style scoped>
/* Layout principal */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background-color: rgb(221, 221, 221);
  height: 3.7rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

}

.logo-container {
  flex: 1;
}

.logo {
  height: 100%;
  max-height: 3rem;
  object-fit: contain;
}

/* Navegação de links desktop */
.nav-links {
  display: flex;
  gap: 1rem;
  list-style: none;
  flex: 3;
  justify-content: space-evenly;
  font-size: 1.3rem;
  font-weight: 500;

}

.nav-links a {
  text-decoration: none;
  color: black;
  transition: color 0.3s;

}

.nav-links a:hover {
  color: orange;
  font-weight: bold;
}

/* Área do usuário */
.user-container {
  position: relative;
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: yellow;
}

.user-info p {
  margin: 0;
  font-size: 0.9rem;
  color: black;
  font-size: 1.3rem;
  font-weight: 500;
}

.user-info span {
  font-weight: bold;
}

.user-icon {
  height: 2rem;
  object-fit: contain;
}

/* Popup do usuário */
.popup {
  position: absolute;
  top: 3.2rem;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  padding: 0.5rem;
  border-radius: 0.25rem;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
  z-index: 100;
}

.logout-btn {
  background-color: #dc2626;
  color: white;
  width: 100%;
  padding: 0.3rem 0;
  font-size: 0.9rem;
  border: none;
  border-radius: 4px;
  margin-top: 0.5rem;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #b91c1c;
}

/* Menu Mobile */
.mobile-menu {
  position: absolute;
  top: 3.7rem;
  left: 0;
  width: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 50;
}

.mobile-menu a {
  color: black;
  text-decoration: none;
}

.mobile-menu a:hover {
  color: #ffa500;
}

/* Botão hamburguer - só visível em mobile */
.mobile-menu-btn {
  display: none;
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: white;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .mobile-menu-btn {
    display: block;
  }
}
</style>
