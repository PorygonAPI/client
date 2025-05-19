<template>
  <Toast />
  <div class="bg-white shadow-md rounded-lg p-4 my-4 w-full max-w-7xl mx-auto z-0 mt-25">


    <div class="flex flex-col">

      <div class="flex items-start gap-3">
        <i @click="goBack" class="pi pi-angle-left text-3xl text-gray-600 cursor-pointer hover:text-gray-800 transition"
          aria-label="Voltar" role="button" tabindex="0" @keyup.enter="voltar" />
        <h1 class="text-2xl font-semibold text-gray-800">Visualizador de Talhão</h1>
      </div>

      <br>
    <br>
      <div v-if="loading" class="flex justify-center items-center p-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <span class="ml-3 text-gray-700">Carregando dados do talhão...</span>
      </div>

      <div v-else-if="error" class="p-4 bg-red-50 text-red-600 rounded-lg text-center">
        {{ error }}
        <button @click="fetchData" class="ml-4 px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-500">
          Tentar novamente
        </button>
      </div>

      <MapViewer v-else :arquivoFazenda="arquivoFazenda" :arquivoDaninha="arquivoDaninha"
        :arquivoFinalDaninha="arquivoFinalDaninha" :key="mapKey" />
        <br>
    <br>
    </div>
  </div>

</template>

<script setup>
import MapViewer from '@/components/MapViewer.vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import 'primeicons/primeicons.css';

const router = useRouter();
const toast = useToast();
const TOKEN = localStorage.getItem('token');
const ID = ref(localStorage.getItem('id_visualizacao') || null);

const arquivoFazenda = ref()
const arquivoDaninha = ref()
const arquivoFinalDaninha = ref()
const areaAgricola = ref();
const loading = ref(true)
const error = ref()
const mapKey = ref(0);

const goBack = () => {
  const role = localStorage.getItem('role');

  if (role === 'Analista') {
    router.push('/analista/talhoes');
  } else {
    router.push('/areasagro');
  }
};


const fetchData = async () => {
  if (!ID.value) {
    error.value = 'ID do talhão não encontrado';
    loading.value = false;
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'ID do talhão não encontrado',
      life: 5000
    });
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const response = await fetch(`/api/areas-agricolas/${ID.value}/detalhes-completos`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + TOKEN
      }
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar dados: ${response.status}`);
    }

    areaAgricola.value = await response.json();
    montaGeoJson()

    mapKey.value++;

    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Dados do talhão carregados com sucesso',
      life: 3000
    });
  } catch (error) {
    console.error('Erro na requisição:', error);
    error.value = `Erro ao carregar os dados: ${error.message}`;
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: `Falha ao carregar dados: ${error.message}`,
      life: 5000
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
});

const montaGeoJson = () => {
  if (!areaAgricola.value || !areaAgricola.value.fazenda) {
    console.error('Dados da área agrícola incompletos');
    return;
  }

  arquivoFazenda.value = areaAgricola.value.fazenda.arquivoFazenda

  var DaninhaGeoJson = '['
  var FinalDaninhaGeoJson = '['

  let talhoes = areaAgricola.value.talhao

  for (let index = 0; index < talhoes.length; index++) {

    let safras = talhoes[index].safras
    let virgula = (index > 0) ? ' , ' : ''

    for (let j = 0; j < safras.length; j++) {
      if (safras[j].arquivoDaninha) {
        DaninhaGeoJson += virgula + safras[j].arquivoDaninha;
      }

      if (safras[j].arquivoFinalDaninha) {
        FinalDaninhaGeoJson += virgula + safras[j].arquivoFinalDaninha;
      }
    }
  }

  DaninhaGeoJson += ']'
  FinalDaninhaGeoJson += ']'

  arquivoDaninha.value = DaninhaGeoJson
  arquivoFinalDaninha.value = FinalDaninhaGeoJson
}
</script>
