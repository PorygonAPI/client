<script setup>
import { ref, computed } from "vue";

// Função para substituir vírgula por ponto
const formatNumber = (value) => {
  return value ? value.replace(',', '.') : '';
}

// Definição do formulário
const form = ref({
  nomeFazenda: "",
  cultura: "",
  produtividade: "",
  area: "",
  tipoSolo: "",
  cidade: "",
  estado: "",
  vetorRaiz: "",
  status: "",
  arquivo: null,
});

// Lista de estados (siglas conforme o banco)
const estados = ref([
  { nome: "Acre", sigla: "AC" }, { nome: "Alagoas", sigla: "AL" },
  { nome: "Amapá", sigla: "AP" }, { nome: "Amazonas", sigla: "AM" },
  { nome: "Bahia", sigla: "BA" }, { nome: "Ceará", sigla: "CE" },
  { nome: "Distrito Federal", sigla: "DF" }, { nome: "Espírito Santo", sigla: "ES" },
  { nome: "Goiás", sigla: "GO" }, { nome: "Maranhão", sigla: "MA" },
  { nome: "Mato Grosso", sigla: "MT" }, { nome: "Mato Grosso do Sul", sigla: "MS" },
  { nome: "Minas Gerais", sigla: "MG" }, { nome: "Pará", sigla: "PA" },
  { nome: "Paraíba", sigla: "PB" }, { nome: "Paraná", sigla: "PR" },
  { nome: "Pernambuco", sigla: "PE" }, { nome: "Piauí", sigla: "PI" },
  { nome: "Rio de Janeiro", sigla: "RJ" }, { nome: "Rio Grande do Norte", sigla: "RN" },
  { nome: "Rio Grande do Sul", sigla: "RS" }, { nome: "Rondônia", sigla: "RO" },
  { nome: "Roraima", sigla: "RR" }, { nome: "Santa Catarina", sigla: "SC" },
  { nome: "São Paulo", sigla: "SP" }, { nome: "Sergipe", sigla: "SE" },
  { nome: "Tocantins", sigla: "TO" }
]);

// Enum para Status (valores conforme o banco)
const statusOptions = ref(["Ativo", "Inativo", "Em Análise"]);

// Mensagens de erro
const errors = ref({});

// Função de validação
const validateForm = () => {
  errors.value = {};

  if (!form.value.nomeFazenda) errors.value.nomeFazenda = "Campo obrigatório.";
  if (!form.value.cultura) errors.value.cultura = "Campo obrigatório.";
  if (!form.value.produtividade || isNaN(form.value.produtividade) || form.value.produtividade <= 0)
    errors.value.produtividade = "Campo obrigatório.";
  if (!form.value.area || isNaN(form.value.area) || form.value.area <= 0)
    errors.value.area = "Campo obrigatório.";
  if (!form.value.tipoSolo) errors.value.tipoSolo = "Campo obrigatório.";
  if (!form.value.cidade) errors.value.cidade = "Campo obrigatório.";
  if (!form.value.estado) errors.value.estado = "Campo obrigatório.";
  if (!form.value.status) errors.value.status = "Campo obrigatório.";
  if (!form.value.vetorRaiz) errors.value.vetorRaiz = "Campo obrigatório.";

  // Validação do arquivo (se enviado)
  if (form.value.arquivo) {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(form.value.arquivo.type)) {
      errors.value.arquivo = "Formato de arquivo inválido. Apenas JPG, PNG e PDF são permitidos.";
    }
  }

  return Object.keys(errors.value).length === 0;
};

// Função para capturar o arquivo
const handleFileUpload = (event) => {
  form.value.arquivo = event.target.files[0];
};

// Submissão do formulário
const submitForm = () => {
  if (!validateForm()) {
    alert("Corrija os erros antes de enviar.");
    return;
  }

  console.log("Dados do formulário:", form.value);
  alert("Cadastro enviado com sucesso!");
};
</script>

<template>
  <div class="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl mx-auto">
    <h2 class="text-2xl font-semibold text-center mb-6">Cadastro de Área Agrícola</h2>

    <form @submit.prevent="submitForm" class="space-y-4">
      <div v-for="(label, field) in {
        nomeFazenda: 'Nome da Fazenda', cultura: 'Cultura',
        produtividade: 'Produtividade por Ano', area: 'Área',
        tipoSolo: 'Tipo de Solo', cidade: 'Cidade', vetorRaiz: 'Vetor Raiz'
      }" :key="field">
        <label class="block text-gray-700">{{ label }}</label>
        <input v-model="form[field]" :type="['produtividade', 'area'].includes(field) ? 'text' : 'text'"
               class="w-full p-2 border border-gray-300 rounded-md"
               :placeholder="label"
               :class="{ 'border-red-500': errors[field] }"
               @input="form[field] = formatNumber(form[field])" />
        <p v-if="errors[field]" class="text-red-500 text-sm">{{ errors[field] }}</p>
      </div>

      <div>
        <label class="block text-gray-700">Estado</label>
        <select v-model="form.estado" class="w-full p-2 border border-gray-300 rounded-md"
                :class="{ 'border-red-500': errors.estado }">
          <option value="" disabled>Selecione o estado</option>
          <option v-for="estado in estados" :key="estado.sigla" :value="estado.sigla">{{ estado.nome }}</option>
        </select>
        <p v-if="errors.estado" class="text-red-500 text-sm">{{ errors.estado }}</p>
      </div>

      <div>
        <label class="block text-gray-700">Status</label>
        <select v-model="form.status" class="w-full p-2 border border-gray-300 rounded-md"
                :class="{ 'border-red-500': errors.status }">
          <option value="" disabled>Selecione o status</option>
          <option v-for="status in statusOptions" :key="status" :value="status">{{ status }}</option>
        </select>
        <p v-if="errors.status" class="text-red-500 text-sm">{{ errors.status }}</p>
      </div>

      <div class="flex flex-col items-center border-2 border-dashed border-gray-400 p-4 rounded-md">
        <label class="block text-gray-700">Upload do Arquivo</label>
        <input type="file" class="hidden" id="fileUpload" @change="handleFileUpload" />
        <button type="button" @click="document.getElementById('fileUpload').click()" class="mt-2 bg-gray-200 p-2 rounded-md hover:bg-gray-300">
          📤 Selecionar Arquivo
        </button>
        <p v-if="form.arquivo" class="text-sm text-gray-600 mt-2">{{ form.arquivo.name }}</p>
        <p v-if="errors.arquivo" class="text-red-500 text-sm">{{ errors.arquivo }}</p>
      </div>

      <button type="submit" class="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
        Cadastrar
      </button>
    </form>
  </div>
</template>
