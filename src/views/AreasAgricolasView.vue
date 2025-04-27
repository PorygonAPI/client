<script setup>
import TalhaoListComponent from '@/components/TalhaoListComponent.vue';
import FazendaListComponent from '@/components/FazendaListComponent.vue';
import { ref,onMounted } from 'vue';

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
      id:fazenda.id,
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
        cultura: talhao.cultura,
        produtividade: talhao.produtividadeAno || 0,
        area: talhao.area,
        solo: talhao.tipoSoloNome,
        cidade: fazenda ? fazenda.cidade : 'Cidade não encontrada',
        estado: fazenda ? fazenda.estado : 'Estado não encontrado',
        status: talhao.status,
        idFazenda: fazenda? fazenda.id : "Id não existente."
      };
    });
  } catch (error) {
    console.error('Erro ao buscar talhões:', error);
  }
};

const saveTabSelection = () => {
  localStorage.setItem(STORAGE_KEY, activeTab.value);
};

onMounted(() => {
  fetchFazendas();
  saveTabSelection();
  fetchTalhoes();
  console.log(talhoes)
});

</script>

<template>
  <div class="h-full w-[90%] ml-[5%] mr-[5%]">
    <div class="flex flex-col">

      <div class="text-center p-2 mt-4 lg:mb-3 mb-1">
        <p class="text-4xl font-semibold text-gray-800">Áreas Agrícolas</p>
      </div>

      <hr class="border-gray-300 mb-4">

      <div class="bg-white shadow rounded-xl p-5">

        <div class="flex gap-3 mb-2">
          <span
          :class="[
              'p-1 px-2 rounded-lg shadow border-gray-300 transition flex items-center justify-center',
              activeTab === 'fazendas'
                ? 'bg-gray-300 text-gray-700 hover:bg-gray-300 transition'
                : 'bg-gray-400 text-white hover:bg-gray-300 hover:text-gray-600 transition'
            ]">
            <button
            class="cursor-pointer"
            @click="activeTab='fazendas',saveTabSelection()"
            >
            Fazendas
            </button>
          </span>
          <span
          :class="[
              'p-1 px-2 rounded-lg shadow border-gray-300 transition flex items-center justify-center',
              activeTab === 'talhoes'
                ? 'bg-gray-300 text-gray-700 hover:bg-gray-300 transition'
                : 'bg-gray-400 text-white hover:bg-gray-300 hover:text-gray-600 transition'
            ]">
            <button
            class="cursor-pointer"
            @click="activeTab='talhoes',saveTabSelection()"
            >Talhões</button>
          </span>
        </div>

        <hr class="border-gray-200 mb-4">

        <div>
          <FazendaListComponent v-if="activeTab === 'fazendas'" :fazendas="fazendas"/>
          <TalhaoListComponent v-if="activeTab === 'talhoes'" :talhao="talhoes"/>
        </div>

      </div>

    </div>
  </div>
</template>
