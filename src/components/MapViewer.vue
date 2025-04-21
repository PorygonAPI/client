<!-- Referencias:
 https://leafletjs.com/examples/quick-start/
 https://leafletjs.com/examples/geojson/
 https://github.com/patrickmonteiro/quasar-pontos-turisticos/blob/main/src/components/LMap.vue
   -->

<template>
    <h2>Map Viewer Test</h2>
    <div id="map"></div>
</template>

<script>
import { defineComponent, onMounted, onBeforeMount } from 'vue'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

export default defineComponent({
    props: {
        geoJson: {
            type: Array,
            required: false,
            default: () => []
        }
    },
    setup(props) {
        let map = null

        onMounted(() => {
            console.log(props.geoJson)
            createMapLayer()
        })

        onBeforeMount(() => {
            if (map) {
                map.remove()
            }
        })

        
        const createMapLayer = () => {
            //Mostrar o mapa na tela
            map = L.map('map').setView([48.99, -104.05], 4)
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution:
                    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map)

            //Inserindo o geoJson no mapa
            setMarkers()
        }

        const setMarkers = () => {

            // var someFeatures = {
            //     "type": "Feature",
            //     "properties": {
            //     },
            //     "geometry": {
            //         "type": "Point",
            //         "coordinates": [-0.09, 51.5]
            //     }
            // };

            var someFeatures = [{
                "type": "Feature",
                "properties": { "party": "Republican" },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [-104.05, 48.99],
                        [-97.22, 48.98],
                        [-96.58, 45.94],
                        [-104.03, 45.94],
                        [-104.05, 48.99]
                    ]]
                }
            },
            {
                "type": "Feature",
                "properties": { "party": "Democrat" },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [-109.05, 41.00],
                        [-102.06, 40.99],
                        [-102.03, 36.99],
                        [-109.04, 36.99],
                        [-109.05, 41.00]
                    ]]
                }
            }
            ];

            L.geoJSON(someFeatures, {
                style: function (feature) {
                    switch (feature.properties.party) {
                        case 'Republican': return { color: "#ff0000" };
                        case 'Democrat': return { color: "#0000ff" };
                    }
                }
            }).addTo(map);
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