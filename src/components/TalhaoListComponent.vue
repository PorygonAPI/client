<script setup>
import { DataTable, Column, Button, InputText, Tag } from 'primevue';
import { FilterMatchMode } from '@primevue/core/api';
import { ref, defineProps, computed, defineEmits, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import UsuarioService from '@/services/UsuarioService';

const props = defineProps({
  talhao: {
    type: Array,
    required: true
  }
});

// Add emits to notify parent component
const emits = defineEmits(['talhao-atribuido', 'error']);

const filtros = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const searchById = ref('');

const visibleExcluir = ref(false);
const talhaoSelecionado = ref(null);
const confirmarAtribuirDialog = ref(false);
const analistaSelecionado = ref(null);
const loading = ref(false);

const analistas = ref([]);
const loadingAnalistas = ref(false);

const fetchAnalistas = async () => {
  loadingAnalistas.value = true;
  try {
    analistas.value = await UsuarioService.getAnalistas();
  } catch (error) {
    console.error('Failed to load analysts:', error);
    emits('error', 'Falha ao carregar a lista de analistas');
  } finally {
    loadingAnalistas.value = false;
  }
};

onMounted(() => {
  fetchAnalistas();
});

const nomeFazendaSelecionada = computed(() => talhaoSelecionado.value?.nomeFazenda);

const abrirDialogAtribuir = (data) => {
  talhaoSelecionado.value = data;
  // Definir analista padrão se necessário
  analistaSelecionado.value = null;
  confirmarAtribuirDialog.value = true;
};

const confirmarExclusao = () => {
  console.log('Excluir talhão:', talhaoSelecionado.value);
  visibleExcluir.value = false;
};

const confirmarAtribuicao = async () => {
  if (!analistaSelecionado.value) return;

  loading.value = true;
  try {
    const response = await fetch(`/api/safras/${talhaoSelecionado.value.id}/associar-analista/${analistaSelecionado.value.id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });

    if (!response.ok) {
      throw new Error(`Erro ao atribuir analista: ${response.status}`);
    }

    emits('talhao-atribuido', {
      talhaoId: talhaoSelecionado.value.id,
      analistaId: analistaSelecionado.value.id
    });

    confirmarAtribuirDialog.value = false;
    console.log('Talhão atribuído com sucesso:', talhaoSelecionado.value, 'para analista:', analistaSelecionado.value);
  } catch (error) {
    console.error('Erro ao atribuir analista:', error);
    emits('error', `Falha ao atribuir analista: ${error.message}`);
  } finally {
    loading.value = false;
  }
};

const getStatusSeverity = (status) => {
  switch (status) {
    case 'APROVADO':
      return 'success'
    case 'PENDENTE':
      return 'warn'
    case 'EM_ANALISE':
      return 'info'
    default:
      return 'secondary'
  }
}

const formatStatus = (status) => {
  if (!status) return '';
  return status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}

const formatNumber = (value) => {
  if (value === null || value === undefined) return 'N/A';
  return value;
};

const filteredTalhoes = computed(() => {
  if (searchById.value && searchById.value.trim() !== '') {
    return props.talhao.filter(talhao =>
      talhao.id.toString() === searchById.value.trim()
    );
  }
  return props.talhao;
});

const isSearchFocused = ref(false);

const handleIdInput = (event) => {
  event.target.value = event.target.value.replace(/\D/g, '');
  searchById.value = event.target.value;
};
</script>

<template>
  <div class="bg-white rounded-xl shadow p-5 flex flex-col gap-3">
    <div class="flex justify-between items-center mb-3">
      <div class="relative flex items-center">
        <div class="relative">
          <i v-if="!isSearchFocused && !searchById"
             class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <InputText
            id="searchById"
            v-model="searchById"
            @input="handleIdInput"
            @focus="isSearchFocused = true"
            @blur="isSearchFocused = false"
            class="p-1 pl-3 border border-gray-300 rounded-lg w-40 focus-within:ring focus-within:ring-orange-400 focus:outline-none"
            pattern="[0-9]*"
            inputmode="numeric"
          />
        </div>
      </div>

    </div>

    <div>
      <DataTable
        v-model:filters="filtros"
        :value="filteredTalhoes"
        removableSort
        paginator
        :rows="10"
        stripedRows
        class="p-datatable-gridlines"
        :global-filter-fields="['id', 'nomeFazenda', 'cultura', 'produtividade', 'area', 'tipoSolo', 'cidade', 'estado', 'status']"
      >
        <Column field="id" header="ID Talhão" sortable class="p-1 w-24"/>
        <Column field="nomeFazenda" header="Nome Fazenda" sortable class="p-1 min-w-40"/>
        <Column field="cultura" header="Cultura" sortable class="p-1"/>
        <Column field="produtividade" header="Produtividade" sortable class="p-1">
          <template #body="{ data }">
            {{ formatNumber(data.produtividade) }}
          </template>
        </Column>
        <Column field="area" header="Área" sortable class="p-1"/>
        <Column field="tipoSolo" header="Tipo de Solo" sortable class="p-1"/>
        <Column field="cidade" header="Cidade" sortable class="p-1"/>
        <Column field="estado" header="Estado" sortable class="p-1"/>

        <Column field="status" header="Status" sortable class="p-1">
          <template #body="{ data }">
            <div class="flex justify-center">
              <Tag :value="formatStatus(data.status)" :severity="getStatusSeverity(data.status)" class="p-1" />
            </div>
          </template>
        </Column>

        <Column field="imagem" header="Imagem" class="p-1">
          <template #body>
            <div class="flex justify-center">
              <Button
              class="hover:text-gray-600 cursor-pointer p-1 m-1 px-2 bg-gray-400 text-white border-0 rounded shadow hover:bg-gray-300 transition">
              Visualizar
            </Button>
            </div>
          </template>
        </Column>

        <Column field="atribuir" header="Atribuir" class="p-1">
          <template #body="slotProps">
            <div class="flex justify-center">
              <Button
                @click="() => abrirDialogAtribuir(slotProps.data)"
                class="hover:text-gray-600 cursor-pointer p-2 m-1 bg-gray-400 text-white border-0 rounded-full shadow hover:bg-gray-300 transition"
                icon="pi pi-user-plus"
                aria-label="Atribuir"
                tooltip="Atribuir talhão"
              />
            </div>
          </template>
        </Column>

        <Column field="editar" header="Editar" class="p-1">
          <template #body="slotProps">
            <div class="flex justify-center">
              <Button class="hover:text-gray-600 cursor-pointer p-1 m-1 px-2 bg-gray-400 text-white border-0 rounded shadow hover:bg-gray-300 transition">
                <RouterLink :to="`/talhao/editar/${slotProps.data.id}`">Editar</RouterLink>
              </Button>
            </div>
          </template>
        </Column>
      </DataTable>

      <Dialog v-model:visible="visibleExcluir" modal header="Confirmar Exclusão" class="w-72 lg:w-96 p-1">
          <hr class="border-gray-200 mb-2">
          <span class="block mb-5 p-0.5">Tem certeza que deseja excluir este Talhão da <b>{{nomeFazendaSelecionada}}</b>?</span>
          <div class="flex justify-end gap-2">
            <Button class="p-1" label="Cancelar" severity="secondary" @click="visibleExcluir = false" />
            <Button class="p-1" label="Confirmar" severity="danger" @click="confirmarExclusao" />
          </div>
      </Dialog>

      <Dialog v-model:visible="confirmarAtribuirDialog" modal header="Atribuir Talhão" class="w-80 lg:w-96 p-1">
          <hr class="border-gray-200 mb-2">
          <div class="flex flex-col gap-3 mb-4">
            <div class="field">
              <label class="font-semibold block mb-1">ID do Talhão:</label>
              <span class="block pl-2">{{ talhaoSelecionado?.id }}</span>
            </div>

            <div class="field">
              <label class="font-semibold block mb-1">Nome da Fazenda:</label>
              <span class="block pl-2">{{ talhaoSelecionado?.nomeFazenda }}</span>
            </div>

            <div class="field">
              <label for="analista" class="font-semibold block mb-1">Selecionar Analista:</label>
              <Dropdown
                id="analista"
                v-model="analistaSelecionado"
                :options="analistas"
                optionLabel="nome"
                placeholder="Selecione um analista"
                :loading="loadingAnalistas"
                class="w-full"
              />
            </div>
          </div>

          <div class="flex justify-end gap-2">
            <Button class="p-1" label="Cancelar" severity="secondary" @click="confirmarAtribuirDialog = false" />
            <Button
              class="p-1"
              label="Confirmar"
              :loading="loading"
              severity="success"
              @click="confirmarAtribuicao"
              :disabled="!analistaSelecionado"
            />
          </div>
      </Dialog>

    </div>

  </div>
</template>

<style scoped>
.pi-search {
  font-size: 0.8rem;
}

.field {
  margin-bottom: 0.75rem;
}
</style>
