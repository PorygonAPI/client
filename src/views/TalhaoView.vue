<script setup>
import TalhaoListComponent from '@/components/TalhaoListComponent.vue';
</script>

<template>
  <div class="h-full w-[90%] ml-[5%] mr-[5%]">
    <div class="flex flex-col">

      <div class="text-center p-2 mt-4 lg:mb-3 mb-1">
        <p class="text-4xl font-semibold text-gray-800">Talhões</p>
      </div>

      <hr class="border-gray-300 mb-4"/>
      <div>
        <TalhaoListComponent/>
      </div>
      
    </div>
  </div>
</template>


