<template>
  <div class="editar-talhao-container p-4">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex items-center mb-6">
        <button @click="voltar" class="mr-4 text-gray-600 hover:text-gray-800">
          <i class="pi pi-arrow-left"></i>
        </button>
        <h1 class="text-2xl font-semibold">Editar Talhão #{{ id }}</h1>
      </div>

      <div class="bg-gray-100 p-4 rounded-md mb-4">
        <p class="text-gray-600">Pag de exemplo para a edição do talhão com ID: {{ id }}</p>
        <p class="text-gray-600">Dados</p>
      </div>

      <div class="flex justify-end mt-6">
        <button @click="voltar" class="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded mr-2">
          Cancelar
        </button>
        <button class="bg-orange-400 hover:bg-orange-500 text-white py-2 px-4 rounded">
          Salvar Alterações
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const id = ref(route.params.id);

const voltar = () => {
  router.push('/talhao/edicao');
};
</script>
