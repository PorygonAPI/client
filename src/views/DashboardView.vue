<script setup>
import Titulo from '@/components/Titulo.vue'
import DatePicker from 'primevue/datepicker'
import { FloatLabel } from 'primevue'
import { ref, onMounted, watch } from 'vue'
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

    const response = await axios.get('/api/relatorios/status', {
      params,
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })

    valuesStatusGeral.value = [
      response.data.totalPendentes || 0,
      response.data.totalAtribuidos || 0,
      response.data.totalAprovados || 0
    ]
  } catch (error) {
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

const valuesCultura = ref({
  title: 'por Cultura',
  labels: [],
  data: [],
})

const valuesEstado = ref({
  title: 'por Estado',
  labels: [],
  data: [],
})

const valuesSolo = ref({
  title: 'por Tipo de Solo',
  labels: [],
  data: [],
})

const culturaMaisProdutiva = ref({
  nome: '',
  valor: 0,
})

const ordenarRankingEstados = (ranking) => {
  return ranking.slice().sort((a, b) => b.valor - a.valor)
}

const rankingEstados = ref([])

const loadingProdutividade = ref(false)
const errorProdutividade = ref(null)

const fetchProdutividadeData = async () => {
  try {
    loadingProdutividade.value = true
    errorProdutividade.value = null

    const params = {}
    if (dates.value && dates.value[0]) {
      params.dataInicial = formatDate(dates.value[0])
    }
    if (dates.value && dates.value[1]) {
      params.dataFinal = formatDate(dates.value[1])
    }

    const response = await axios.get('/api/relatorios/produtividade', {
      params,
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })

    const data = response.data

    valuesCultura.value = {
      title: 'por Cultura',
      labels: data.produtividadePorCultura.map(item => item.nomeCultura),
      data: data.produtividadePorCultura.map(item => item.produtividadeMedia),
    }

    valuesEstado.value = {
      title: 'por Estado',
      labels: data.produtividadePorEstado.map(item => item.nomeEstado),
      data: data.produtividadePorEstado.map(item => item.produtividadeMedia),
    }

    valuesSolo.value = {
      title: 'por Tipo de Solo',
      labels: data.produtividadePorTipoSolo.map(item => item.nomeTipoSolo),
      data: data.produtividadePorTipoSolo.map(item => item.produtividadeMedia),
    }

    culturaMaisProdutiva.value = {
      nome: data.culturaMaisProdutiva.nomeCultura,
      valor: data.culturaMaisProdutiva.produtividadeMedia,
    }

rankingEstados.value = ordenarRankingEstados(
  data.rankingTop5Estados.map(item => ({
    estado: item.nomeEstado,
    valor: item.produtividadeMedia,
  }))
)
  } catch (error) {
    errorProdutividade.value = `Erro: ${error.message || 'Falha ao buscar dados'}`
    if (error.response) {
      console.error('Resposta de erro:', error.response.data)
    }
  } finally {
    loadingProdutividade.value = false
  }
}

onMounted(() => {
  fetchStatusData()
  fetchAnalistasData()
  fetchProdutividadeData()
})

watch(dates, () => {
  fetchStatusData()
  fetchAnalistasData()
  fetchProdutividadeData()
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

        <div class="w-full flex flex-wrap justify-between gap-10 mt-10">
          <div class="lg:w-[48%] lg:h-40 flex flex-col">
            <StatusGeralComponent :valuesList="valuesStatusGeral" />
          </div>

          <div class="lg:w-[48%] h-36 lg:h-40 flex flex-col">
            <ProgressoAnalistaComponent :valuesData="valuesProgressoAnalista" />
          </div>

          <label class="flex w-full justify-center lg:text-3xl text-2xl font-semibold text-gray-700">
            Produtividade Média
          </label>
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
                {{ culturaMaisProdutiva.valor.toLocaleString('pt-BR') }} sc/ha
              </p>
            </div>

            <div class="bg-gray-100 p-4 rounded-lg shadow w-full sm:w-[48%]">
              <p class="text-xl font-semibold text-gray-700 mb-2">Ranking de Estados</p>
              <ul>
                <li v-for="(estado, index) in rankingEstados" :key="index" class="flex justify-between border-b py-1">
                  <span>{{ estado.estado }}</span>
                  <span>{{ estado.valor.toLocaleString('pt-BR') }} sc/ha</span>
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
