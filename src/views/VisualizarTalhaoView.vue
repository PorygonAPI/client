<template>
  <Toast />
  <div class="bg-white shadow-md rounded-lg p-4 my-4 w-full max-w-7xl mx-auto z-0">
    <button @click="goBack" class="text-gray-600 hover:text-gray-800">←</button>
    <div class="flex flex-col">
      <div class="text-center p-2 mt-4 lg:mb-3 mb-1">
        <p class="text-4xl font-semibold text-gray-800">Visualizador de Talhão</p>
      </div>
      <hr class="border-gray-300 mb-4">
      <MapViewer :arquivoFazenda="arquivoFazenda" :arquivoDaninha="arquivoDaninha"
        :arquivoFinalDaninha="arquivoFinalDaninha" :key="arquivoFazenda" />
    </div>
  </div>
</template>

<script setup>
import MapViewer from '@/components/MapViewer.vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter();
const TOKEN = localStorage.getItem('token')
const ID =  (!localStorage.getItem('id_visualizacao')) ? 1 : localStorage.getItem('id_visualizacao')

const arquivoFazenda = ref()
const arquivoDaninha = ref()
const arquivoFinalDaninha = ref()
const areaAgricola = ref();

const goBack = () => {
  const role = localStorage.getItem('role');

  if (role === 'Analista') {
    router.push('/analista/talhoes');
  } else {
    router.push('/areasagro');
  }
};

const fetchData = async () => {
  try {
    const response = await fetch(`api/areas-agricolas/${ID}/detalhes-completos`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + TOKEN
      }
    });
    areaAgricola.value = await response.json();
    montaGeoJson()

  } catch (error) {
    error.value = 'Erro ao carregar os dados';
  }
};

onMounted(() => {
  fetchData();
});

const montaGeoJson = () => {

  arquivoFazenda.value = areaAgricola.value.fazenda.arquivoFazenda

  var DaninhaGeoJson = '['
  var FinalDaninhaGeoJson = '['

  let talhoes = areaAgricola.value.talhao

  for (let index = 0; index < talhoes.length; index++) {

    let safras = talhoes[index].safras
    let virgula = (index > 0) ? ' , ' : ''

    for (let j = 0; j < safras.length; j++) {

      DaninhaGeoJson += virgula + safras[j].arquivoDaninha
      FinalDaninhaGeoJson += virgula + safras[j].arquivoFinalDaninha
    }
  }

  DaninhaGeoJson += ']'
  FinalDaninhaGeoJson += ']'

  arquivoDaninha.value = DaninhaGeoJson
  arquivoFinalDaninha.value = FinalDaninhaGeoJson
}

</script>