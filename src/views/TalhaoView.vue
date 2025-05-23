<script setup>
import AnalistaTalhaoComponent from '@/components/AnalistaTalhaoComponent.vue';
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import Titulo from '@/components/Titulo.vue';

const talhoesPendentes = ref([]);
const loading = ref(true);
const error = ref(null);
const toast = useToast();

const fetchTalhoesPendentes = async () => {
  loading.value = true;
  try {
    const response = await fetch('/api/safras/pendentes', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });

    if (!response.ok) {
      throw new Error(`Erro ao carregar talhões: ${response.status}`);
    }

    const data = await response.json();
    console.log('Talhões pendentes data:', data);

    talhoesPendentes.value = data.map(talhao => ({
      id: talhao.id || '',
      nomeFazenda: talhao.nomeFazenda || '',
      cultura: talhao.cultura || '',
      produtividade: talhao.produtividadeAno ? `${talhao.produtividadeAno} sc/ha` : 'N/A',
      area: talhao.area ? `${talhao.area} ha` : '',
      tipoSolo: talhao.tipoSolo || '',
      cidade: talhao.cidade || '',
      estado: talhao.estado || '',
      status: 'PENDENTE'
    }));

  } catch (err) {
    error.value = err.message;
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Falha ao carregar talhões pendentes',
      life: 5000
    });
    console.error('Erro ao buscar talhões pendentes:', err);
  } finally {
    loading.value = false;
  }
};

const handleTalhaoAtribuido = async (data) => {
  console.log('Talhão atribuído, removendo da lista:', data);

  talhoesPendentes.value = talhoesPendentes.value.filter(talhao =>
    talhao.id !== data.talhaoId
  );

  toast.add({
    severity: 'success',
    summary: 'Sucesso',
    detail: 'Talhão atribuído com sucesso!',
    life: 3000
  });

  setTimeout(() => {
    fetchTalhoesPendentes();
  }, 2000);
};

const handleError = (errorMessage) => {
  toast.add({
    severity: 'error',
    summary: 'Erro',
    detail: errorMessage,
    life: 5000
  });
};

onMounted(() => {
  fetchTalhoesPendentes();
});
</script>

<template>
  <Toast />
<div class="h-full w-[90%] mx-auto">
    <div class="flex flex-col">

      <Titulo title="Talhões"></Titulo>
      <div>
        <div v-if="loading" class="flex justify-center items-center p-8">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>

        <div v-else-if="error" class="p-4 bg-red-50 text-red-600 rounded-lg text-center">
          {{ error }}
          <button @click="fetchTalhoesPendentes"
            class="ml-4 px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-500">
            Tentar novamente
          </button>
        </div>

        <AnalistaTalhaoComponent v-else :talhao="talhoesPendentes" @talhao-atribuido="handleTalhaoAtribuido"
          @error="handleError" />
      </div>

    </div>
  </div>
</template>
