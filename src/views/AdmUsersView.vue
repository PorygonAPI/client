<template>
  <div class="h-full w-[90%] ml-[5%] mr-[5%]">

    <div class="flex flex-col">

      <div class="text-center p-2 mt-4 lg:mb-3 mb-1">
        <p class="text-4xl">
          Gerenciamento de Usuários
        </p>
      </div>

      <hr class="border-gray-200 mb-2">

      <div class="p-1 lg:text-left text-center">
        <p class="lg:text-2xl text-lg mb-0.5 font-bold lg:font-normal">
          Pesquisar Usuários
        </p>
      </div>

      <div class="flex lg:flex-row flex-col items-center lg:justify-between gap-3 lg:gap-5">
        <div class="flex gap-2 items-center">
          <input type="text" name="" id="" class="border rounded-sm w-44 lg:w-96">
          <button class=" bg-gray-200 cursor-pointer border rounded-4xl p-0.5 px-1.5 text-sm shadow
          hover:bg-orange-100 hover:text-orange-500 transition">
          Pesquisar
          </button>
        </div>

        <div class="lg:my-0 flex flex-col justify-center lg:justify-start">
          <p class="lg:hidden text-center text-lg mb-0.5 font-bold">Cadastrar Usuários</p>

          <button class=" bg-gray-200 cursor-pointer border lg:px-2 p-2 lg:p-0.5 rounded-lg shadow hover:bg-orange-100
           hover:text-orange-500 transition text-sm lg:text-base">
            <span class="hidden lg:block">Cadastrar Novos Usuário</span>
            <span class="block lg:hidden">Cadastrar</span>
          </button>
        </div>

      </div>

      <hr class="border-gray-200 my-4">

      <div class="p-3 bg-white rounded-2xl shadow">
        <DataTable :value="usuarios" tableStyle="min-width: 50rem">
          <DataTableColumn field="nome" header="Nome" />
          <DataTableColumn field="cargo" header="Cargo" />
        </DataTable>
      </div>
    </div>

  </div>
</template>


<script>
export default {
  data() {
    return {
      usuarios: [
        { nome: "Joselito", cargo: "Administrador" },
        { nome: "Maria", cargo: "Analista" },
        { nome: "Ana", cargo: "Analista" },
        { nome: "Cassio", cargo: "Consultor" },
        { nome: "José", cargo: "Consultor" }
      ]
    };
  }
};
</script>
