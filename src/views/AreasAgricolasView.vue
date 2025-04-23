<script setup>
import TalhaoListComponent from '@/components/TalhaoListComponent.vue';
import FazendaListComponent from '@/components/FazendaListComponent.vue';
import { ref } from 'vue';

const activeTab = ref('fazendas');
const fazendasMock = ref([
  {
    nome: 'Fazenda Santa Maria',
    cidade: 'Uberlândia',
    estado: 'MG',
    status: 'Aprovada',
  },
  {
    nome: 'Fazenda Boa Vista',
    cidade: 'Londrina',
    estado: 'PR',
    status: 'Pendente',
  },
  {
    nome: 'Fazenda Esperança',
    cidade: 'Ribeirão Preto',
    estado: 'SP',
    status: 'Em análise',
  }
]);
</script>

<template>
  <div class="h-full w-[90%] ml-[5%] mr-[5%]">
    <div class="flex flex-col">

      <div class="text-center p-2 mt-4 lg:mb-3 mb-1">
        <p class="text-4xl font-semibold text-gray-800">Áreas Agrícolas</p>
      </div>

      <hr class="border-gray-300 mb-4">

      <div class="bg-white shadow rounded-xl p-5">

        <div class="flex gap-3 mb-2">
          <span
          :class="[
              'p-1 px-2 rounded-lg shadow border-gray-300 transition flex items-center justify-center',
              activeTab === 'fazendas' 
                ? 'bg-gray-300 text-gray-700 hover:bg-gray-300 transition' 
                : 'bg-gray-400 text-white hover:bg-gray-300 hover:text-gray-600 transition'
            ]">
            <button
            class="cursor-pointer"
            @click="activeTab='fazendas'"
            >
            Fazendas
            </button>
          </span>
          <span
          :class="[
              'p-1 px-2 rounded-lg shadow border-gray-300 transition flex items-center justify-center',
              activeTab === 'talhoes' 
                ? 'bg-gray-300 text-gray-700 hover:bg-gray-300 transition' 
                : 'bg-gray-400 text-white hover:bg-gray-300 hover:text-gray-600 transition'
            ]">
            <button
            class="cursor-pointer"
            @click="activeTab='talhoes'"
            >Talhões</button>
          </span>
        </div>

        <hr class="border-gray-200 mb-4">
      
        <div>
          <FazendaListComponent v-if="activeTab === 'fazendas'" :fazendas="fazendasMock"/>
          <TalhaoListComponent v-if="activeTab === 'talhoes'" />
        </div>

      </div>

    </div>
  </div>
</template>
