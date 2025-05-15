<template>
  <div class="p-4">

    <div v-if="mostrarModal" class="fixed inset-0 flex items-center justify-center bg-gray-200/[var(--bg-opacity)] [--bg-opacity:50%] z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-50 relative">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Confirmar salvamento</h2>
        <p class="text-gray-700 mb-6">
          Ao salvar a versão atual, a última versão será excluída.<br>
          Tem certeza que deseja substituir?
        </p>
        <div class="flex justify-end gap-4">
          <button @click="cancelar" class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">
            Cancelar
          </button>
          <button @click="salvar" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Confirmar
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6 w-[90%] mx-auto">
      <div class="flex items-center mb-6">
        <button @click="voltar" class="mr-4 text-gray-600 hover:text-gray-800">
          <i class="pi pi-arrow-left"></i>
        </button>
        <div>
          <h1 class="text-2xl font-semibold text-gray-800">Edição do Talhão #{{ id }}</h1>
          <div v-if="safraInfo" class="mt-1 flex">
            <span class="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
              Safra #{{ safraInfo.safraId }}
            </span>
            <span class="inline-block bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded ml-2">
              {{ safraInfo.cultura }} - {{ safraInfo.ano }}
            </span>
          </div>
        </div>
      </div>

      <div id="map" class="w-full h-[500px] mb-6 rounded-lg shadow z-0"></div>

      <div class="flex justify-end gap-4">
        <button @click="mostrarModal = true" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
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
import { defineComponent, onMounted, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

export default defineComponent({
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    const TOKEN = localStorage.getItem('token')
    const safraInfo = ref(null)
    const mostrarModal = ref(false)

    let map = null
    let mapLocation = []

    const voltar = () => {
      router.push('/analista/edicao-talhoes')
    }

    const cancelar = () => {
      mostrarModal.value = false
    }

    const salvar = () => {
      console.log('Salvando dados...')
      // Aqui entra sua lógica de salvamento real (API, etc.)
      mostrarModal.value = false
      alert('Dados salvos com sucesso!')
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
      if (
        geometria.coordinates?.length > 0 &&
        geometria.coordinates[0]?.length > 0 &&
        geometria.coordinates[0][0]?.length > 0
      ) {
        let first = geometria.coordinates[0][0][0][1]
        let last = geometria.coordinates[0][0][0][0]
        mapLocation = [first, last]
      }
    }

    const createMapLayer = (fazendaGeometry, daninhaGeometry, finalDaninhaGeometry) => {
      setLocalizacaoMapa(fazendaGeometry)

      map = L.map('map').setView(mapLocation, 10)

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
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

    return {
      voltar,
      safraInfo,
      mostrarModal,
      cancelar,
      salvar
    }
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
