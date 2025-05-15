<script setup>
import { DataTable,Column, Button, InputText, Tag, Toast  } from 'primevue';
import { FilterMatchMode } from  '@primevue/core/api';
import { ref, defineProps, computed } from 'vue';
import Dialog from 'primevue/dialog';
import { useRouter } from 'vue-router';

const editarTalhao = (idFazenda,id) => {

  router.push({ path: '/areasagro/cadastrotalhao', query: { idFazenda: idFazenda , id:id} });
};

const TOKEN = localStorage.getItem('token');

const router = useRouter();

const props = defineProps({
  talhao: {
    type: Array,
    required: true
  }
});

const filtros = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

const visibleExcluir = ref(false);
const talhaoSelecionado = ref(null);

const nomeTalhaoSelecionada = computed(() => talhaoSelecionado.value?.nome);

// const abrirDialog = (data) => {
//   talhaoSelecionado.value = data
//   visibleExcluir.value = true
// };

const confirmarExclusao = async () => {
  try {
    const response = await fetch(`/api/talhoes/${talhaoSelecionado.value.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + TOKEN,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log('Talhão excluído com sucesso');
      window.location.reload();
    } else {
      console.error('Erro ao excluir o talhão');

    }
  } catch (error) {
    console.error('Erro ao chamar a API de exclusão:', error);
  }
};

const getStatusSeverity = (status) => {
  switch (status) {
    case 'Aprovada':
      return 'success'
    case 'Pendente':
      return 'danger'
    case 'Em análise':
      return 'warn'
    default:
      return 'info'
  }
}

const visualizarImagem = (id) => {
  localStorage.setItem('id_visualizacao', id);
  router.push({ path: '/visualizartalhao' });
}


</script>

<template>
<Toast/>
<div class="bg-white rounded-xl shadow p-5 flex flex-col gap-3">

  <div class="flex justify-between ">
    <InputText
    class="p-1 flex gap-2 items-center border border-gray-300 rounded-lg w-44 lg:w-96 focus-within:ring focus-within:ring-orange-400"
    placeholder="Pesquisar"
    type="text"
    v-model="filtros['global'].value"
    />

  </div>

  <div>
  <DataTable
  v-model:filters="filtros"
  :value="props.talhao"
  removableSort
  paginator
  :rows="10"
  stripedRows
  class="p-datatable-gridlines"
  :global-filter-fields="['nome','cultura','produtividade','area','cidade','estado','status','solo']"
  >

  <Column field="nome" header="Nome" sortable class="p-1 min-w-40 max-w-40"/>
  <Column field="cultura" header="Cultura" sortable class="p-1"/>
  <Column field="produtividade" header="Produtividade" sortable class="p-1"/>
  <Column field="area" header="Área" sortable class="p-1"/>
  <Column field="solo" header="Solo" sortable class="p-1"/>
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
    <template #body="{ data }" >
      <div class="flex justify-center">
        <Button
        @click="() => visualizarImagem(data.idFazenda)"
        class="hover:text-gray-600 cursor-pointer p-1 m-1 px-2 bg-gray-400 text-white border-0 rounded shadow hover:bg-gray-300 transition">
        Visualizar
      </Button>
      </div>
    </template>
  </Column>


  <Column field="editar" header="Editar" class="p-1">
    <template #body="{ data }">
      <div class="flex justify-center">
        <Button
        @click="editarTalhao(data.idFazenda,data.id)"
        class="hover:text-gray-600 cursor-pointer p-1 m-1 px-2 bg-gray-400 text-white border-0 rounded shadow hover:bg-gray-300 transition">
          Editar
        </Button>
      </div>
    </template>
  </Column>

  <!-- <Column field="excluir" header="Excluir" class="p-1">
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
  </Column> -->

  </DataTable>

  <Dialog v-model:visible="visibleExcluir" modal header="Confirmar Exclusão" class="w-72 lg:w-96 p-1">
      <hr class="border-gray-200 mb-2">
      <span class="block mb-5 p-0.5">Tem certeza que deseja excluir este Talhão da <b>{{nomeTalhaoSelecionada}}</b>?</span>
      <div class="flex justify-end gap-2">
        <Button class="p-1" label="Cancelar" severity="secondary" @click="visibleExcluir = false" />
        <Button class="p-1" label="Confirmar" severity="danger" @click="confirmarExclusao" />
      </div>
  </Dialog>

  </div>

</div>
</template>
