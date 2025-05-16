<template>
  <div class="p-4">
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

      <div id="map" class="w-full h-[500px] mb-6 rounded-lg shadow"></div>

      <div class="flex justify-end gap-4">
        <button @click="salvar" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
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
import 'leaflet-draw'

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
    const ArquivoFazendaColor = "#0000ff"
    const DaninhaColor = "#ff0000"
    const DaninhaFinalColor = "#ffa500"
    var drawnFeatures = new L.FeatureGroup();
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

        // const talhao = data.talhao?.find(t => t.id > 0)
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

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
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

      //Função que configura os polígonos para serem editados
      transformGeoJsonIntoEditableLayer(finalDaninhaLayer, drawnFeatures)

      overlayMaps["Imagem Editada"] = L.layerGroup([drawnFeatures]).addTo(map)

      var drawControl = new L.Control.Draw({
        draw: {
          polyline: {
            shapeOptions: {
              color: DaninhaFinalColor
            }
          },
          polygon: {
            shapeOptions: {
              color: DaninhaFinalColor
            }
          },
          circle: {
            shapeOptions: {
              color: DaninhaFinalColor
            }
          },
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

        layer.toGeoJSON().geometry.coordinates.forEach(function (coordinateArray) {

          revertCoordinates(coordinateArray)
          let newPolygon = L.polygon(coordinateArray, {color: DaninhaFinalColor})
          polyLayers.push(newPolygon)
        })
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
      let newCoordinates = null
      let outputGeoJson = null
      drawnFeatures.eachLayer(function (layer) {

        if (outputGeoJson == null) {
          outputGeoJson = layer.toGeoJSON()
        }

        if (newCoordinates == null) {
          newCoordinates = layer.toGeoJSON().geometry.coordinates[0]
        }
        else {
          var newLayer = layer.toGeoJSON().geometry.coordinates[0]
          newLayer.forEach(coordinate => {
            newCoordinates.push(coordinate)
          });
        }
      });

      outputGeoJson.geometry.coordinates = newCoordinates

      return outputGeoJson
    }

    const salvar = () => {
      console.log(generateUpdatedGeoJson())
    }

    return { voltar, salvar, safraInfo }
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
