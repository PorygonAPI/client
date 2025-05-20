<script setup>
import Chart from "primevue/chart";
import { ref, watch, defineProps } from "vue";

const props = defineProps({
  valuesData: {
    type: Object,
    required: true
  }
});

const chartData = ref({});
const chartOptions = ref({});

const colorPalette = [
'#34d399',
'#3b82f6',
'#c4b5fd',
'#0ea5e9',
'#7c3aed',
'#15803d',
'#60a5fa',
'#8b5cf6',
'#22d3ee',
'#94a3b8',
'#a78bfa',
'#6ee7b7',
'#2563eb',
'#1e3a8a',
'#d1fae5',
'#cbd5e1'
];

const setChartData = () => {
  return {
    labels: props.valuesData.labels,
    datasets: [
      {
        type: 'pie',
        data: props.valuesData.data,
        backgroundColor: colorPalette
      }
    ]
  };
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');

  return {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: props.valuesData.title || 'Gráfico de Pizza',
        font: { size: 15 },
        color: textColor,
        padding: { top: 20 },
        position: 'bottom'
      },
      legend: {
        labels: {
          usePointStyle: true,
          color: textColor
        }
      }
    }
  };
};

watch(() => props.valuesData, () => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
}, { immediate: true });
</script>

<template>
  <Chart
    type="pie"
    :data="chartData"
    :options="chartOptions"
    class="w-full h-full"
  />
</template>
