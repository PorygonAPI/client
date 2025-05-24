<script setup>
import Titulo from '@/components/Titulo.vue'
import DatePicker from 'primevue/datepicker'
import { FloatLabel } from 'primevue'
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import StatusGeralComponent from '@/components/graficos/StatusGeralComponent.vue'
import ProgressoAnalistaComponent from '@/components/graficos/ProgressoAnalistaComponent.vue'
import ProdutividadePizzaComponent from '@/components/graficos/ProdutividadePizzaComponent.vue'
import TempoMedioComponent from '@/components/graficos/TempoMedioComponent.vue'


const dates = ref()
const loading = ref(false)

const valuesStatusGeral = ref([0, 0, 0])
const valuesProgressoAnalista = ref({
  labels: [],
  pendentes: [],
  atribuidos: [],
  aprovados: [],
})

const loadingStatusGeral = ref(false)
const loadingProgressoAnalista = ref(false)
const errorStatusGeral = ref(null)
const errorProgressoAnalista = ref(null)

const formatDate = (date) => {
  if (!date) return null
  return date.toISOString().split('T')[0]
}

const fetchStatusData = async () => {
  try {
    loadingStatusGeral.value = true
    errorStatusGeral.value = null

    let params = {}
    if (dates.value && dates.value[0]) {
      params.dataInicial = formatDate(dates.value[0])
    }
    if (dates.value && dates.value[1]) {
      params.dataFinal = formatDate(dates.value[1])
    }

    console.log('Chamando API /relatorios/status com params:', params)

    const response = await axios.get('/api/relatorios/status', {
      params,
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })

    console.log('Resposta da API /relatorios/status:', response.data)

    valuesStatusGeral.value = [
      response.data.totalPendentes || 0,
      response.data.totalAtribuidos || 0,
      response.data.totalAprovados || 0
    ]
  } catch (error) {
    console.error('Erro ao buscar dados de status:', error)
    errorStatusGeral.value = `Erro: ${error.message || 'Falha ao buscar dados'}`
    if (error.response) {
      console.error('Resposta de erro:', error.response.data)
    }
  } finally {
    loadingStatusGeral.value = false
  }
}

const fetchAnalistasData = async () => {
  try {
    loadingProgressoAnalista.value = true;
    errorProgressoAnalista.value = null;

    let params = {};
    if (dates.value && dates.value[0]) {
      params.dataInicial = formatDate(dates.value[0]);
    }
    if (dates.value && dates.value[1]) {
      params.dataFinal = formatDate(dates.value[1]);
    }

    const response = await axios.get('/api/relatorios/analistas', {
      params,
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });

    const sortedData = response.data.sort((a, b) => {
      const totalA = (a.quantidadePendentes || 0) + (a.quantidadeAtribuidos || 0) + (a.quantidadeAprovados || 0);
      const totalB = (b.quantidadePendentes || 0) + (b.quantidadeAtribuidos || 0) + (b.quantidadeAprovados || 0);
      return totalB - totalA;
    });

    const labels = sortedData.map(analista => analista.nomeAnalista);
    const pendentes = sortedData.map(analista => analista.quantidadePendentes || 0);
    const atribuidos = sortedData.map(analista => analista.quantidadeAtribuidos || 0);
    const aprovados = sortedData.map(analista => analista.quantidadeAprovados || 0);

    valuesProgressoAnalista.value = {
      labels,
      pendentes,
      atribuidos,
      aprovados
    };
  } catch (error) {
    errorProgressoAnalista.value = `Erro: ${error.message || 'Falha ao buscar dados'}`;
  } finally {
    loadingProgressoAnalista.value = false;
  }
}

onMounted(() => {
  fetchStatusData()
  fetchAnalistasData()
})

watch(dates, () => {
  fetchStatusData()
  fetchAnalistasData()
})

const valuesCultura = ref({
  title: 'por Cultura',
  labels: ['Milho', 'Soja', 'Cana-de-açúcar', 'Algodão', 'Feijão'],
  data: [540, 325, 702, 198, 450],
})

