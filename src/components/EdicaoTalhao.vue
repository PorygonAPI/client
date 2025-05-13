<template>
  <div class="p-4">
    <div class="bg-white rounded-lg shadow-md p-6 w-[90%] mx-auto">
      <div class="flex items-center mb-6">
        <button @click="voltar" class="mr-4 text-gray-600 hover:text-gray-800">
          <i class="pi pi-arrow-left"></i>
        </button>
        <h1 class="text-2xl font-semibold text-gray-800">Edição do Talhão #{{ id }}</h1>
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
import { defineComponent, onMounted, onBeforeMount } from 'vue'
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
    var drawnFeatures = new L.FeatureGroup();

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
        style: { color: "#0000ff" }
      })

      let overlayMaps = {
        "Fazenda": L.layerGroup([fazendaLayer]).addTo(map)
      }

      if (daninhaGeometry) {
        const daninhaLayer = L.geoJSON(daninhaGeometry, {
          style: { color: "#ff0000" }
        }).bindPopup(`<p>${JSON.stringify(daninhaGeometry)}</p>`)
        overlayMaps["Imagem Original"] = L.layerGroup([daninhaLayer]).addTo(map)
      }

      map.addLayer(drawnFeatures);

      // if (finalDaninhaGeometry) {
      const finalDaninhaLayer = L.geoJSON(finalDaninhaGeometry, {
        style: { color: "#ffa500" }
      })
      overlayMaps["Imagem Editada"] = L.layerGroup([finalDaninhaLayer, drawnFeatures]).addTo(map)
      // }

      //Método para salvar features novos criados a partir da aplicação (ie clicando e arrasta)
      map.on("draw:created", function (e) {
        var layer = e.layer;

        //Ao clicar na feature, mostrar o geoJSON do mesmo
        layer.bindPopup(`<p>${JSON.stringify(layer.toGeoJSON().geometry)}</p>`)

        //'Salva' a feature no mapa depois que o usuário terminar de desenhar
        drawnFeatures.addLayer(layer);
      });

      var drawControl = new L.Control.Draw({
        draw: {
          polyline: {
            shapeOptions: {
              color: '#ffa500'
            }
          },
          polygon: {
            shapeOptions: {
              color: '#ffa500'
            }
          },
          rectangle: false,
          circle: {
            shapeOptions: {
              color: '#ffa500'
            }
          }
        },
        edit: {
          featureGroup: drawnFeatures
        }
      });
      map.addControl(drawControl);

      // map.on("draw:edited", function (e) {
      //   var layers = e.layers;
      //   var type = e.layerType;

      //   layers.eachLayer(function (layer) {
      //     console.log(layer)
      //   })

      // })

      L.control.layers(null, overlayMaps).addTo(map)

      map.fitBounds(fazendaLayer.getBounds())
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
      console.log( generateUpdatedGeoJson() )
    }

    return { voltar, salvar }
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
