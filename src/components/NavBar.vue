<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';

const route = useRoute();
const router = useRouter();
const nome = ref('Teste');
const showPopUp = ref(false);
const showMobileMenu = ref(false);

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
  router.push('/');
};
</script>

<template>
  <nav v-if="route.path !== '/'" class="grid grid-cols-6 sticky w-screen h-8 md:h-10 z-50 bg-white drop-shadow-md">
    <div class="w-fit h-8 md:h-10 p-0.5 col-span-1">
      <RouterLink to="/menu">
        <img src="../assets/logo-preta-completa.svg" alt="logoVisiona.svg" class="h-full w-auto object-contain">
      </RouterLink>
    </div>

    <div class="h-8 md:h-10 col-span-3 md:col-span-4">
      <ul class="h-full w-full hidden md:flex gap-7 justify-end items-center pr-10">
        <li><RouterLink to="/usuario" class="hover:text-orange-400 transition">Usuários</RouterLink></li>
        <li><RouterLink to="" class="hover:text-orange-400 transition">Áreas Agrícolas</RouterLink></li>
        <li><RouterLink to="" class="hover:text-orange-400 transition">Vetores</RouterLink></li>
        <li><RouterLink to="" class="hover:text-orange-400 transition">Dashboard</RouterLink></li>
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

  <div v-if="showMobileMenu" class="absolute top-8 left-0 w-full bg-white shadow-md md:hidden p-4 flex flex-col gap-3 border-t border-gray-200">
    <RouterLink to="" class="hover:text-orange-400 transition" @click="toggleMobileMenu">Usuários</RouterLink>
    <RouterLink to="" class="hover:text-orange-400 transition" @click="toggleMobileMenu">Áreas Agrícolas</RouterLink>
    <RouterLink to="" class="hover:text-orange-400 transition" @click="toggleMobileMenu">Vetores</RouterLink>
    <RouterLink to="" class="hover:text-orange-400 transition" @click="toggleMobileMenu">Dashboard</RouterLink>
    <button @click="logoff" class="w-full bg-red-500 text-white py-1 text-sm rounded hover:bg-red-600">Logoff</button>
  </div>
</template>
