<script setup>
import { ref, onMounted, watch, defineProps } from 'vue';
import Chart from 'primevue/chart';

const props = defineProps({
  datasSelecionadas: {
    type: Array,
    required: false,
    default: () => []
  }
});

const chartDataAnalista = ref({});
const chartDataSafras = ref({});
const chartOptions = ref({});

const fetchData = async () => {
  const TOKEN = localStorage.getItem('token');

  try {
    const response = await fetch('/api/relatorios/safras-aprovadas', {
      headers: {
        'Authorization': 'Bearer ' + TOKEN,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    const inicio = props.datasSelecionadas?.[0] ? new Date(props.datasSelecionadas[0]) : null;
    const fim = props.datasSelecionadas?.[1] ? new Date(props.datasSelecionadas[1]) : null;

    const safrasFiltradas = data.safrasAprovadas.filter(item => {
      const dataAprovacao = new Date(item.dataAprovacao);
      if (inicio && fim) {
        return dataAprovacao >= inicio && dataAprovacao <= fim;
      }
      return true;
    });

    const labelsSafras = safrasFiltradas.map(item => `Safra ${item.idSafra} - ${item.nomeAnalista}`);
    const temposSafras = safrasFiltradas.map(item => {
      const minutosTotal = item.tempoTotal.dias * 1440 + item.tempoTotal.horas * 60 + item.tempoTotal.minutos;
      return (minutosTotal / 60).toFixed(2);
    });

    chartDataSafras.value = {
      labels: labelsSafras,
      datasets: [
        {
          label: 'Tempo de Aprovação (horas)',
          backgroundColor: '#FFA726',
          data: temposSafras
        }
      ]
    };

    const nomesAnalistasNoPeriodo = new Set(safrasFiltradas.map(item => item.nomeAnalista));

    const mediaFiltrada = data.mediaPorAnalista.filter(item => {
      if (inicio && fim) {
        return nomesAnalistasNoPeriodo.has(item.nomeAnalista);
      }
      return true;
    });

    const labelsAnalistas = mediaFiltrada.map(item => item.nomeAnalista);
    const temposAnalistas = mediaFiltrada.map(item => {
      const minutosTotal = item.mediaDuracao.dias * 1440 + item.mediaDuracao.horas * 60 + item.mediaDuracao.minutos;
      return (minutosTotal / 60).toFixed(2);
    });

    chartDataAnalista.value = {
      labels: labelsAnalistas,
      datasets: [
        {
          label: 'Média de Aprovação (horas)',
          backgroundColor: '#42A5F5',
          data: temposAnalistas
        }
      ]
    };

    chartOptions.value = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 5 }
        }
      }
    };

  } catch (error) {
    console.error('Erro ao buscar dados:', error);
  }
};

onMounted(fetchData);
watch(() => props.datasSelecionadas, fetchData, { deep: true });
</script>

<template>
  <div class="flex flex-wrap gap-6 w-full">

    <div class="p-4 w-full lg:w-[48%]">
      <p class="text-2xl font-semibold text-gray-700 mb-2 text-center">Tempo Médio de Aprovação - Analistas</p>
      <Chart type="bar" :data="chartDataAnalista" :options="chartOptions" class="h-64"/>
    </div>

    <div class="p-4 w-full lg:w-[48%]">
      <p class="text-2xl font-semibold text-gray-700 mb-2 text-center">Tempo Médio de Aprovação - Safras</p>
      <Chart type="bar" :data="chartDataSafras" :options="chartOptions" class="h-64"/>
    </div>

  </div>
</template>
