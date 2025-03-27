<script setup>
import { ref } from "vue";

// Função para substituir vírgula por ponto
const formatNumber = (value) => {
  return value ? value.replace(',', '.') : '';
};

// Definição do formulário
const form = ref({
  nomeFazenda: "",
  cultura: "",
  produtividade: "",
  area: "",
  tipoSolo: "",
  cidade: "",
  estado: "",
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
const statusOptions = ref(["Aprovado", "Reprovado", "Pendente"]);

// Mensagens de erro
const errors = ref({});

// Input de arquivo
const fileInput = ref(null);

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
  if (!form.value.arquivo) errors.value.arquivo = "É necessário fazer upload de um arquivo JSON.";

  // Validação do arquivo (deve ser JSON)
  if (form.value.arquivo && form.value.arquivo.type !== "application/json") {
    errors.value.arquivo = "Formato de arquivo inválido. Apenas JSON é permitido.";
  }

  return Object.keys(errors.value).length === 0;
};

// Função para capturar o arquivo
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.value.arquivo = file;
  } else {
    console.warn("Nenhum arquivo selecionado.");
  }
};

// Função de validação por campo
const validateField = (field, value) => {
  if (field === 'produtividade' || field === 'area') {
    // Validar apenas se for número
    if (isNaN(value) || value <= 0) {
      errors.value[field] = "Digite um número válido.";
    } else {
      errors.value[field] = null;
    }
  } else if (field === 'nomeFazenda' || field === 'cultura' || field === 'tipoSolo' || field === 'cidade') {
    // Para campos de string, apenas verificar se está vazio
    if (!value) {
      errors.value[field] = "Campo obrigatório.";
    } else {
      errors.value[field] = null;
    }
  }
};

// Função para limpar o formulário
const resetForm = () => {
  form.value = {
    nomeFazenda: "",
    cultura: "",
    produtividade: "",
    area: "",
    tipoSolo: "",
    cidade: "",
    estado: "",
    status: "",
    arquivo: null,
  };
  fileInput.value.value = null;  // Limpa o input de arquivo
};

// Submissão do formulário
const submitForm = () => {
  if (!validateForm()) {
    return; // Não faz nada se houver erro
  }

  console.log("Dados do formulário:", form.value);
  alert("Cadastro enviado com sucesso!");

  // Limpa o formulário após a submissão
  resetForm();
};

// Função chamada quando o campo perde o foco
const handleBlur = (field) => {
  if (!form.value[field]) {
    errors.value[field] = null;
  }
};

// Função para remover o arquivo carregado
const removeFile = () => {
  form.value.arquivo = null;
  fileInput.value.value = null;  // Limpa o input de arquivo
};
</script>

<template>
  <div class="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl mx-auto">
    <h2 class="text-2xl font-semibold text-center mb-6">Cadastro de Área Agrícola</h2>

    <form @submit.prevent="submitForm" class="space-y-4">
      <div v-for="(label, field) in {
        nomeFazenda: 'Nome da Fazenda', cultura: 'Cultura',
        produtividade: 'Produtividade Anual', area: 'Área',
        tipoSolo: 'Tipo de Solo', cidade: 'Cidade'
      }" :key="field">
        <label class="block text-gray-700">{{ label }}</label>
        <input v-model="form[field]" type="text"
               class="w-full p-2 border border-gray-300 rounded-md"
               :placeholder="label"
               :class="{ 'border-red-500': errors[field] }"
               @input="form[field] = formatNumber(form[field]); validateField(field, form[field])"
               @blur="handleBlur(field)" />
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
        <label class="block text-gray-700">Upload do Arquivo JSON</label>
        <input type="file" ref="fileInput" class="hidden" @change="handleFileUpload" accept=".json" />
        <button type="button" @click="fileInput?.click()" class="mt-2 bg-gray-200 p-2 rounded-md hover:bg-gray-300">
          📤 Selecionar Arquivo
        </button>
        <p v-if="form.arquivo" class="text-sm text-gray-600 mt-2">
          {{ form.arquivo.name }}
          <button type="button" @click="removeFile" class="text-red-500 text-sm ml-2">Remover</button>
        </p>
        <p v-if="errors.arquivo" class="text-red-500 text-sm">{{ errors.arquivo }}</p>
        <p class="text-sm text-gray-600 mt-2">Apenas arquivos .json são permitidos.</p> <!-- Texto informativo -->
      </div>

      <button type="submit" class="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
        Cadastrar
      </button>
    </form>
  </div>
</template>
