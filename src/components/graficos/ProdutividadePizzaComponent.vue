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
  '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e',
  '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50',
  '#f1c40f', '#e67e22', '#e74c3c', '#ecf0f1', '#95a5a6',
  '#f39c12', '#d35400', '#c0392b', '#bdc3c7', '#7f8c8d',
  '#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#66bb6a',
  '#ef5350', '#ab47bc', '#ffa726', '#26c6da', '#d4e157'
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
