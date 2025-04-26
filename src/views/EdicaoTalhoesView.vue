<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { listarTalhoesPorUsuario } from '@/services/talhaoService';

const router = useRouter();
const searchQuery = ref('');
const currentDate = ref(new Date().toLocaleDateString('pt-BR'));

const talhoesAtribuidos = ref([]);
const talhoesAprovados = ref([]);
const counts = ref({ atribuidos: 0, aprovados: 0 });
const isLoading = ref(true);
const error = ref(null);

const fetchData = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const userId = localStorage.getItem('id') || '2'; // Usando 2 como fallback para teste
    console.group('Carregando talhões');
    console.log('ID do usuário:', userId);

    const response = await listarTalhoesPorUsuario(userId);
    console.log('Dados recebidos:', response);

    // Os dados já vêm mapeados do serviço no formato correto
    talhoesAtribuidos.value = response.atribuidos;
    talhoesAprovados.value = response.aprovados;

    counts.value = {
      atribuidos: talhoesAtribuidos.value.length,
      aprovados: talhoesAprovados.value.length
    };

    console.log('Talhões carregados:', {
      atribuidos: talhoesAtribuidos.value,
      aprovados: talhoesAprovados.value
    });
    console.groupEnd();

  } catch (error) {
    console.error('Erro ao carregar talhões:', error);
    error.value = 'Erro ao carregar talhões. Por favor, tente novamente.';
  } finally {
    isLoading.value = false;
  }
};

const filteredTalhoesAtribuidos = computed(() => {
  if (!searchQuery.value) return talhoesAtribuidos.value;
  const query = searchQuery.value.toLowerCase();
  return talhoesAtribuidos.value.filter(talhao =>
    talhao.fazenda.toLowerCase().includes(query) ||
    talhao.cultura.toLowerCase().includes(query) ||
    talhao.numero.toString().includes(query)
  );
});

const filteredTalhoesAprovados = computed(() => {
  if (!searchQuery.value) return talhoesAprovados.value;
  const query = searchQuery.value.toLowerCase();
  return talhoesAprovados.value.filter(talhao =>
    talhao.fazenda.toLowerCase().includes(query) ||
    talhao.cultura.toLowerCase().includes(query) ||
    talhao.numero.toString().includes(query)
  );
});

const editarTalhao = (id) => {
  router.push(`/talhao/editar/${id}`);
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="edicao-talhoes-container p-4 md:p-6">
    <h1 class="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">Edição de Talhões</h1>

    <!-- Loading state -->
    <div v-if="isLoading" class="text-center py-8">
      <i class="pi pi-spin pi-spinner text-4xl text-orange-400"></i>
      <p class="mt-2 text-gray-600">Carregando talhões...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
      <p class="font-medium">{{ error }}</p>
      <button
        @click="fetchData"
        class="mt-2 text-sm text-red-600 hover:text-red-800 underline"
      >
        Tentar novamente
      </button>
    </div>

    <!-- Content -->
    <div v-else>
      <div class="controls-section bg-white p-4 rounded-lg shadow-md mb-6">
        <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div class="date-display text-gray-700">
            <i class="pi pi-calendar mr-2"></i>
            <span>{{ currentDate }}</span>
          </div>

          <div class="search-container relative">
            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <i class="pi pi-search"></i>
            </span>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Pesquisar talhões..."
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
        </div>
      </div>

      <div class="count-cards grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="count-card bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 class="text-lg font-medium text-gray-700">Talhões Atribuídos</h3>
          <p class="text-3xl font-bold text-blue-600">{{ counts.atribuidos }}</p>
        </div>
        <div class="count-card bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 class="text-lg font-medium text-gray-700">Talhões Aprovados</h3>
          <p class="text-3xl font-bold text-green-600">{{ counts.aprovados }}</p>
        </div>
      </div>

      <div class="talhoes-lists">
        <div class="talhoes-section bg-white p-4 rounded-lg shadow-md mb-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span class="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
            Talhões Atribuídos
          </h2>

          <div v-if="filteredTalhoesAtribuidos.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="talhao in filteredTalhoesAtribuidos" :key="talhao.id" class="talhao-card border border-gray-200 rounded-lg p-3">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-medium text-gray-800">{{ talhao.fazenda }}</h4>
                  <p class="text-sm text-gray-600">Talhão #{{ talhao.numero }}</p>
                  <p class="text-sm text-gray-600">{{ talhao.cultura }}</p>
                </div>
                <button
                  @click="editarTalhao(talhao.id)"
                  class="bg-gray-100 hover:bg-gray-200 p-2 rounded-md"
                  title="Editar talhão"
                >
                  <i class="pi pi-pencil text-gray-600"></i>
                </button>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-4 text-gray-500">
            Nenhum talhão atribuído encontrado.
          </div>
        </div>

        <div class="talhoes-section bg-white p-4 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span class="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
            Talhões Aprovados
          </h2>

          <div v-if="filteredTalhoesAprovados.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="talhao in filteredTalhoesAprovados" :key="talhao.id" class="talhao-card border border-gray-200 rounded-lg p-3">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-medium text-gray-800">{{ talhao.fazenda }}</h4>
                  <p class="text-sm text-gray-600">Talhão #{{ talhao.numero }}</p>
                  <p class="text-sm text-gray-600">{{ talhao.cultura }}</p>
                </div>
                <button
                  @click="editarTalhao(talhao.id)"
                  class="bg-gray-100 hover:bg-gray-200 p-2 rounded-md"
                  title="Editar talhão"
                >
                  <i class="pi pi-pencil text-gray-600"></i>
                </button>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-4 text-gray-500">
            Nenhum talhão aprovado encontrado.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
