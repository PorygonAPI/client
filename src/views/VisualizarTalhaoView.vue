<template>
  <Toast />
  <div class="bg-white shadow-md rounded-lg p-4 my-4 w-full max-w-7xl mx-auto z-0">
    <a href="/areasagro" class="">←</a>
    <div class="flex flex-col">
      <div class="text-center p-2 mt-4 lg:mb-3 mb-1">
        <p class="text-4xl font-semibold text-gray-800">Visualizador de Talhão</p>
      </div>
      <hr class="border-gray-300 mb-4">
      <MapViewer :talhoesGeoJson="finalGeoJson" :key="finalGeoJson"/>
    </div>
  </div>
</template>

<script setup>
import MapViewer from '@/components/MapViewer.vue';
import { onMounted, ref } from 'vue';

const TOKEN = localStorage.getItem('token')

//***CONSTANTES de TESTES MOCKADOS */
// var talhoesGeoJson = '[{"type":"Polygon","coordinates":[[[-46.62529,-23.533773],[-46.62529,-23.534773],[-46.62429,-23.534773],[-46.62429,-23.533773],[-46.62529,-23.533773]]],"crs":{"type":"name","properties":{"name":"EPSG:4326"}}},'

// const daninhasGeoJson = '{"type":"Polygon","coordinates":[[[-46.3446028104612,-23.64587273889485],[-46.3446028104612,-20.64587519603432],[-46.344605505407046,-20.64587519603432],[-49.344605505407046,-20.645880585926026],[-49.34461089529875,-20.645880585926026],[-49.34461089529875,-20.645873311398894],[-49.3446028104612,-20.64587273889485]]],"crs":{"type":"name","properties":{"name":"EPSG:4326", "CLASSE": "DANINHAS"}}}]'

// const fullGeoJson = talhoesGeoJson + daninhasGeoJson;

const finalGeoJson = ref()
const areaAgricola = ref();

const fetchData = async () => {
  try {
    const response = await fetch('api/areas-agricolas/1/detalhes-completos', {
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

  var fazendaGeoJson = areaAgricola.value.fazenda.arquivoFazenda

  finalGeoJson.value = '[' + fazendaGeoJson

  let talhoes = areaAgricola.value.talhao

  for (let index = 0; index < talhoes.length; index++) {
    // console.log(index + ':')
    // console.log(talhoes[index].area)
    // console.log(talhoes[index].id)
    // console.log(talhoes[index].safras.length)

    let safras = talhoes[index].safras

    for (let j = 0; j < safras.length; j++) {
      finalGeoJson.value += ' , ' + safras[j].arquivoDaninha + ' , ' + safras[j].arquivoFinalDaninha
    }
  }

  finalGeoJson.value += ']'
}

</script>