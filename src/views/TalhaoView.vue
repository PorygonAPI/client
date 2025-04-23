<script setup>
import TalhaoListComponent from '@/components/TalhaoListComponent.vue';
import { ref } from 'vue';

const talhoes = ref([
  {
    nome: 'Fazenda Boa Esperança',
    cultura: 'Soja',
    produtividade: '60 sc/ha',
    area: '150 ha',
    solo: 'Ideal',
    cidade: 'Londrina',
    estado: 'PR',
    status: 'Aprovada'
  },
  {
    nome: 'Sítio Santa Clara',
    cultura: 'Milho',
    produtividade: '80 sc/ha',
    area: '90 ha',
    solo: 'Arenoso',
    cidade: 'Maringá',
    estado: 'PR',
    status: 'Em análise'
  }
]);

</script>

<template>
  <div class="h-full w-[90%] ml-[5%] mr-[5%]">
    <div class="flex flex-col">

      <div class="text-center p-2 mt-4 lg:mb-3 mb-1">
        <p class="text-4xl font-semibold text-gray-800">Talhões</p>
      </div>

      <hr class="border-gray-300 mb-4"/>
      <div>
        <TalhaoListComponent :talhao="talhoes"/>
      </div>
      
    </div>
  </div>
</template>


