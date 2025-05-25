<template>
  <Toast />
  <div class="p-">

    <div v-if="mostrarModal"
      class="fixed inset-0 flex items-center justify-center bg-gray-200/[var(--bg-opacity)] [--bg-opacity:50%] z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-50 relative">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Confirmar operação de {{ operacao }}</h2>
        <p class="text-gray-700 mb-6">
          Ao salvar a versão atual, a última versão será excluída.<br>
          Tem certeza que deseja {{ operacao }}?
        </p>
        <div class="flex justify-end gap-4">
          <button @click="cancelar" class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">
            Cancelar
          </button>
          <button @click="atualizarAprovarSafra(operacao)"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Confirmar
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6 w-[90%] mx-auto mt-23">
      <div class="flex items-center mb-6">
        <div class="flex flex-col">
          <div class="flex items-start gap-3">
            <i @click="voltar" class="pi pi-angle-left text-3xl text-gray-600"></i>
            <h1 class="text-2xl font-semibold text-gray-800">Edição do Talhão #{{ talhaoId }}</h1>
          </div>
          <div v-if="safraInfo" class="mt-2 ml-9 flex flex-wrap gap-2">
            <span class="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
              Safra #{{ safraInfo.idSafra }}
            </span>
            <span class="inline-block bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded ml-2">
              Data Cadastro: {{ safraInfo.dataCadastro }}
            </span>
            <span class="inline-block bg-gray-100 text-gray-700 text-sm font-medium px-2 py-1 rounded">
              Data da Última Atualização: {{ safraInfo.dataUltimaVersao }}
            </span>
          </div>
        </div>

      </div>

      <div id="map" class="w-full h-[500px] mb-6 rounded-lg shadow z-0"></div>

      <div class="flex justify-end gap-4">
        <button @click="mostrarModal = true, operacao = 'salvar'"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Salvar
        </button>
        <button @click="mostrarModal = true, operacao = 'aprovar'"
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Aprovar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-draw'
import { useToast } from "primevue/usetoast";
import Toast from 'primevue/toast';

