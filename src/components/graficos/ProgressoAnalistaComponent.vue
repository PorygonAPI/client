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

const chartHeight = computed(() => {
  const numAnalysts = (props.valuesData.labels || []).length;
  return Math.max(300, 300 + (numAnalysts > 3 ? (numAnalysts - 3) * 40 : 0));
});

const valueLabels = computed(() => props.valuesData.labels || []);
const valuesPendentes = computed(() => props.valuesData.pendentes || []);
const valuesAtribuidos = computed(() => props.valuesData.atribuidos || []);
const valuesAprovados = computed(() => props.valuesData.aprovados || []);

const analystDataMap = computed(() => {
  const map = new Map();

  valueLabels.value.forEach((name, index) => {
    map.set(name, {
      pendentes: valuesPendentes.value[index] || 0,
      atribuidos: valuesAtribuidos.value[index] || 0,
      aprovados: valuesAprovados.value[index] || 0,
      total: (valuesPendentes.value[index] || 0) +
             (valuesAtribuidos.value[index] || 0) +
             (valuesAprovados.value[index] || 0)
    });
  });

  return map;
});

const setChartData = () => {
  return {
    labels: valueLabels.value,
    datasets: [
      {
        type: 'bar',
        label: 'Pendentes',
        backgroundColor: '#F97316',
        data: valuesPendentes.value,
        borderRadius: 4,
        stack: 'Stack 0',
        hoverBackgroundColor: '#f05e03',
      },
      {
        type: 'bar',
        label: 'Atribuídos',
        backgroundColor: '#3B82F6',
        data: valuesAtribuidos.value,
        borderRadius: 4,
        stack: 'Stack 0',
        hoverBackgroundColor: '#2563eb',
      },
      {
        type: 'bar',
        label: 'Aprovados',
        backgroundColor: '#10B981',
        data: valuesAprovados.value,
        borderRadius: 4,
        stack: 'Stack 0',
        hoverBackgroundColor: '#059669',
      }
    ]
  };
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');

  const numLabels = valueLabels.value.length;
  const fontSize = numLabels > 8 ? 10 : (numLabels > 5 ? 11 : 12);

  return {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    barPercentage: 0.9,
    categoryPercentage: 1.0,
    layout: {
      padding: {
        left: 10,
        right: 20
      }
    },
    plugins: {
      title: {
        display: true,
        text: "Progresso por Analista",
        font: {
          size: 25,
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
        enabled: true,
        mode: 'nearest',
        intersect: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        padding: 12,
        caretSize: 6,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const labelName = context.dataset.label || '';
            const value = context.parsed.x;
            return `${labelName}: ${value} ${getUnidadeText(value)}`;
          },
          title: function(context) {
            return context[0].label;
          },
          footer: function(tooltipItems) {
            const analista = tooltipItems[0].label;
            const data = analystDataMap.value.get(analista);

            if (!data) return '';

            return [
              ``,
              `Total de talhões: ${data.total} ${getUnidadeText(data.total)}`,
              `Pendentes: ${data.pendentes} ${getUnidadeText(data.pendentes)} (${Math.round(data.pendentes/data.total*100 || 0)}%)`,
              `Atribuídos: ${data.atribuidos} ${getUnidadeText(data.atribuidos)} (${Math.round(data.atribuidos/data.total*100 || 0)}%)`,
              `Aprovados: ${data.aprovados} ${getUnidadeText(data.aprovados)} (${Math.round(data.aprovados/data.total*100 || 0)}%)`
            ];
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
        },
        border: {
          display: true
        }
      },
      y: {
        stacked: true,
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: fontSize,
            weight: 'bold'
          },
          autoSkip: false,
          maxRotation: 0,
          callback: function(value, index) {
            return valueLabels.value[index];
          }
        },
        border: {
          display: true
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'y'
    },
    hover: {
      animationDuration: 150
    },
    onHover: (event, chartElements) => {
      const chart = chartElements[0]?.chart;
      if (chart) {
        chart.canvas.style.cursor = chartElements.length ? 'pointer' : 'default';
      }
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
    chartOptions.value = setChartOptions();
  }
}, { deep: true });

const getUnidadeText = (count) => count === 1 ? 'unidade' : 'unidades';
</script>

<template>
  <div class="chart-container" :style="{ height: chartHeight + 'px' }">
    <Chart type="bar" :data="chartData" :options="chartOptions" />

    <!-- Custom tooltips for y-axis names -->
    <div class="y-axis-tooltips">
      <div v-for="(name, index) in valueLabels" :key="index"
           class="analyst-tooltip"
           :style="{ top: `${(index + 0.5) * (100 / valueLabels.length)}%` }">
        <div class="tooltip-content" v-if="analystDataMap.get(name)">
          <strong>{{ name }}</strong>
          <div class="tooltip-details">
            <div>Total: {{ analystDataMap.get(name).total }} {{ getUnidadeText(analystDataMap.get(name).total) }}</div>
            <div class="pendentes">Pendentes: {{ analystDataMap.get(name).pendentes }}</div>
            <div class="atribuidos">Atribuídos: {{ analystDataMap.get(name).atribuidos }}</div>
            <div class="aprovados">Aprovados: {{ analystDataMap.get(name).aprovados }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  min-height: 300px;
  position: relative;
}

.y-axis-tooltips {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  pointer-events: none;
}

.analyst-tooltip {
  position: absolute;
  left: 0;
  width: 20%;
  transform: translateY(-50%);
  pointer-events: auto;
}

.tooltip-content {
  display: none;
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  z-index: 10;
  width: 180px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
}

.analyst-tooltip:hover .tooltip-content {
  display: block;
}

.tooltip-details {
  margin-top: 5px;
}

.tooltip-details .pendentes {
  color: #F97316;
}

.tooltip-details .atribuidos {
  color: #3B82F6;
}

.tooltip-details .aprovados {
  color: #10B981;
}
</style>
