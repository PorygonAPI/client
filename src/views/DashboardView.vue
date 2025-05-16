<script setup>
import DatePicker from 'primevue/datepicker';
import { FloatLabel } from 'primevue';
import { ref, computed } from "vue";
import StatusGeralComponent from '@/components/graficos/StatusGeralComponent.vue';
import ProgressoAnalistaComponent from '@/components/graficos/ProgressoAnalistaComponent.vue';
import ProdutividadePizzaComponent from '@/components/graficos/ProdutividadePizzaComponent.vue';

const dates = ref();

//Ordem - pendente, atribuido, aprovado
const valuesStatusGeral = ref([430,300,220]);

const valuesProgressoAnalista = ref({
  labels: ['Ana', 'Carlos', 'Rafaela'],
  pendentes: [20, 15, 30],
  atribuidos: [5, 10, 3],
  aprovados: [12, 18, 14]
});

const valuesCultura = ref({
  title: 'por Cultura',
  labels: ['Milho', 'Soja', 'Cana-de-açúcar', 'Algodão', 'Feijão'],
  data: [540, 325, 702, 198, 450]
});

// Dados para gráfico por Estado
const valuesEstado = ref({
  title: 'por Estado',
  labels: ['São Paulo', 'Minas Gerais', 'Paraná', 'Bahia', 'Goiás'],
  data: [320, 410, 275, 190, 360]
});

// Dados para gráfico por Solo
const valuesSolo = ref({
  title: 'por Tipo de Solo',
  labels: ['Arenoso', 'Argiloso', 'Massapê', 'Latossolo', 'Glei'],
  data: [200, 500, 300, 420, 180]
});

const culturaMaisProdutiva = computed(() => {
  const maxIndex = valuesCultura.value.data.indexOf(Math.max(...valuesCultura.value.data));
  return {
    nome: valuesCultura.value.labels[maxIndex],
    valor: valuesCultura.value.data[maxIndex]
  };
});

// Estrutura para ranking dos estados
const rankingEstados = computed(() => {
  return valuesEstado.value.labels.map((label, i) => ({
    estado: label,
    valor: valuesEstado.value.data[i]
  }));
});
</script>

<template>

  <div class="h-full w-[90%] ml-[5%] mr-[5%] mb-10">
    <div class="flex flex-col">

      <div class="text-center p-2 mt-4 lg:mb-3 mb-1">
        <p class="text-4xl font-semibold text-gray-800">Dashboard</p>
      </div>

      <hr class="border-gray-300 mb-4">

      <div class="p-5 py-3 bg-white rounded-xl shadow min-h-fit">

        <div class="pt-2">
          <FloatLabel variant="on">
            <DatePicker class="w-64 h-9" showButtonBar showIcon="true"  v-model="dates" selectionMode="range" :manualInput="false" />
            <label for="on_label">Selecione o período</label>
          </FloatLabel>
        </div>

        <hr class="border-gray-300 my-5">

        <div class="w-full flex flex-wrap justify-between gap-10">
          <StatusGeralComponent class="lg:w-[48%] lg:h-64" :valuesList="valuesStatusGeral"/>
          <ProgressoAnalistaComponent class="lg:w-[48%] lg:h-64" :valuesData="valuesProgressoAnalista"/>

          <label class="flex w-full justify-center lg:text-4xl text-2xl font-semibold text-gray-700">Produtividade Média</label>
          <div class="flex overflow-x-scroll lg:overflow-hidden h-50 lg:w-full lg:h-64" >
            <ProdutividadePizzaComponent  :valuesData="valuesCultura"/>
            <ProdutividadePizzaComponent  :valuesData="valuesEstado"/>
            <ProdutividadePizzaComponent  :valuesData="valuesSolo"/>
          </div>

          <div class="w-full flex flex-wrap gap-10 ">

            <div class="bg-gray-100 p-4 rounded-lg shadow w-full sm:w-[48%] flex flex-col justify-center items-center">
              <p class="lg:text-3xl text-lg font-semibold text-gray-700 mb-2">Cultura Mais Produtiva</p>
              <p class="lg:text-2xl text-xl font-bold text-orange-400">{{ culturaMaisProdutiva.nome }}</p>
              <p class="text-lg text-gray-600">{{ culturaMaisProdutiva.valor.toLocaleString('pt-BR') }}</p>
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

        </div>
      </div>

    </div>

  </div>

</template>
