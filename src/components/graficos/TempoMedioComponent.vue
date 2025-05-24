<script setup>
import { ref, onMounted, watch, defineProps } from 'vue';

const props = defineProps({
  datasSelecionadas: {
    type: Array,
    required: false,
    default: () => []
  }
});

const tabelaDados = ref([]);

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

    const nomesAnalistasNoPeriodo = new Set(safrasFiltradas.map(item => item.nomeAnalista));

    const mediaFiltrada = data.mediaPorAnalista.filter(item => {
      if (inicio && fim) {
        return nomesAnalistasNoPeriodo.has(item.nomeAnalista);
      }
      return true;
    });

    const dados = mediaFiltrada.map(analista => {
      const safrasDoAnalista = safrasFiltradas
        .filter(safra => safra.nomeAnalista === analista.nomeAnalista)
        .map(safra => {
          const minutosTotal = safra.tempoTotal.dias * 1440 + safra.tempoTotal.horas * 60 + safra.tempoTotal.minutos;
          return {
            idSafra: safra.idSafra,
            tempoHoras: (minutosTotal / 60).toFixed(2)
          };
        });

      const mediaMinutos = analista.mediaDuracao.dias * 1440 + analista.mediaDuracao.horas * 60 + analista.mediaDuracao.minutos;
      const mediaHoras = (mediaMinutos / 60).toFixed(2);

      return {
        nomeAnalista: analista.nomeAnalista,
        mediaHoras,
        safras: safrasDoAnalista
      };
    });

    tabelaDados.value = dados;

  } catch (error) {
    console.error('Erro ao buscar dados:', error);
  }
};

onMounted(fetchData);
watch(() => props.datasSelecionadas, fetchData, { deep: true });
</script>

<template>
  <div class="w-full p-4 bg-white rounded-lg shadow">
    <p class="text-2xl font-semibold text-gray-700 mb-4 text-center">
      Relatório - Tempo Médio p/ Analista e Safra
    </p>

    <div class="hidden md:block overflow-x-auto">
      <table class="min-w-full table-auto border border-gray-300">
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-300 px-4 py-2 text-left">Nome</th>
            <th class="border border-gray-300 px-4 py-2 text-center">Tempo Médio (Horas)</th>
            <th class="border border-gray-300 px-4 py-2 text-left">Safras</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="analista in tabelaDados" :key="analista.nomeAnalista">
            <td class="border border-gray-300 px-4 py-2 font-medium">{{ analista.nomeAnalista }}</td>
            <td class="border border-gray-300 px-4 py-2 text-center">{{ analista.mediaHoras }}</td>
            <td class="border border-gray-300 px-4 py-2">
              <ul class="list-disc ml-5">
                <li v-for="safra in analista.safras" :key="safra.idSafra">
                  Safra {{ safra.idSafra }} — <strong>{{ safra.tempoHoras }}</strong> horas
                </li>
              </ul>
            </td>
          </tr>
          <tr v-if="tabelaDados.length === 0">
            <td class="border border-gray-300 px-4 py-2 text-center" colspan="3">
              Nenhum dado encontrado para o período selecionado.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex flex-col gap-4 md:hidden">
      <div
        v-for="analista in tabelaDados"
        :key="analista.nomeAnalista"
        class="border border-gray-300 rounded-lg p-4"
      >
        <p class="text-lg font-semibold text-gray-800">{{ analista.nomeAnalista }}</p>
        <p class="text-sm text-gray-600 mb-2">
          Tempo médio: <strong>{{ analista.mediaHoras }}</strong> horas
        </p>
        <div>
          <p class="font-medium text-gray-700 mb-1">Safras:</p>
          <ul class="list-disc ml-5">
            <li v-for="safra in analista.safras" :key="safra.idSafra">
              Safra {{ safra.idSafra }} — <strong>{{ safra.tempoHoras }}</strong> horas
            </li>
          </ul>
        </div>
      </div>

      <div v-if="tabelaDados.length === 0" class="text-center text-gray-500">
        Nenhum dado encontrado para o período selecionado.
      </div>
    </div>
  </div>
</template>
