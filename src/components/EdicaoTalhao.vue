<template>
  <div class="p-">
    <div class="bg-white rounded-lg shadow-md p-6 w-[90%] mx-auto mt-23">
      <div class="flex items-center mb-6">
        <div class="flex flex-col">
          <div class="flex items-start gap-3">
            <i @click="voltar" class="pi pi-angle-left text-3xl text-gray-600"></i>
            <h1 class="text-2xl font-semibold text-gray-800">Edição do Talhão #{{ id }}</h1>
          </div>

          <div v-if="safraInfo" class="mt-2 ml-9 flex flex-wrap gap-2">
            <span class="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
              Safra #{{ safraInfo.safraId }}
            </span>
            <span class="inline-block bg-gray-100 text-gray-700 text-sm font-medium px-2 py-1 rounded">
              {{ safraInfo.cultura }} - {{ safraInfo.ano }}
            </span>
          </div>
        </div>

      </div>

      <div id="map" class="w-full h-[500px] mb-6 rounded-lg shadow"></div>

      <div class="flex justify-end gap-4">
        <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Salvar
        </button>
        <button class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
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

export default defineComponent({
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    let map = null
    let mapLocation = []
    const TOKEN = localStorage.getItem('token')
    const safraInfo = ref(null)

    const voltar = () => {
      router.push('/analista/edicao-talhoes')
    }

    onMounted(() => {
      try {
        fetchData()
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
        const response = await fetch(`/api/areas-agricolas/${props.id}/detalhes-completos`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + TOKEN
          }
        })

        if (!response.ok) throw new Error('Erro ao carregar dados')

        const data = await response.json()
        console.log('Dados recebidos:', data)

        const fazendaGeometry = JSON.parse(data.fazenda.arquivoFazenda)
        const talhao = data.talhao?.find(t => t.id === Number(props.id))

        if (talhao?.safras?.[0]) {
          safraInfo.value = {
            safraId: talhao.safras[0].id,
            cultura: talhao.safras[0].cultura || 'N/A',
            ano: talhao.safras[0].ano || 'N/A'
          }

          const daninhaGeometry = JSON.parse(talhao.safras[0].arquivoDaninha)
          const finalDaninhaGeometry = JSON.parse(talhao.safras[0].arquivoFinalDaninha)
          createMapLayer(fazendaGeometry, daninhaGeometry, finalDaninhaGeometry)
        } else {
          createMapLayer(fazendaGeometry)
        }
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
        style: { color: "#0000ff" }
      })

      let overlayMaps = {
        "Fazenda": L.layerGroup([fazendaLayer]).addTo(map)
      }

      if (daninhaGeometry) {
        const daninhaLayer = L.geoJSON(daninhaGeometry, {
          style: { color: "#ff0000" }
        })
        overlayMaps["Daninhas"] = L.layerGroup([daninhaLayer]).addTo(map)
      }

      if (finalDaninhaGeometry) {
        const finalDaninhaLayer = L.geoJSON(finalDaninhaGeometry, {
          style: { color: "#ffa500" }
        })
        overlayMaps["Daninhas Editado"] = L.layerGroup([finalDaninhaLayer]).addTo(map)
      }

      L.control.layers(null, overlayMaps).addTo(map)

      map.fitBounds(fazendaLayer.getBounds())
    }

    return { voltar, safraInfo }
  }
})
</script>

<style scoped>
#map {
  width: 100%;
  height: 500px;
  border-radius: 0.5rem;
}
</style>
