<script setup>
import { DataTable, Column, Button, InputText, Tag } from 'primevue';
import { FilterMatchMode } from '@primevue/core/api';
import { ref, defineProps, computed, defineEmits, onMounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import RadioButton from 'primevue/radiobutton';
import UsuarioService from '@/services/UsuarioService';

const props = defineProps({
  talhao: {
    type: Array,
    required: true
  }
});

const router = useRouter();
const emits = defineEmits(['talhao-atribuido', 'error']);

const filtros = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const searchById = ref('');
const talhaoSelecionado = ref(null);
const confirmarAtribuirDialog = ref(false);
const loading = ref(false);
const loadingAnalistas = ref(false);

const atribuicaoTipo = ref('self');
const analistas = ref([]);
const analistaSelecionado = ref(null);

const currentUser = ref({
  id: localStorage.getItem('userId') || '',
  nome: localStorage.getItem('nome') || 'Usuário atual'
});

const nomeFazendaSelecionada = computed(() => {
  return talhaoSelecionado.value?.nomeFazenda;
});

const fetchAnalistas = async () => {
  loadingAnalistas.value = true;
  try {
    analistas.value = await UsuarioService.getAnalistas();
    console.log('Analistas carregados:', analistas.value);
  } catch (error) {
    console.error('Falha ao carregar analistas:', error);
    emits('error', 'Falha ao carregar a lista de analistas. Verifique o console.');
    analistas.value = [];
  } finally {
    loadingAnalistas.value = false;
  }
};

const abrirDialogAtribuir = (data) => {
  talhaoSelecionado.value = data;
  atribuicaoTipo.value = 'self';
  analistaSelecionado.value = null;
  confirmarAtribuirDialog.value = true;

  if (analistas.value.length === 0 && !loadingAnalistas.value) {
     fetchAnalistas();
  }
};

const confirmarAtribuicao = async () => {
  let analistaId;

  if (atribuicaoTipo.value === 'self') {
    analistaId = currentUser.value.id;
    if (!analistaId) {
      emits('error', 'Não foi possível identificar o usuário atual. Por favor faça login novamente.');
      return;
    }
  } else {
    if (!analistaSelecionado.value) {
      emits('error', 'Por favor, selecione um analista.');
      return;
    }
    analistaId = analistaSelecionado.value.id;
  }

  if (!talhaoSelecionado.value || !talhaoSelecionado.value.id) {
     emits('error', 'ID do talhão selecionado não encontrado.');
     return;
  }

  loading.value = true;
  try {
    console.log(`Atribuindo talhão ${talhaoSelecionado.value.id} para analista ${analistaId}`);

    const response = await fetch(`/api/${talhaoSelecionado.value.id}/associar-analista/${analistaId}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || `Erro ${response.status}`;
      } catch (e) {
        errorMessage = await response.text() || `Erro ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    emits('talhao-atribuido', {
      talhaoId: talhaoSelecionado.value.id,
      analistaId: analistaId
    });

    confirmarAtribuirDialog.value = false;
    console.log('Talhão atribuído com sucesso:', talhaoSelecionado.value.id, 'para analista ID:', analistaId);
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
};

const formatStatus = (status) => {
  if (!status) return '';
  return status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

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

const visualizarTalhao = (talhaoId) => {
  localStorage.setItem('id_visualizacao', talhaoId);
  router.push({ name: 'visualizarTalhao' });
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
            placeholder=""
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
          <template #body="slotProps">
            <div class="flex justify-center">
              <Button
                @click="() => visualizarTalhao(slotProps.data.id)"
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
    </div>

    <!-- Analista-specific dialog -->
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
          <label class="font-semibold block mb-1">Atribuir para:</label>

          <div class="flex items-center gap-2 mb-2">
            <RadioButton v-model="atribuicaoTipo" inputId="self" name="atribuicaoTipo" value="self" />
            <label for="self">Eu mesmo ({{ currentUser.nome }})</label>
          </div>

          <div class="flex items-center gap-2">
            <RadioButton v-model="atribuicaoTipo" inputId="other" name="atribuicaoTipo" value="other" />
            <label for="other">Outro analista</label>
          </div>
        </div>

        <div class="field" v-if="atribuicaoTipo === 'other'">
          <label for="analista" class="font-semibold block mb-1">Selecionar Analista:</label>
          <Dropdown
            id="analista"
            v-model="analistaSelecionado"
            :options="analistas"
            optionLabel="nome"
            optionValue="id"
            placeholder="Selecione um analista"
            class="w-full"
            :loading="loadingAnalistas"
            :disabled="loadingAnalistas"
            filter
          />
          <small v-if="!loadingAnalistas && analistas.length === 0" class="text-red-500">Não foi possível carregar analistas.</small>
        </div>
      </div>

      <div class="flex justify-end gap-2">
        <Button class="p-1" label="Cancelar" severity="secondary" @click="confirmarAtribuirDialog = false" :disabled="loading"/>
        <Button
          class="p-1"
          label="Confirmar"
          :loading="loading"
          severity="success"
          @click="confirmarAtribuicao"
          :disabled="loading || (atribuicaoTipo === 'other' && !analistaSelecionado)"
        />
      </div>
    </Dialog>
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
