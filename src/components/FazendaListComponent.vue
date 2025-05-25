<script setup>
import { DataTable, Column, Button, InputText, Tag } from 'primevue';
import { FilterMatchMode } from '@primevue/core/api';
import { ref, defineProps, computed } from 'vue';
import Dialog from 'primevue/dialog';
import { useRouter } from 'vue-router';
import Botao from './Botao.vue';

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
      visibleExcluir.value = false;
      mostrarAlerta('Não é possível excluir fazendas com talhões associados.', 'error');
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

    <div v-if="alertaVisivel"
      :class="['fixed top-5 right-5 z-50 px-4 py-2 rounded shadow-lg text-white', alertaTipo === 'success' ? 'bg-green-500' : 'bg-red-500']">
      {{ alertaMensagem }}
    </div>

    <div class="flex justify-between">
      <InputText
        class="p-1 gap-2 border border-gray-300 rounded-lg w-44 lg:w-96 focus-within:ring focus-within:ring-orange-400"
        placeholder="Pesquisar" type="text" v-model="filtros['global'].value" />
      <Botao @click="cadastrarOuEditarFazenda(null)" tipo="primario">Cadastrar Fazendas</Botao>
    </div>

    <DataTable v-model:filters="filtros" :value="props.fazendas" removableSort paginator :rows="10" stripedRows
      class="p-3 min-w-[6rem] text-center" :global-filter-fields="['nome', 'cidade', 'estado', 'status']">
      <Column field="nome" header="Nome" sortable class="p-1 min-w-40 max-w-40" />
      <Column field="cidade" header="Cidade" sortable class="p-1" />
      <Column field="estado" header="Estado" sortable class="p-1" />

      <Column field="imagem" header="" class="p-1">
        <template #body="{ data }">
          <div @click="() => visualizarImagem(data.id)"
            class="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 cursor-pointer transition"
            title="Visualizar Imagem">
            <i class="pi pi-image text-blue-600" style="font-size: 1.8rem;"></i>
          </div>
        </template>
      </Column>


      <Column field="Editar Usuário" header="" class="p-1">
        <template #body="{ data }">
          <div @click="cadastrarOuEditarFazenda(data.id)"
            class="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 cursor-pointer transition"
            title="Editar Fazenda">
            <i class="pi pi-pen-to-square text-blue-600" style="font-size: 1.8rem;"></i>
          </div>
        </template>
      </Column>

    </DataTable>

    <Dialog v-model:visible="visibleExcluir" modal header="Confirmar Exclusão" class="w-80 lg:w-96 p-1">
      <hr class="border-gray-200 mb-2">
      <span class="block mb-5 p-0.5">Tem certeza que deseja excluir a fazenda <b>{{ nomeFazendaSelecionada
          }}</b>?</span>
      <div class="flex justify-end gap-2">
        <Button class="p-1" label="Cancelar" severity="secondary" @click="visibleExcluir = false" />
        <Button class="p-1" label="Confirmar" severity="danger" @click="confirmarExclusao" />
      </div>
    </Dialog>

  </div>
</template>
