<script setup>
import { DataTable,Column, Button, InputText, Tag  } from 'primevue';
import { FilterMatchMode } from  '@primevue/core/api';
import { ref, defineProps } from 'vue';

const props = defineProps({
  talhao: {
    type: Array,
    required: true
  }
});

const filtros = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

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

</script>

<template>
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
    <template #body="{data}">
      <div class="flex justify-center">
        <Button
        class="cursor-pointer p-1 m-1 px-2 bg-gray-400 text-white border-0 rounded shadow hover:bg-gray-300 transition">
        Visualizar Imagem
      </Button>
      </div>
    </template>
  </Column>

  <Column field="atribuir" header="Atribuir" class="p-1">
    <template #body="{data}" >
      <div class="flex justify-center">
        <Button
        class="cursor-pointer p-1 m-1 px-2 bg-gray-400 text-white border-0 rounded shadow hover:bg-gray-300 transition">
        +
        </Button>
      </div>
    </template>
  </Column>

  </DataTable>
  </div>

</div>
</template>
