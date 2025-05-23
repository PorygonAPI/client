<template>
  <div class="h-full mx-[.1rem] mt-23">
    <div class="controls-section bg-white p-4 rounded-lg shadow-md mb-6">
      <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div class="date-display text-gray-700">
          <h1 class="text-2xl md:text-3xl font-semibold text-[#475764] mb-4">{{ title }}</h1>
          <i class="pi pi-calendar mr-2"></i>
          <span>{{ currentDate }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  }
})

const searchQuery = ref('')
const currentDate = ref(new Date().toLocaleDateString('pt-BR'))
</script>
