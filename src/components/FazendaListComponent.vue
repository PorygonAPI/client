<script setup>
import { DataTable, Column, Button, InputText, Tag } from 'primevue';
import { FilterMatchMode } from '@primevue/core/api';
import { ref, defineProps, computed } from 'vue';
import Dialog from 'primevue/dialog';
import { useRouter } from 'vue-router';

const TOKEN = localStorage.getItem('token');

const router = useRouter();

const cadastrarOuEditarFazenda = (id) => {
  router.push({ path: '/areasagro/cadastrofazenda', query: { id: id } });
};

const props = defineProps({
  fazendas: {
    type: Array,
    required: true
  }
});

const filtros = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const visibleExcluir = ref(false);
const fazendaSelecionada = ref(null);

const getStatusSeverity = (status) => {
  switch (status) {
    case 'Aprovada':
      return 'success';
    case 'Pendente':
      return 'danger';
    case 'Em análise':
      return 'warn';
    default:
      return 'info';
  }
};

const visualizarImagem = (id) => {
  localStorage.setItem('id_visualizacao', id);
  router.push({ path: '/visualizartalhao' });
}

const nomeFazendaSelecionada = computed(() => fazendaSelecionada.value?.nome);

const abrirDialog = (data) => {
  fazendaSelecionada.value = data
  visibleExcluir.value = true
};

  const confirmarExclusao = async () => {
  try {
    const response = await fetch(`/api/areas-agricolas/${fazendaSelecionada.value.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + TOKEN,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log('Fazenda excluída com sucesso');
      window.location.reload();
    } else {
      visibleExcluir.value=false;
      mostrarAlerta( 'Não é possível excluir fazendas com talhões associados.', 'error');
    }
  } catch (error) {
    console.error('Erro ao chamar a API de exclusão:', error);
  }
};

const alertaVisivel = ref(false);
const alertaMensagem = ref('');
const alertaTipo = ref('success');

const mostrarAlerta = (mensagem, tipo = 'success') => {
  alertaMensagem.value = mensagem;
  alertaTipo.value = tipo;
  alertaVisivel.value = true;
  setTimeout(() => {
    alertaVisivel.value = false;
  }, 2000);
};

</script>

<template>
  <div class="bg-white rounded-xl shadow p-5 flex flex-col gap-3">

    <div v-if="alertaVisivel" :class="['fixed top-5 right-5 z-50 px-4 py-2 rounded shadow-lg text-white', alertaTipo === 'success' ? 'bg-green-500' : 'bg-red-500']">
    {{ alertaMensagem }}
    </div>

    <div class="flex justify-between">
      <InputText
        class="p-1 gap-2 border border-gray-300 rounded-lg w-44 lg:w-96 focus-within:ring focus-within:ring-orange-400"
        placeholder="Pesquisar"
        type="text"
        v-model="filtros['global'].value"
      />

      <Button @click="cadastrarOuEditarFazenda(null)" class="md:text-base text-sm p-1 px-2 rounded-lg shadow text-white border-gray-300 bg-gray-400 hover:text-gray-600 hover:bg-gray-300 transition">
          <span class="block md:hidden">Cadastrar</span>
          <span class="hidden md:block">Cadastrar Fazendas</span>
      </Button>
    </div>

    <DataTable
      v-model:filters="filtros"
      :value="props.fazendas"
      removableSort
      paginator
      :rows="10"
      stripedRows
      class="p-datatable-gridlines"
      :global-filter-fields="['nome', 'cidade', 'estado', 'status']"
    >
      <Column field="nome" header="Nome" sortable class="p-1 min-w-40 max-w-40"/>
      <Column field="cidade" header="Cidade" sortable class="p-1"/>
      <Column field="estado" header="Estado" sortable class="p-1"/>

      <Column field="status" header="Status" sortable class="p-1">
        <template #body="{ data }">
          <div class="flex justify-center">
            <Tag :value="data.status" :severity="getStatusSeverity(data.status)" class="p-1" />
          </div>
        </template>
      </Column>

      <Column field="imagem" header="Imagem" class="p-1">
        <template #body="{ data }">
          <div class="flex justify-center">
            <Button  @click="() => visualizarImagem(data.idFazenda)"
            class=" hover:text-gray-600 cursor-pointer p-1 m-1 px-2 bg-gray-400 text-white border-0 rounded shadow hover:bg-gray-300 transition">
              Visualizar
            </Button>
          </div>
        </template>
      </Column>

      <Column field="editar" header="Editar" class="p-1">
        <template #body="dataBody">
          <div class="flex justify-center">
            <Button
            class="hover:text-gray-600 cursor-pointer p-1 m-1 px-2 bg-gray-400 text-white border-0 rounded shadow hover:bg-gray-300 transition"
            @click="cadastrarOuEditarFazenda(dataBody.data.id)">
              Editar
            </Button>
          </div>
        </template>
      </Column>

      <Column field="excluir" header="Excluir" class="p-1">
        <template #body="{ data }">
          <div class="flex justify-center">
            <Button
              class="cursor-pointer p-1 m-1 px-2 bg-orange-400 text-white border-0 rounded shadow hover:text-orange-500 hover:bg-orange-300 transition"
              @click="() => { abrirDialog(data) }"
            >
              Excluir
            </Button>
          </div>
        </template>
      </Column>
    </DataTable>


    <Dialog v-model:visible="visibleExcluir" modal header="Confirmar Exclusão" class="w-80 lg:w-96 p-1">
      <hr class="border-gray-200 mb-2">
      <span class="block mb-5 p-0.5">Tem certeza que deseja excluir a fazenda <b>{{ nomeFazendaSelecionada }}</b>?</span>
      <div class="flex justify-end gap-2">
        <Button class="p-1" label="Cancelar" severity="secondary" @click="visibleExcluir = false" />
        <Button class="p-1" label="Confirmar" severity="danger" @click="confirmarExclusao" />
      </div>
    </Dialog>

  </div>
</template>
