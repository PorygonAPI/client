<script setup>
import { RouterLink } from 'vue-router';
import { ref, onMounted} from 'vue';

const userRole = ref(false);
const vectorRole = ref(false);
const areaRole = ref(false);
const dashboardRole = ref(false);
const talhaoRole = ref(false);
const editTalhaoRole = ref(false);
const margin = ref(0);

const verifyRole = (role) =>{
  if (role == 'Administrador'){
    userRole.value = true;
    vectorRole.value = true;
    areaRole.value = true;
    dashboardRole.value = true;
  }
  if (role == 'Consultor'){
    areaRole.value = true;
    dashboardRole.value = true;
    margin.value = '40';
  }
  if (role == 'Analista'){
    talhaoRole.value = true;
    editTalhaoRole.value = true;
    margin.value = '40';
  }
}

onMounted(()=>{
  const role = localStorage.getItem('role');
  verifyRole(role)
})
</script>

<style>
.option{
  width: 250px;
  height: 200px;
}
.option:hover{
  img{
    transform: scale(1.1);
  }
}

</style>

<template>
  <div class="mx-[10%] my-[45%] lg:my-[5%]">
    <ul :class="`w-full h-full flex flex-wrap mt-${margin}`">

      <li v-show="talhaoRole" class="my-1 w-1/2 p-1 flex flex-col items-center text-center ">
        <RouterLink to="/analista/talhao" class="flex flex-col items-center text-center gap-5 font-sans hover:font-semibold hover:text-orange-400 option">
          <img src="../assets/imagens/mapping.png" alt="talhao.png" class="lg:w-30 w-20">
          <p class="lg:text-lg text-xs ">Talhões</p>
        </RouterLink>
      </li>

      <li v-show="editTalhaoRole" class="my-1 w-1/2 p-1 flex flex-col items-center text-center ">
        <RouterLink to="/analista/edicao-talhao" class="flex flex-col items-center text-center gap-5 font-sans hover:font-semibold hover:text-orange-400 option">
          <img src="../assets/imagens/field.png" alt="editTalhao.png" class="lg:w-30 w-20">
          <p class="lg:text-lg text-xs ">Edição de Talhões</p>
        </RouterLink>
      </li>

      <li v-show="userRole" class="my-1 w-1/2 p-1 flex flex-col items-center text-center ">
        <RouterLink to="/usuario" class="flex flex-col items-center text-center gap-5 font-sans hover:font-semibold hover:text-orange-400 option">
          <img src="../assets/imagens/user.png" alt="user.png" class="lg:w-30 w-20">
          <p class="lg:text-lg text-xs ">Gerenciamento de Usuários</p>
        </RouterLink>
      </li>

      <li v-show="vectorRole" class="my-1 w-1/2  p-1 flex flex-col items-center text-center">
        <RouterLink to="/vetor" class="flex flex-col items-center text-center gap-5 font-sans hover:font-semibold hover:text-orange-400 option">
          <img src="../assets/imagens/design.png" alt="edicao.png" class="lg:w-30 w-20">
          <p class="lg:text-lg text-xs ">Edição de vetores</p>
        </RouterLink>
      </li>

      <li v-show="areaRole" class="my-1 w-1/2 p-1 flex flex-col items-center text-center">
        <RouterLink to="/areasagro" class="flex flex-col items-center text-center gap-5 font-sans hover:font-semibold hover:text-orange-400 option">
        <img src="../assets/imagens/map.png" alt="areasAgricolas.png" class="lg:w-30 w-20">
        <p class="lg:text-lg text-xs">Áreas Agrícolas</p>
        </RouterLink>
      </li>

      <li v-show="dashboardRole" class="my-1 w-1/2 p-1 flex flex-col items-center text-center">
        <RouterLink to="/dashboard" class="flex flex-col items-center text-center gap-5 font-sans hover:font-semibold hover:text-orange-400 option">
        <img src="../assets/imagens/dashboard.png" alt="dashboard.png" class="lg:w-30 w-20">
        <p class="lg:text-lg text-xs ">Dashboard</p>
      </RouterLink>
      </li>

    </ul>
  </div>
</template>
