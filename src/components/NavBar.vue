<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';

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

const verifyRole = (role) =>{
  if (role == 'Administrador'){
    userRole.value = true;
    vectorRole.value = true;
    areaRole.value = true;
    dashboardRole.value = true;
    talhaoRole.value = true;
    editTalhaoRole.value = true;
  }
  if (role == 'Consultor'){
    userRole.value = false;
    vectorRole.value = false;
    areaRole.value = true;
    dashboardRole.value = true;
    talhaoRole.value = false;
    editTalhaoRole.value = false;
  }
  if (role == 'Analista'){
    userRole.value = false;
    dashboardRole.value = false;
    areaRole.value = false;
    vectorRole.value = false;
    talhaoRole.value = true;
    editTalhaoRole.value = true;
  }
}

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

onMounted(()=>{
  const role = localStorage.getItem('role');
  nome.value = localStorage.getItem('nome') || 'User';
  if (role) {
    console.log(role);
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
      console.log(role);
      verifyRole(role);
    } else {
      userRole.value = false;
      vectorRole.value = false;
      areaRole.value = false;
      dashboardRole.value = false;
    }
  }
  next(); // Permitir a navegação
});
</script>

<template>
  <nav v-if="route.path !== '/'" class=" w-full grid grid-cols-6 sticky h-8 md:h-10 z-50 bg-white drop-shadow-md">
    <div class="w-fit h-8 md:h-10 p-0.5 col-span-1">
      <RouterLink to="/home">
        <img src="../assets/logo-preta-completa.svg" alt="logoVisiona.svg" class="h-full w-auto object-contain">
      </RouterLink>
    </div>

    <div class="h-8 md:h-10 col-span-3 md:col-span-4">
      <ul class="h-full w-full hidden md:flex gap-7 justify-end items-center pr-10">
        <li v-if="talhaoRole"><RouterLink to="/analista/talhoes" class="hover:text-orange-400 transition">Talhões</RouterLink></li>
        <li v-if="editTalhaoRole"><RouterLink to="/analista/edicao-talhoes" class="hover:text-orange-400 transition">Edição de Talhões</RouterLink></li>
        <li v-if="userRole"><RouterLink to="/usuario" class="hover:text-orange-400 transition">Usuários</RouterLink></li>
        <li v-if="areaRole"><RouterLink to="/areasagro" class="hover:text-orange-400 transition">Áreas Agrícolas</RouterLink></li>
        <li v-if="vectorRole"><RouterLink to="/vetor" class="hover:text-orange-400 transition">Vetores</RouterLink></li>
        <li v-if="dashboardRole"><RouterLink to="/dashboard" class="hover:text-orange-400 transition">Dashboard</RouterLink></li>
      </ul>
    </div>

    <div class="h-8 md:h-10 col-span-2 md:col-span-1 flex justify-end md:justify-center items-center gap-2 md:border-l border-gray-200 relative">
      <div @click="togglePopup" class="hidden md:flex cursor-pointer hover:text-orange-400 transition h-full w-full justify-center items-center gap-2 hover:bg-orange-100">
        <p class="text-xs md:text-base">Bem vindo, <span class="font-semibold">{{ nome }}</span></p>
        <div class="p-1 h-8 md:h-10">
          <img src="../assets/1946429.png" alt="user-icon" class="h-full w-auto object-contain">
        </div>
      </div>

      <button @click="toggleMobileMenu" class="md:hidden p-2 text-gray-700 ">
        ☰
      </button>

      <div v-if="showPopUp" class="absolute top-10 right-0 w-40 bg-white shadow-lg border rounded-md p-2">
        <p class="text-sm text-gray-700">Logado como <strong>{{ nome }}</strong></p>
        <button @click="logoff" class="mt-2 w-full bg-red-500 text-white py-1 text-sm rounded hover:bg-red-600">Logoff</button>
      </div>
    </div>
  </nav>

  <div v-if="showMobileMenu" class="z-50 absolute top-8 left-0 w-full bg-white shadow-md md:hidden p-4 flex flex-col gap-3 border-t border-gray-200">
    <RouterLink v-show="talhaoRole" to="/analista/talhoes" class="hover:text-orange-400 transition" @click="toggleMobileMenu">Talhões</RouterLink>
    <RouterLink v-show="editTalhaoRole" to="/analista/edicao-talhoes" class="hover:text-orange-400 transition" @click="toggleMobileMenu">Editor de Talhões</RouterLink>
    <RouterLink v-show="userRole" to="/usuario" class="hover:text-orange-400 transition" @click="toggleMobileMenu">Usuários</RouterLink>
    <RouterLink v-show="areaRole" to="/areasagro" class="hover:text-orange-400 transition" @click="toggleMobileMenu">Áreas Agrícolas</RouterLink>
    <RouterLink v-show="vectorRole" to="/vetor" class="hover:text-orange-400 transition" @click="toggleMobileMenu">Vetores</RouterLink>
    <RouterLink v-show="dashboardRole" to="/dashboard" class="hover:text-orange-400 transition" @click="toggleMobileMenu">Dashboard</RouterLink>
    <button @click="logoff" class="w-full bg-red-500 text-white py-1 text-sm rounded hover:bg-red-600">Logoff</button>
  </div>
</template>
