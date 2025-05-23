<template>
  <div class="p-">
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

      <div id="map" class="w-full h-[500px] mb-6 rounded-lg shadow"></div>

      <div class="flex justify-end gap-4">
        <button @click="salvar" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Salvar
        </button>
        <button @click="aprovar" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
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
        let arquivoFinalDaninha = data[4].substring(data[4].indexOf('{"type":'))

        const fazendaGeometry = JSON.parse(arquivoFazenda)
        const daninhaGeometry = JSON.parse(arquivoDaninha).geometries[0]
        const finalDaninhaGeometry = JSON.parse(arquivoFinalDaninha).geometries[0]

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

        if (layer.toGeoJSON().geometry.type.toLowerCase() == "multipolygon") {
          layer.toGeoJSON().geometry.coordinates.forEach(function (coordinateArray) {

            revertCoordinates(coordinateArray)
            let newPolygon = L.polygon(coordinateArray, { color: DaninhaFinalColor })
            polyLayers.push(newPolygon)
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

    const atualizarSafra = async (endpoint) => {
      try {
        let geoJsonTemplate = '{ "type": "FeatureCollection", "features": [{"type": "Feature", "properties": {}, "geometry": {"coordinates": [ [] ],"type": "Polygon" }    } ]}'

        let finalgeoJson = geoJsonTemplate.replace('[]', JSON.stringify(generateUpdatedGeoJson().geometry.coordinates))
        let filename = 'finalgeoJson.geojson';

        // console.log('finalgeoJson',finalgeoJson)

        let formData = new FormData();
        formData.append('geoJsonFile', new File([new Blob([finalgeoJson])], filename));

        const response = await fetch(endpoint, {
          headers: {
            'Authorization': 'Bearer ' + TOKEN
          },
          method: 'PUT',
          body: formData
        })

        if (!response.ok) throw new Error('Erro ao atualizar dados')

        console.log('resposta: ',await response.text() )
      } catch (error) {
        console.error('Erro:', error)
      }
    }

    const salvar = () => {
      atualizarSafra(`/api/safras/${props.safraId}/salvar`)
    }

    const aprovar = () => {
      atualizarSafra(`/api/safras/${props.safraId}/aprovar`)
    }

    return { voltar, salvar, aprovar, safraInfo }
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
