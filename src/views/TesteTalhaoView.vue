<template>
    <Toast />
    <div class="h-full w-[90%] ml-[5%] mr-[5%]">
        <div class="flex flex-col">
            <div class="text-center p-2 mt-4 lg:mb-3 mb-1">
                <p class="text-4xl font-semibold text-gray-800">Teste Visualizador de Talhão</p>
            </div>
            <hr class="border-gray-300 mb-4">
            <MapViewer />
        </div>
    </div>
</template>
<!-- 
<script setup lang="ts"> -->

<script setup>
import MapViewer from '@/components/MapViewer.vue';
</script>