<script setup>
import { ref } from "vue";

const form = ref({
  nomeFazenda: "",
  cultura: "",
  produtividade: "",
  area: "",
  tipoSolo: "",
  estado: "",
  arquivo: null,
});

const estados = ref([
  "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará", "Distrito Federal",
  "Espírito Santo", "Goiás", "Maranhão", "Mato Grosso", "Mato Grosso do Sul",
  "Minas Gerais", "Pará", "Paraíba", "Paraná", "Pernambuco", "Piauí",
  "Rio de Janeiro", "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia",
  "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"
]);

const handleFileUpload = (event) => {
  form.value.arquivo = event.target.files[0];
};

const submitForm = () => {
  console.log("Dados do formulário:", form.value);
  alert("Cadastro enviado com sucesso!");
};
</script>

<template>
  <div class="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl mx-auto">
    <h2 class="text-2xl font-semibold text-center mb-6">Cadastro de Área Agrícola</h2>

    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label class="block text-gray-700">Nome da Fazenda</label>
        <input v-model="form.nomeFazenda" type="text" class="w-full p-2 border border-gray-300 rounded-md" placeholder="Nome da fazenda" />
      </div>

      <div>
        <label class="block text-gray-700">Cultura</label>
        <input v-model="form.cultura" type="text" class="w-full p-2 border border-gray-300 rounded-md" placeholder="Cultura" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-gray-700">Produtividade por ano</label>
          <input v-model="form.produtividade" type="text" class="w-full p-2 border border-gray-300 rounded-md" placeholder="Ex: 50 toneladas" />
        </div>
        <div>
          <label class="block text-gray-700">Área</label>
          <input v-model="form.area" type="text" class="w-full p-2 border border-gray-300 rounded-md" placeholder="Ex: 100 hectares" />
        </div>
      </div>

      <div>
        <label class="block text-gray-700">Tipo de Solo</label>
        <input v-model="form.tipoSolo" type="text" class="w-full p-2 border border-gray-300 rounded-md" placeholder="Ex: Argiloso" />
      </div>

      <div>
        <label class="block text-gray-700">Estado</label>
        <select v-model="form.estado" class="w-full p-2 border border-gray-300 rounded-md">
          <option value="" disabled selected>Selecione o estado</option>
          <option v-for="estado in estados" :key="estado" :value="estado">{{ estado }}</option>
        </select>
      </div>

      <div class="flex flex-col items-center border-2 border-dashed border-gray-400 p-4 rounded-md">
        <label class="block text-gray-700">Upload do Arquivo</label>
        <input type="file" class="hidden" id="fileUpload" @change="handleFileUpload" />
        <button type="button" @click="document.getElementById('fileUpload').click()" class="mt-2 bg-gray-200 p-2 rounded-md hover:bg-gray-300">
          📤 Selecionar Arquivo
        </button>
        <p v-if="form.arquivo" class="text-sm text-gray-600 mt-2">{{ form.arquivo.name }}</p>
      </div>

      <button type="submit" class="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
        Cadastrar
      </button>
    </form>
  </div>
</template>
