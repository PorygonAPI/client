<script setup>
import Chart from 'primevue/chart';
import { ref, onMounted, defineProps, computed, watch } from "vue";

const props = defineProps({
  valuesData: {
    type: Object,
    required: true
  }
});

const chartData = ref();
const chartOptions = ref();

const valueLabels = computed(() => props.valuesData.labels || []);
const valuesPendentes = computed(() => props.valuesData.pendentes || []);
const valuesAtribuidos = computed(() => props.valuesData.atribuidos || []);
const valuesAprovados = computed(() => props.valuesData.aprovados || []);

const setChartData = () => {
  return {
    labels: valueLabels.value,
    datasets: [
      {
        type: 'bar',
        label: 'Pendentes',
        backgroundColor: '#F97316',
        data: valuesPendentes.value,
        borderRadius: 4
      },
      {
        type: 'bar',
        label: 'Atribuídos',
        backgroundColor: '#3B82F6',
        data: valuesAtribuidos.value,
        borderRadius: 4
      },
      {
        type: 'bar',
        label: 'Aprovados',
        backgroundColor: '#10B981',
        data: valuesAprovados.value,
        borderRadius: 4
      }
    ]
  };
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');

  return {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    barPercentage: 0.7,
    categoryPercentage: 0.9,
    plugins: {
      title: {
        display: true,
        text: "Progresso por Analistas",
        font: {
          size: 18,
          weight: 'bold'
        },
        color: textColor,
        padding: {
          bottom: 15
        }
      },
      legend: {
        labels: {
          color: textColor,
          usePointStyle: true,
          font: {
            size: 12
          }
        },
        position: 'bottom'
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return context.dataset.label + ': ' + context.raw;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: true
        },
        ticks: {
          stepSize: 1
        }
      },
      y: {
        stacked: true,
        grid: {
          display: false
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    }
  };
};

onMounted(() => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
});

watch(() => props.valuesData, (newData) => {
  if (newData) {
    chartData.value = setChartData();
  }
}, { deep: true });
</script>

<template>
  <div class="chart-container">
    <Chart type="bar" :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.chart-container {
  height: 100%;
  width: 100%;
}
</style>
