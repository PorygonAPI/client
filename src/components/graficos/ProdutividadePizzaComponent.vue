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
  '#34d399', // Verde-menta moderno
  '#3b82f6', // Azul claro moderno
  '#c4b5fd', // Lilás pastel elegante
  '#0ea5e9', // Azul ciano leve
  '#7c3aed', // Roxo violeta sofisticado
  '#15803d', // Verde escuro elegante
  '#60a5fa', // Azul pastel sofisticado
  '#8b5cf6', // Roxo lavanda forte
  '#22d3ee', // Azul piscina suave
  '#94a3b8', // Cinza claro com fundo azul
  '#a78bfa', // Lavanda claro elegante
  '#6ee7b7', // Verde água claro sofisticado
  '#2563eb', // Azul vibrante elegante
  '#1e3a8a', // Azul royal escuro
  '#d1fae5', // Verde pastel elegante
  '#cbd5e1'  // Neutro elegante (off-white azulado)
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
