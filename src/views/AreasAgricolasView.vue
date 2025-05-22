<script setup>
import TalhaoListComponent from '@/components/TalhaoListComponent.vue';
import FazendaListComponent from '@/components/FazendaListComponent.vue';
import { ref, onMounted } from 'vue';
import Titulo from '@/components/Titulo.vue';

const STORAGE_KEY = 'selectedTab';
const TOKEN = localStorage.getItem('token');
const activeTab = ref(localStorage.getItem(STORAGE_KEY) || 'fazendas');

const fazendas = ref([]);
const talhoes = ref([]);

const fetchFazendas = async () => {
  try {
    const response = await fetch('/api/areas-agricolas', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + TOKEN
      }
    });
    const data = await response.json();

    fazendas.value = data.map(fazenda => ({
      id: fazenda.id,
      nome: fazenda.nomeFazenda,
      cidade: fazenda.cidadeNome,
      estado: fazenda.estado,
      status: fazenda.status
    }));

  } catch (error) {
    console.error('Erro ao buscar áreas agrícolas:', error);
  }
};

const fetchTalhoes = async () => {
  try {
    const response = await fetch('/api/talhoes', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + TOKEN
      }
    });
    const data = await response.json();

    talhoes.value = data.map(talhao => {
      const fazenda = fazendas.value.find(f => f.id === talhao.areaAgricola);
      return {
        id: talhao.id,
        nome: fazenda ? fazenda.nome : 'Fazenda não encontrada',
        cultura: talhao.culturaNome,
        produtividade: talhao.produtividadeAno,
        area: talhao.area,
        solo: talhao.tipoSoloNome,
        cidade: fazenda ? fazenda.cidade : 'Cidade não encontrada',
        estado: fazenda ? fazenda.estado : 'Estado não encontrado',
        status: talhao.status,
        idFazenda: fazenda ? fazenda.id : "Id não existente."
      };
    });
  } catch (error) {
    console.error('Erro ao buscar talhões:', error);
  }
};

const saveTabSelection = () => {
  localStorage.setItem(STORAGE_KEY, activeTab.value);
};

onMounted(async () => {
  await fetchFazendas();
  await fetchTalhoes();
  saveTabSelection();
});
</script>

<template>
  <div class="h-full w-[90%] ml-[5%] mr-[5%]">
    <div class="flex flex-col">

      <Titulo title="Áreas Agrícolas" />

      <div class="bg-white shadow rounded-xl p-5">
        <div class="flex border-b border-gray-300 mb-4">
          <button
            @click="activeTab = 'fazendas'; saveTabSelection()"
            :class="[
              'py-2 px-6 -mb-px font-semibold text-gray-700 border-b-2 transition-colors duration-300',
              activeTab === 'fazendas'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent hover:text-blue-500'
            ]"
          >
            Fazendas
          </button>

          <button
            @click="activeTab = 'talhoes'; saveTabSelection()"
            :class="[
              'py-2 px-6 -mb-px font-semibold text-gray-700 border-b-2 transition-colors duration-300',
              activeTab === 'talhoes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent hover:text-blue-500'
            ]"
          >
            Talhões
          </button>
        </div>

        <div>
          <FazendaListComponent v-if="activeTab === 'fazendas'" :fazendas="fazendas" />
          <TalhaoListComponent v-if="activeTab === 'talhoes'" :talhao="talhoes" />
        </div>

      </div>

    </div>
  </div>
</template>
