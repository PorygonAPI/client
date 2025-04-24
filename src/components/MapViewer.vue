<!-- Referencias:
 https://leafletjs.com/examples/quick-start/
 https://leafletjs.com/examples/geojson/
 https://github.com/patrickmonteiro/quasar-pontos-turisticos/blob/main/src/components/LMap.vue
   -->

<template>
    <h2>Map Viewer Test</h2>
    <p>{{ talhoesGeoJson }}</p>
    <div id="map"></div>
</template>

<script>
import { defineComponent, onMounted, onBeforeMount } from 'vue'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

export default defineComponent({
    props: {
        talhoesGeoJson: {
            type: Array,
            required: false,
            default: () => []
        }
    },
    setup(props) {
        let map = null
        let talhoesParsed = null
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

            talhoesParsed = JSON.parse(props.talhoesGeoJson)

            //Define a variável de posição do mapa que usada na linha abaixo (50)
            setLocalizacaoMapa()

            //Mostrar o mapa na tela
            map = L.map('map').setView(mapLocation, 6)
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution:
                    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map)

            //Inserindo o geoJson no mapa
            setTalhoes()
        }

        const setTalhoes = () => {

            //***TESTE PONTO***
            // var someFeatures = {
            //     "type": "Feature",
            //     "properties": {
            //     },
            //     "geometry": {
            //         "type": "Point",
            //         "coordinates": [-0.09, 51.5]
            //     }
            // };

            //  ***TESTE GEOJSONPOLIGONO E ESTILIZACAO***
            // var someFeatures = [{
            //     "type": "Feature",
            //     "properties": { "party": "Republican" },
            //     "geometry": {
            //         "type": "Polygon",
            //         "coordinates": [[
            //             [-104.05, 48.99],
            //             [-97.22, 48.98],
            //             [-96.58, 45.94],
            //             [-104.03, 45.94],
            //             [-104.05, 48.99]
            //         ]]
            //     }
            // },
            // {
            //     "type": "Feature",
            //     "properties": { "party": "Democrat" },
            //     "geometry": {
            //         "type": "MultiPolygon",
            //         "coordinates": [[ [
            //             [-109.05, 41.00],
            //             [-102.06, 40.99],
            //             [-102.03, 36.99],
            //             [-109.04, 36.99],
            //             [-109.05, 41.00]
            //         ], [
            //         [-46.3446028104612,-23.64587273889485],
            //         [-46.3446028104612,-20.64587519603432],
            //         [-46.344605505407046,-20.64587519603432],
            //         [-49.344605505407046,-20.645880585926026],
            //         [-49.34461089529875,-20.645880585926026],
            //         [-49.34461089529875,-20.645873311398894],
            //         [-49.3446028104612,-20.64587273889485]
            //         ] ]]
            //     }
            // }
            // ];

            // L.geoJSON(someFeatures, {
            //     style: function (feature) {
            //         switch (feature.properties.party) {
            //             case 'Republican': return { color: "#ff0000" };
            //             case 'Democrat': return { color: "#0000ff" };
            //         }
            //     }
            // }).addTo(map);

            // console.log(JSON.stringify(someFeatures))

            //**PEGANDO DO COMPONENTE PAI */
            L.geoJSON(talhoesParsed, {
                style: function (feature) {
                    switch (feature.geometry.crs.properties.CLASSE) {
                        //DANINHAS -> Vermelho, Resto -> Azul
                        case 'DANINHAS': return { color: "#ff0000" };
                        default: return { color: "#0000ff" };
                    }
                }
            }).addTo(map);
        }

        const setLocalizacaoMapa = () => {

            if (talhoesParsed.length > 0) {

                if (talhoesParsed[0].coordinates.length > 0) {

                    if (talhoesParsed[0].coordinates[0].length > 0) {

                        //talhoesParsed[0].coordinates[0] retona um vetor com todas as coordenadas (ie [[20,21], [22,23]])
                        //Logo, talhoesParsed[0].coordinates[0][0] retorna a primeira coordenada (ie [20,21])
                        //Portanto talhoesParsed[0].coordinates[0][0][0] retorna o primeiro valor da coordenada (ie 20)
                        //Já talhoesParsed[0].coordinates[0][0][0] retorna o segundo (ie 21)

                        //Por algum motivo o setView recebe os parametros invertidos, se um geoJson possui uma coordenada [20,21] por exemplo,
                        //a localização na setView da linha 50 deve ser inserida como [21,20] para que o mapa fica centralizado no mesmo ponto que o geoJSON
                        //Se não inverter a posição, o mapa fica centralizado em uma área nada a ver bem distante do ponto
                        let first = talhoesParsed[0].coordinates[0][0][1]
                        let last = talhoesParsed[0].coordinates[0][0][0]
                        mapLocation.push(first)
                        mapLocation.push(last)
                    }

                }

            }

        }
    }
})

</script>

<style scoped>
#map {
    width: 80%;
    height: 60vh;
}
</style>