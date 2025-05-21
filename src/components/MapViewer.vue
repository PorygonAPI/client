<template>
  <div id="map" class="h-full w-[90%] ml-[5%] mr-[5%]"></div>
</template>

<script>
import { defineComponent, onMounted, onBeforeMount } from 'vue'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

export default defineComponent({
  props: {
    arquivoFazenda: {
      type: Array,
      required: false,
      default: () => []
    },
    arquivoDaninha: {
      type: Array,
      required: false,
      default: () => []
    },
    arquivoFinalDaninha: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  setup(props) {
    let map = null
    let arquivoFazendaParsed = null
    let arquivoDaninhaParsed = null
    let arquivoFinalDaninhaParsed = null
    let mapLocation = []

    onMounted(() => {
      try {
        createMapLayer()
      } catch (error) {
        console.log(error)
      }
    })

    onBeforeMount(() => {
      if (map) {
        map.remove()
      }
    })

    const createMapLayer = () => {

      arquivoFazendaParsed = JSON.parse(props.arquivoFazenda)
      arquivoDaninhaParsed = JSON.parse(props.arquivoDaninha)
      arquivoFinalDaninhaParsed = JSON.parse(props.arquivoFinalDaninha)

      //Define a variável de posição do mapa que usada na linha abaixo (50)
      setLocalizacaoMapa()

      //Mostrar o mapa na tela
      map = L.map('map').setView(mapLocation, 10)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution:
          'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      }).addTo(map)

      //Inserindo o geoJson no mapa
      setTalhoes()
    }

    const setTalhoes = () => {

      //**PEGANDO DO COMPONENTE PAI */
      var arquivoFazendaLayer = L.geoJSON(arquivoFazendaParsed, {
        //Azul
        style: { color: "#0000ff" }
      }
      )

      var arquivoDaninhaLayer = L.geoJSON(arquivoDaninhaParsed, {
        //Vermelho
        style: { color: "#ff0000" }
      }
      )

      var arquivoFinalDaninhaLayer = L.geoJSON(arquivoFinalDaninhaParsed, {
        //Laranja
        style: { color: "#ffa500 " }
      }
      )

      var arquivoFazendaGroup = L.layerGroup([arquivoFazendaLayer]).addTo(map);
      var arquivoDaninhaGroup = L.layerGroup([arquivoDaninhaLayer]).addTo(map);
      var arquivoFinalDaninhaGroup = L.layerGroup([arquivoFinalDaninhaLayer]).addTo(map);

      var overlayMaps = {
        "Fazenda": arquivoFazendaGroup,
        "Daninhas": arquivoDaninhaGroup,
        "Daninhas Editado": arquivoFinalDaninhaGroup
      };

      var layerControl = L.control.layers(null, overlayMaps).addTo(map);
    }

    const setLocalizacaoMapa = () => {

      if (arquivoFazendaParsed.coordinates.length > 0) {

        if (arquivoFazendaParsed.coordinates[0].length > 0) {

          //arquivoFazendaParsed.coordinates[0] retona um vetor com todas as coordenadas (ie [[20,21], [22,23]])
          //Logo, arquivoFazendaParsed.coordinates[0][0] retorna a primeira coordenada (ie [20,21])
          //Portanto arquivoFazendaParsed.coordinates[0][0][0] retorna o primeiro valor da coordenada (ie 20)
          //Já arquivoFazendaParsed.coordinates[0][0][0] retorna o segundo (ie 21)

          //Por algum motivo o setView recebe os parametros invertidos, se um geoJson possui uma coordenada [20,21] por exemplo,
          //a localização na setView da linha 50 deve ser inserida como [21,20] para que o mapa fica centralizado no mesmo ponto que o geoJSON
          //Se não inverter a posição, o mapa fica centralizado em uma área nada a ver bem distante do ponto
          let first = arquivoFazendaParsed.coordinates[0][0][0][1]
          let last = arquivoFazendaParsed.coordinates[0][0][0][0]

          mapLocation.push(first)
          mapLocation.push(last)
        }

      }
    }
  }
})

</script>

<style scoped>
#map {
  width: 80%;
  height: 65vh;
  margin: auto;
}
</style>
