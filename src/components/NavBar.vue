<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import 'primeicons/primeicons.css';
import Avatar from "primevue/avatar";

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
const cargo = ref('Usuário');

const hideIcons = ref(false);
const hideText = ref(false);

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

const updateIconVisibility = () => {
  const width = window.innerWidth;
  if (width < 1313) {
    hideIcons.value = false;
    hideText.value = true;
  } else if (width < 1592) {
    hideIcons.value = true;
    hideText.value = false;
  } else {
    hideIcons.value = false;
    hideText.value = false;
  }
};

const handleResize = () => {
  if (window.innerWidth > 600) {
    showMobileMenu.value = false;
  }
  updateIconVisibility();
};

onMounted(() => {
  const role = localStorage.getItem('role');
  nome.value = localStorage.getItem('nome') || 'User';
  cargo.value = role || 'Usuário';
  if (role) {
    verifyRole(role);
  } else {
    userRole.value = false;
    vectorRole.value = false;
    areaRole.value = false;
    dashboardRole.value = false;
  }
  updateIconVisibility();
  window.addEventListener('resize', handleResize);
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('click', handleClickOutside);
});

router.beforeEach((to, from, next) => {
  if (to.path === '/home') {
    const role = localStorage.getItem('role');
    nome.value = localStorage.getItem('nome') || 'User';
    cargo.value = role || 'Usuário';
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

const mobileMenuRef = ref<HTMLElement | null>(null);

const handleClickOutside = (event: MouseEvent) => {
  const menuEl = mobileMenuRef.value;
  if (menuEl && !menuEl.contains(event.target as Node)) {
    showMobileMenu.value = false;
  }
};
</script>

<template>
  <nav v-if="route.path !== '/'" class="navbar">
    <div class="logo-container">
      <RouterLink to="/home">
        <img src="../assets/imagens/Porygon__1_-removebg-preview.png" alt="logoPorygon" class="logo" />
      </RouterLink>
    </div>
    <ul class="nav-links">
      <li v-if="talhaoRole">
        <RouterLink to="/analista/talhoes">
          <i v-if="!hideIcons" class="pi pi-map" style="font-size: 1.4rem"></i>
          <span v-if="!hideText">Talhões</span>
        </RouterLink>
      </li>
      <li v-if="editTalhaoRole">
        <RouterLink to="/analista/edicao-talhoes">
          <i v-if="!hideIcons" class="pi pi-file-edit" style="font-size: 1.4rem"></i>
          <span v-if="!hideText">Edição de Talhões</span>
        </RouterLink>
      </li>
      <li v-if="userRole">
        <RouterLink to="/usuario">
          <i v-if="!hideIcons" class="pi pi-users" style="font-size: 1.4rem"></i>
          <span v-if="!hideText">Usuários</span>
        </RouterLink>
      </li>
      <li v-if="areaRole">
        <RouterLink to="/areasagro">
          <i v-if="!hideIcons" class="pi pi-map-marker" style="font-size: 1.4rem"></i>
          <span v-if="!hideText">Áreas Agrícolas</span>
        </RouterLink>
      </li>
      <li v-if="dashboardRole">
        <RouterLink to="/dashboard">
          <i v-if="!hideIcons" class="pi pi-chart-line" style="font-size: 1.4rem"></i>
          <span v-if="!hideText">Dashboard</span>
        </RouterLink>
      </li>
    </ul>

    <div class="user-container">
      <div @click="togglePopup" class="user-info">
        <Avatar :label="nome.charAt(0).toUpperCase()" class="mr-7" size="large"
          style="background-color:  #004a80; color: #ffff" shape="circle" />
      </div>

      <button @click.stop="toggleMobileMenu" class="mobile-menu-btn">☰</button>

      <div v-if="showPopUp" class="popup">
        <p><strong>{{nome}} | {{ cargo }}</strong></p>
        <button @click="logoff" class="logout-btn">Encerrar Sessão</button>
      </div>
    </div>
  </nav>

  <div v-if="showMobileMenu" class="mobile-menu" ref="mobileMenuRef">
    <div class="mobile-user-name">Olá, {{ nome }} | {{ cargo }}</div>
    <RouterLink v-if="talhaoRole" to="/analista/talhoes" @click="toggleMobileMenu">Talhões</RouterLink>
    <RouterLink v-if="editTalhaoRole" to="/analista/edicao-talhoes" @click="toggleMobileMenu">Editor de Talhões
    </RouterLink>
    <RouterLink v-if="userRole" to="/usuario" @click="toggleMobileMenu">Usuários</RouterLink>
    <RouterLink v-if="areaRole" to="/areasagro" @click="toggleMobileMenu">Áreas Agrícolas</RouterLink>
    <RouterLink v-if="dashboardRole" to="/dashboard" @click="toggleMobileMenu">Dashboard</RouterLink>
    <button @click="logoff" class="logout-btn">Encerrar sessão</button>
  </div>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background-color: #FFFFFF;
  height: 4rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
}

.logo-container {
  flex: 1;
  padding-left: 1.3rem;
}

.logo {
  height: 100%;
  max-height: 4.7rem;
  object-fit: contain;
}

.nav-links {
  display: flex;
  gap: 1rem;
  list-style: none;
  flex: 2;
  justify-content: space-evenly;
  font-size: 1.2rem;
  font-weight: 500;
}

.nav-links a {
  text-decoration: none;
  color: #1b3a71;
  font-weight: 700; /* peso intermediário para evitar salto */
  transition: color 0.3s, font-weight 0.3s;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.nav-links a:hover {
  font-weight: 900; /* negrito forte */
  color: #000;
}

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

.user-info p {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 500;
  color: black;
}

.popup {
  position: absolute;
  top: 3.2rem;
  right: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 0.75rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  padding: 1.5rem;
  min-width: 220px;
  font-size: 1.3rem;
  font-weight: 500;
  color: #000;
  z-index: 100;
}

.logout-btn {
  background-color: #dc2626;
  color: white;
  width: 100%;
  padding: 0.3rem 0;
  font-size: 1.1rem;
  border: none;
  border-radius: 4px;
  margin-top: 0.5rem;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #b91c1c;
}

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

.mobile-user-name {
  font-weight: 600;
  font-size: 1.3rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #ddd;
  margin-bottom: 0.75rem;
  color: #333;
}

.mobile-menu a {
  color: black;
  text-decoration: none;
}

.mobile-menu a:hover {
  color: #ffa500;
}

.mobile-menu-btn {
  display: none;
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: black;
}

/* Exibir o botão hamburger só em telas <= 600px */
@media (max-width: 600px) {
  .nav-links {
    display: none;
  }

  .mobile-menu-btn {
    display: block;
  }
}
</style>
