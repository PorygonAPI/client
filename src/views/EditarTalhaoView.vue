<template>
  <EdicaoTalhao :id="id" />
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import EdicaoTalhao from '@/components/EdicaoTalhao.vue';

const route = useRoute();
const id = ref(route.params.id);
</script>
