<script setup>
import { DataTable, Column, Button, InputText, Tag } from 'primevue';
import { FilterMatchMode } from '@primevue/core/api';
import { ref, defineProps, computed, defineEmits } from 'vue';
import { useRouter } from 'vue-router';
import Dialog from 'primevue/dialog';
import { useToast } from 'primevue/usetoast';
import Botao from './Botao.vue';
import Tooltip from 'primevue/tooltip'

const props = defineProps({
  talhao: {
    type: Array,
    required: true
  }
});

const router = useRouter();
const toast = useToast();
const emits = defineEmits(['talhao-atribuido', 'error']);

const filtros = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const searchById = ref('');
const talhaoSelecionado = ref(null);
const confirmarAtribuirDialog = ref(false);
const loading = ref(false);

const currentUserId = localStorage.getItem('userId');
const currentUserName = localStorage.getItem('nome') || 'Usuário atual';

const filteredTalhoes = computed(() => {
  if (searchById.value && searchById.value.trim() !== '') {
    return props.talhao.filter(talhao =>
      talhao.id?.toString() === searchById.value.trim()
    );
  }
  return props.talhao;
});

const isSearchFocused = ref(false);

const handleIdInput = (event) => {
  event.target.value = event.target.value.replace(/\D/g, '');
  searchById.value = event.target.value;
};

const abrirDialogAtribuir = (data) => {
  talhaoSelecionado.value = data;
  confirmarAtribuirDialog.value = true;

};

const confirmarAtribuicao = async () => {
  if (!currentUserId) {
    const errorMsg = 'Não foi possível identificar o usuário atual. Por favor faça login novamente.';
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: errorMsg,
      life: 5000
    });
    emits('error', errorMsg);
    return;
  }

  if (!talhaoSelecionado.value || !talhaoSelecionado.value.id) {
    const errorMsg = 'ID do talhão não encontrado.';
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: errorMsg,
      life: 5000
    });
    emits('error', errorMsg);
    return;
  }

  loading.value = true;
  try {
    const safraId = talhaoSelecionado.value.id;

    const apiUrl = `/api/safras/${safraId}/associar-analista/${currentUserId}`;

    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      let errorMessage = `Erro ${response.status}`;
      try {
        const text = await response.text();

        if (text && text.trim().length > 0) {
          try {
            if (text.includes('{') || text.includes('[')) {
              const errorData = JSON.parse(text);
              errorMessage = errorData.message || errorMessage;
            } else {
              errorMessage = text;
            }
          } catch (jsonError) {
            console.error('Erro ao analisar resposta:', jsonError);
            errorMessage = text || errorMessage;
          }
        }
      } catch (e) {
        console.error('Erro ao ler resposta:', e);
      }
      throw new Error(errorMessage);
    }

    confirmarAtribuirDialog.value = false;
    emits('talhao-atribuido', {
      talhaoId: talhaoSelecionado.value.id,
      analistaId: currentUserId
    });

  } catch (error) {
    console.error('Erro ao atribuir analista:', error);

    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: `Falha ao atribuir analista: ${error.message}`,
      life: 5000
    });

    emits('error', `Falha ao atribuir analista: ${error.message}`);
  } finally {
    loading.value = false;
  }
};