export default defineComponent({
  props: {
    talhaoId: {
      type: [String, Number],
      required: true
    },
    safraId: {
      type: [String, Number],
      required: true
    }
  },
  components: {
    Toast,
  },
  setup(props) {
    const router = useRouter()
    let map = null
    let mapLocation = []
    const TOKEN = localStorage.getItem('token')
    const ArquivoFazendaColor = "#0000ff"
    const DaninhaColor = "#ff0000"
    const DaninhaFinalColor = "#ffa500"
    var drawnFeatures = new L.FeatureGroup();
    const safraInfo = ref(null)
    const toast = useToast();
    const mostrarModal = ref(false)
    const operacao = ref(null)

    const voltar = () => {
      router.push('/analista/edicao-talhoes')
    }

    onMounted(() => {
      try {
        fetchData()
        //Remove as labels que ficam em cima dos botões de editar/ adicionar polígonos
        ajusteToolBar()
      } catch (error) {
        console.error('Erro ao montar mapa:', error)
      }
    })

    onBeforeMount(() => {
      if (map) {
        map.remove()
      }
    })

    const fetchData = async () => {
      try {

        const response = await fetch(`/api/safras/${props.safraId}/vetor`, {
          headers: {
            'Authorization': 'Bearer ' + TOKEN
          }
        })

        if (!response.ok) throw new Error('Erro ao carregar dados')

        let data = (await response.text()).split('--')

        safraInfo.value = JSON.parse(data[1].substring(data[1].indexOf('{"idSafra')))
        let arquivoFazenda = data[2].substring(data[2].indexOf('{"type":'))
        let arquivoDaninha = data[3].substring(data[3].indexOf('{"type":'))

        const fazendaGeometry = JSON.parse(arquivoFazenda)
        const daninhaGeometry = JSON.parse(arquivoDaninha)//.geometries[0]
        let finalDaninhaGeometry = null


        let arquivoFinalDaninha = null
        if (data.length > 6) {
          arquivoFinalDaninha = data[4].substring(data[4].indexOf('{"type":'))
          finalDaninhaGeometry = JSON.parse(arquivoFinalDaninha)//.geometries[0]
        }

        createMapLayer(fazendaGeometry, daninhaGeometry, finalDaninhaGeometry)
      } catch (error) {
        console.error('Erro:', error)
      }
    }

    const setLocalizacaoMapa = (geometria) => {
      if (geometria.coordinates?.length > 0 &&
        geometria.coordinates[0]?.length > 0 &&
        geometria.coordinates[0][0]?.length > 0) {
        let first = geometria.coordinates[0][0][0][1]
        let last = geometria.coordinates[0][0][0][0]
        mapLocation = [first, last]
      }
    }

    const createMapLayer = (fazendaGeometry, daninhaGeometry, finalDaninhaGeometry) => {
      setLocalizacaoMapa(fazendaGeometry)

      map = L.map('map').setView(mapLocation, 10)

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution:
          'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      }).addTo(map)

      const fazendaLayer = L.geoJSON(fazendaGeometry, {
        style: { color: ArquivoFazendaColor }
      })

      let overlayMaps = {
        "Fazenda": L.layerGroup([fazendaLayer]).addTo(map)
      }

      if (daninhaGeometry) {
        const daninhaLayer = L.geoJSON(daninhaGeometry, {
          style: { color: DaninhaColor }
        })

        overlayMaps["Imagem Original"] = L.layerGroup([daninhaLayer]).addTo(map)
      }

      map.addLayer(drawnFeatures);


      let finalDaninhaInput = (finalDaninhaGeometry ? finalDaninhaGeometry : daninhaGeometry)

      let finalDaninhaLayer = L.geoJSON(finalDaninhaInput, {
        style: { color: DaninhaFinalColor }
      })

      // Função que configura os polígonos para serem editados
      transformGeoJsonIntoEditableLayer(finalDaninhaLayer, drawnFeatures)

      overlayMaps["Imagem Editada"] = L.layerGroup([drawnFeatures]).addTo(map)

      var drawControl = new L.Control.Draw({
        draw: {
          polygon: {
            shapeOptions: {
              color: DaninhaFinalColor
            }
          },
          polyline: false,
          circle: false,
          rectangle: false,
          circlemarker: false,
          marker: false
        },
        edit: {
          featureGroup: drawnFeatures
        }
      });
      map.addControl(drawControl);

      //Método para salvar features novos criados a partir da aplicação (ie clicando e arrasta)
      map.on("draw:created", function (e) {
        var layer = e.layer;

        //'Salva' a feature no mapa depois que o usuário terminar de desenhar
        drawnFeatures.addLayer(layer);
      });

      L.control.layers(null, overlayMaps).addTo(map)

      map.fitBounds(fazendaLayer.getBounds())
    }

    const transformGeoJsonIntoEditableLayer = (geoJson, featureToBeAdded) => {
      let polyLayers = [];

      geoJson.eachLayer(function (layer) {

        const layerType = layer.toGeoJSON().geometry.type.toLowerCase()

        if (layerType == "multipolygon") {
          
          layer.toGeoJSON().geometry.coordinates.forEach(function (coordinateArray) {

            revertCoordinates(coordinateArray)
            let newPolygon = L.polygon(coordinateArray, { color: DaninhaFinalColor })
            polyLayers.push(newPolygon)
          })
        }
        else if (layerType == "geometrycollection") {
         
          layer.toGeoJSON().geometry.geometries.forEach(function (geometry) {

            geometry.coordinates.forEach(function (coordinateArray) {
              
              let idk = []
              idk.push(coordinateArray)
              revertCoordinates(idk)
              let newPolygon = L.polygon(coordinateArray, { color: DaninhaFinalColor })
              polyLayers.push(newPolygon)
            })
          })
        }
        else {
          polyLayers.push(layer)
        }

      });

      // Add the layers to the feature group 
      for (let layer of polyLayers) {
        featureToBeAdded.addLayer(layer);
      }
    }

    const revertCoordinates = (multipolygonArray) => {
      multipolygonArray.forEach(function (coordinateArray) {
        coordinateArray.forEach(function (coordinate) {
          coordinate.reverse()
        })
      })
    }

    const generateUpdatedGeoJson = () => {

      let out = '{"type": "FeatureCollection", "features": [[]]}'
      let feature = ''

      drawnFeatures.eachLayer(function (layer) {
        console.log("layer.toGeoJSON(): ", layer.toGeoJSON())
        feature += JSON.stringify(layer.toGeoJSON())
        feature += ','
      });

      out = out.replace('[]', feature)

      let ajuste = out.slice(-3)
      out = out.replace(ajuste, ']}')
      return out
    }

    const atualizarAprovarSafra = async (endpoint) => {
      try {
        mostrarModal.value = false

        let finalgeoJson = generateUpdatedGeoJson()
        let filename = 'finalgeoJson.geojson';

        console.log('finalgeoJson', finalgeoJson)

        let formData = new FormData();
        formData.append('geoJsonFile', new File([new Blob([finalgeoJson])], filename));

        const response = await fetch(`/api/safras/${props.safraId}/${endpoint}`, {
          headers: {
            'Authorization': 'Bearer ' + TOKEN
          },
          method: 'PUT',
          body: formData
        })

        let msg = await response.text()

        if (response.status == 200) {
          showToast('success', msg);
        } else {
          showToast('error', msg);
        }
      } catch (error) {
        console.error('Erro:', error)
        showToast('error', error);
      }
    }

    const showToast = (strSeverity, strMensagem) => {
      toast.add({ severity: strSeverity, summary: 'Informando:', detail: strMensagem, life: 5000 });
    }

    const cancelar = () => {
      mostrarModal.value = false
    }

    const ajusteToolBar = () => {
      const spans = document.getElementsByClassName("sr-only")
      for (const element of spans) {
        element.innerHTML = ""
      }
    }

    return { voltar, atualizarAprovarSafra, cancelar, safraInfo, mostrarModal, operacao }
  }
})
</script>

<style scoped>
#map {
  width: 100%;
  height: 500px;
  border-radius: 0.5rem;
}

.z-50 {
  z-index: 1000;
}
</style>
