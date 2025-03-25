<template>
  <div class="h-full w-[90%] ml-[5%] mr-[5%]">
    <div class="flex flex-col">
      <div class="text-center p-2 mt-4 lg:mb-3 mb-1">
        <p class="text-4xl font-semibold text-gray-800">Gerenciamento de Usuários</p>
      </div>
      <hr class="border-gray-300 mb-4">
      <div class="p-5 bg-white rounded-xl shadow">
        <div class="flex  items-center lg:justify-between gap-5 lg:gap-5 mb-4">
          <div class="flex gap-2 items-center border border-gray-300 rounded-lg w-44 lg:w-96 p-2 focus-within:ring focus-within:ring-orange-200">
            <i class="pi pi-search text-gray-500"></i>
            <input v-model="search" type="text" placeholder="Pesquisar" class="w-full outline-none bg-transparent">
          </div>
          <div class="lg:my-0 flex flex-col justify-center lg:justify-start">
            <Button label="Cadastrar Usuário" class="bg-white text-black p-2 rounded-lg shadow border-gray-200 hover:bg-gray-200 transition flex items-center justify-center " />
          </div>
        </div>
        <DataTable :value="filteredUsuarios" removableSort paginator :rows="15" stripedRows class="p-datatable-gridlines ">
          <Column field="nome" header="Nome" sortable class="text-center p-1">
            <template #body="slotProps">
              <span class="text-gray-700 font-medium flex justify-start pl-1">{{ slotProps.data.nome }}</span>
            </template>
          </Column>
          <Column field="cargo" header="Cargo" sortable class="text-center p-1">
            <template #body="slotProps">
              <span class="text-gray-600 flex justify-start pl-1">{{ slotProps.data.cargo }}</span>
            </template>
          </Column>
          <Column class="p-1">
            <template #body="slotProps">
              <div class="flex justify-center gap-2">
                <button class="m-1 p-1 bg-yellow-300 text-black rounded shadow  hover:bg-yellow-200 transition">Editar</button>
                <button class="m-1 p-1 bg-red-400 text-black rounded shadow hover:bg-red-300 transition">Excluir</button>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

export default {
  components: {
    Button,
    DataTable,
    Column
  },
  setup() {
    const usuarios = ref([
      { nome: "Joselito", cargo: "Administrador" },
      { nome: "Maria", cargo: "Analista" },
      { nome: "Ana", cargo: "Analista" },
      { nome: "Cassio", cargo: "Consultor" },
      { nome: "José", cargo: "Consultor" }
    ]);

    const search = ref("");

    const filteredUsuarios = computed(() => {
      if (!search.value) return usuarios.value;
      return usuarios.value.filter(user =>
        user.nome.toLowerCase().includes(search.value.toLowerCase()) ||
        user.cargo.toLowerCase().includes(search.value.toLowerCase())
      );
    });

    return { usuarios, search, filteredUsuarios };
  }
};
</script>