const valuesEstado = ref({
  title: 'por Estado',
  labels: ['São Paulo', 'Minas Gerais', 'Paraná', 'Bahia', 'Goiás'],
  data: [320, 410, 275, 190, 360],
})

const valuesSolo = ref({
  title: 'por Tipo de Solo',
  labels: ['Arenoso', 'Argiloso', 'Massapê', 'Latossolo', 'Glei'],
  data: [200, 500, 300, 420, 180],
})

const culturaMaisProdutiva = computed(() => {
  const maxIndex = valuesCultura.value.data.indexOf(Math.max(...valuesCultura.value.data))
  return {
    nome: valuesCultura.value.labels[maxIndex],
    valor: valuesCultura.value.data[maxIndex],
  }
})

// Estrutura para ranking dos estados
const rankingEstados = computed(() => {
  return valuesEstado.value.labels.map((label, i) => ({
    estado: label,
    valor: valuesEstado.value.data[i],
  }))
})
</script>

<template>
  <div class="h-full w-[90%] ml-[5%] mr-[5%] mb-10">
    <div class="flex flex-col">
      <Titulo title="Dashboard"></Titulo>

      <div class="p-5 py-3 bg-white rounded-xl shadow min-h-fit">
        <div class="pt-2">
          <FloatLabel variant="on">
            <DatePicker class="w-64 h-9" showButtonBar showIcon="true" v-model="dates" selectionMode="range"
              :manualInput="false" />
            <label for="on_label">Selecione o período</label>
          </FloatLabel>
        </div>

        <hr class="border-gray-300 my-5" />

        <div v-if="loading" class="flex justify-center items-center py-4">
          <span class="text-gray-600">Carregando dados...</span>
        </div>

        <div class="w-full flex flex-wrap justify-between gap-10">
          <!-- Status Geral Component -->
          <div class="lg:w-[48%] lg:h-40 flex flex-col">
            <StatusGeralComponent :valuesList="valuesStatusGeral" />
          </div>

          <!-- Progresso Analista Component -->
          <div class="lg:w-[48%] h-36 lg:h-40 flex flex-col">
            <ProgressoAnalistaComponent :valuesData="valuesProgressoAnalista" />
          </div>

          <!-- Produtividade Media -->
          <label class="flex w-full justify-center lg:text-3xl text-2xl font-semibold text-gray-700">Produtividade
            Média</label>
          <div class="flex overflow-x-scroll lg:overflow-hidden h-50 lg:w-full lg:h-64">
            <ProdutividadePizzaComponent :valuesData="valuesCultura" />
            <ProdutividadePizzaComponent :valuesData="valuesEstado" />
            <ProdutividadePizzaComponent :valuesData="valuesSolo" />
          </div>

          <div class="w-full flex flex-wrap gap-5 p-2">
            <div class="bg-gray-100 p-4 rounded-lg shadow w-full sm:w-[48%] flex flex-col justify-center items-center ml-3">
              <p class="lg:text-3xl text-lg font-semibold text-gray-700 mb-2">
                Cultura Mais Produtiva
              </p>
              <p class="lg:text-2xl text-xl font-bold" style="color: #3b82f6">
                {{ culturaMaisProdutiva.nome }}
              </p>
              <p class="text-lg text-gray-600">
                {{ culturaMaisProdutiva.valor.toLocaleString('pt-BR') }}
              </p>
            </div>

            <div class="bg-gray-100 p-4 rounded-lg shadow w-full sm:w-[48%]">
              <p class="text-xl font-semibold text-gray-700 mb-2">Ranking de Estados</p>
              <ul>
                <li v-for="(estado, index) in rankingEstados" :key="index" class="flex justify-between border-b py-1">
                  <span>{{ estado.estado }}</span>
                  <span>{{ estado.valor.toLocaleString('pt-BR') }}</span>
                </li>
              </ul>
            </div>
          </div>

          <TempoMedioComponent :datasSelecionadas="dates" />
        </div>
      </div>
    </div>
  </div>
</template>