const getStatusSeverity = (status) => {
  switch (status.toLowerCase()) {
    case 'aprovado':
      return 'success';
    case 'pendente':
      return 'danger';
    case 'atribuido':
      return 'warn';
    default:
      return 'info';
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

const visualizarTalhao = (talhaoId) => {
  localStorage.setItem('id_visualizacao', talhaoId);
  router.push({ name: 'visualizarTalhao' });
};

const editarTalhao = (id) => {
  router.push(`/talhao/editar/${id}`);
};
</script>

<template>
  <div class="bg-white rounded-xl shadow p-5 flex flex-col gap-3">
    <div class="flex justify-between items-center mb-3">
      <div class="relative flex items-center">
        <div class="relative">
          <i v-if="!isSearchFocused && !searchById"
            class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <InputText id="searchById" v-model="searchById" @input="handleIdInput" @focus="isSearchFocused = true"
            @blur="isSearchFocused = false"
            class="p-1 pl-8 border border-gray-300 rounded-lg w-40 focus-within:ring focus-within:ring-orange-400 focus:outline-none"
            pattern="[0-9]*" inputmode="numeric" placeholder="Buscar por ID" />
        </div>
      </div>
    </div>

    <div>
      <DataTable v-model:filters="filtros" :value="filteredTalhoes" removableSort paginator :rows="10" stripedRows
        class="p-3 min-w-[6rem] text-center"
        :global-filter-fields="['id', 'nomeFazenda', 'cultura', 'produtividade', 'area', 'tipoSolo', 'cidade', 'estado', 'status']">
        <Column field="id" header="ID" sortable class="p-1 w-24" />
        <Column field="nomeFazenda" header="Nome Fazenda" sortable class="p-1 min-w-40" />
        <Column field="cultura" header="Cultura" sortable class="p-1" />
        <Column field="produtividade" header="Produtividade" sortable class="p-1">
          <template #body="{ data }">
            {{ formatNumber(data.produtividade) }}
          </template>
        </Column>
        <Column field="area" header="Área" sortable class="p-1" />
        <Column field="tipoSolo" header="Tipo de Solo" sortable class="p-1" />
        <Column field="cidade" header="Cidade" sortable class="p-1" />
        <Column field="estado" header="Estado" sortable class="p-1" />

        <Column field="status" header="Status" sortable class="p-1">
          <template #body="{ data }">
            <div class="flex justify">
              <Tag :value="formatStatus(data.status)" :severity="getStatusSeverity(data.status)" class="p-1" />
            </div>
          </template>
        </Column>

        <Column field="imagem" header="" class="p-1">
          <template #body="slotProps">

            <div @click="() => visualizarTalhao(slotProps.data.id)"
              class="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 cursor-pointer transition" title="Visualizar Imagem">
              <i class="pi pi-image text-blue-600" style="font-size: 1.8rem;"></i>
            </div>

          </template>
        </Column>

        <Column field="atribuir" header="" class="p-1">
          <template #body="slotProps">
            <div @click="() => abrirDialogAtribuir(slotProps.data)"
              class="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 cursor-pointer transition"
              title="Atribuir">
              <i class="pi pi-user-plus text-green-600" style="font-size: 1.8rem;"></i>
            </div>

          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
  v-model:visible="confirmarAtribuirDialog"
  modal
  dismissableMask="false"
  :closeOnEscape="false"
  header="Atribuir Talhão"
  class="custom-dialog w-96 lg:w-[30rem] p-6 rounded-lg shadow-lg bg-white max-h-[90vh] overflow-y-auto overflow-x-hidden"
>
  <div class="dialog-content space-y-6">
    <div class="field flex justify-between items-center">
      <label class="font-semibold text-gray-700 w-40">ID do Talhão:</label>
      <span class="text-gray-900 font-medium truncate">{{ talhaoSelecionado?.id }}</span>
    </div>

    <div class="field flex justify-between items-center">
      <label class="font-semibold text-gray-700 w-40">Nome da Fazenda:</label>
      <span class="text-gray-900 font-medium truncate">{{ talhaoSelecionado?.nomeFazenda }}</span>
    </div>

    <div class="field flex justify-between items-center">
      <label class="font-semibold text-gray-700 w-40">Atribuir para:</label>
      <span class="text-gray-900 font-medium truncate">{{ currentUserName }} (ID: {{ currentUserId }})</span>
    </div>

    <div class="flex justify-end gap-6 mt-8">
      <Botao @click="confirmarAtribuirDialog = false"
        :disabled="loading" tipo="exclusao">Cancelar</Botao>
      <Botao label="Confirmar"
        :loading="loading"
        severity="success"
        @click="confirmarAtribuicao"
        :disabled="loading" tipo="primario">Confirmar</Botao>
    </div>
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

.custom-dialog {
  border-radius: 1rem !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
  background-color: #fff !important;
  padding: 2rem !important;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.custom-dialog .p-dialog-header {
  font-weight: 700 !important;
  font-size: 1.5rem !important;
  border-bottom: 2px solid #f0a500 !important;
  padding-bottom: 0.75rem !important;
  color: #f97316 !important;
}

.dialog-content {
  margin-top: 1rem;
  font-size: 1rem;
  line-height: 1.5;
}

.dialog-content .field label {
  color: #555;
  font-weight: 600;
}

.dialog-content .field span {
  padding-left: 0.5rem;
  color: #222;
}

.cancel-btn {
  background-color: #e5e7eb;
  /* cinza claro */
  color: #374151;
  border-radius: 0.5rem;
  padding: 0.5rem 1.25rem;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.cancel-btn:hover:not(:disabled) {
  background-color: #d1d5db;
  color: #1f2937;
}

.confirm-btn {
  border-radius: 0.5rem;
  padding: 0.5rem 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
}

.confirm-btn:hover:not(:disabled) {
  filter: brightness(1.1);
}
</style>
