<template>
    <Toast />
    <div class="h-full w-[90%] ml-[5%] mr-[5%]">
        <div class="flex flex-col">
            <div class="text-center p-2 mt-4 lg:mb-3 mb-1">
                <p class="text-4xl font-semibold text-gray-800">Teste Visualizador de Talhão</p>
            </div>
            <hr class="border-gray-300 mb-4">
            <MapViewer :talhoes-geo-json="fullGeoJson"/>
        </div>
    </div>
</template>

<script setup>
import MapViewer from '@/components/MapViewer.vue';

const talhoesGeoJson = '[{"type":"Polygon","coordinates":[[[-46.62529,-23.533773],[-46.62529,-23.534773],[-46.62429,-23.534773],[-46.62429,-23.533773],[-46.62529,-23.533773]]],"crs":{"type":"name","properties":{"name":"EPSG:4326"}}},'

const daninhasGeoJson = '{"type":"Polygon","coordinates":[[[-46.3446028104612,-23.64587273889485],[-46.3446028104612,-20.64587519603432],[-46.344605505407046,-20.64587519603432],[-49.344605505407046,-20.645880585926026],[-49.34461089529875,-20.645880585926026],[-49.34461089529875,-20.645873311398894],[-49.3446028104612,-20.64587273889485]]],"crs":{"type":"name","properties":{"name":"EPSG:4326", "CLASSE": "DANINHAS"}}}]'

const fullGeoJson = talhoesGeoJson + daninhasGeoJson;


</script>