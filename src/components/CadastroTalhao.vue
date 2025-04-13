<template>
  <div class="bg-white shadow-md rounded-lg p-4 my-4 w-full max-w-lg mx-auto z-0">
    <form>
      <div class="mb-3">
        <RouterLink to="/home">&larr;</RouterLink>
        <p class="text-center text-3xl font-semibold text-gray-800">Cadastro de Talhão</p>
      </div>

      <Divider type="solid" class="mb-5" />

      <FloatLabel variant="on" class="mb-3">
        <Select
          id="fazenda"
          class="w-full rounded shadow p-1.5"
          v-model="fazendaSelecionada"
          :options="fazendas"
          optionLabel="nome"
          optionValue="id"
        />
        <label for="fazenda">Fazenda</label>
      </FloatLabel>

      <!-- Talhão e Cultura lado a lado -->
      <div class="flex gap-4 mb-3">
        <FloatLabel variant="on" class="w-1/2">
          <InputText type="number" id="talhao" class="w-full p-1.5" v-model="talhao" />
          <label for="talhao">Número do Talhão</label>
        </FloatLabel>
        <FloatLabel variant="on" class="w-1/2">
          <InputText type="text" id="cultura" class="w-full p-1.5" v-model="cultura" />
          <label for="cultura">Cultura</label>
        </FloatLabel>
      </div>

      <!-- Produtividade por ano e Ano lado a lado -->
      <div class="flex gap-4 mb-3">
        <FloatLabel variant="on" class="w-1/2">
          <InputText type="number" id="produtividade" class="w-full p-1.5" v-model="produtividadePorAno" />
          <label for="produtividade">Produtividade por Ano</label>
        </FloatLabel>
        <FloatLabel variant="on" class="w-1/2">
          <InputText type="number" id="ano" class="w-full p-1.5" v-model="ano" />
          <label for="ano">Ano</label>
        </FloatLabel>
      </div>

      <!-- Tipo de Solo e Área lado a lado -->
      <div class="flex gap-4 mb-3">
        <FloatLabel variant="on" class="w-1/2">
          <InputText type="text" id="solo" class="w-full p-1.5" v-model="tipoSolo" />
          <label for="solo">Tipo de Solo</label>
        </FloatLabel>
        <FloatLabel variant="on" class="w-1/2">
          <InputText type="number" id="area" class="w-full p-1.5" v-model="area" />
          <label for="area">Área</label>
        </FloatLabel>
      </div>

      <div class="flex items-center gap-2 mt-6">
        <label class="font-semibold text-gray-700">Status:</label>
        <RadioButton
          v-model="statusFazenda"
          inputId="status-pendente"
          name="status"
          :value="true"
          disabled
        />
        <label for="status-pendente" class="ml-2 text-gray-700">Pendente</label>
      </div>

      <div class="flex justify-center mt-6">
        <button
          type="button"
          class="bg-orange-400 text-white rounded shadow hover:bg-orange-300 transition px-6 py-2"
          @click="cadastrarTalhao"
        >
          Cadastrar Talhão
        </button>
      </div>
    </form>
  </div>

  <Toast />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { FloatLabel, InputText, Divider, Select, Toast, RadioButton } from 'primevue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const fazendas = ref([]);
const fazendaSelecionada = ref('');
const talhao = ref('');
const cultura = ref('');
const produtividadePorAno = ref('');
const ano = ref('');
const tipoSolo = ref('');
const area = ref('');

const fetchFazendas = async () => {
  // Simulação - você pode trocar para buscar do seu backend depois
  fazendas.value = [
    { id: 1, nome: 'Fazenda São José' },
    { id: 2, nome: 'Fazenda Primavera' },
    { id: 3, nome: 'Fazenda Boa Vista' }
  ];
};

onMounted(() => {
  fetchFazendas();
});

const cadastrarTalhao = () => {
  if (!fazendaSelecionada.value || !talhao.value || !cultura.value || !produtividadePorAno.value || !ano.value || !tipoSolo.value || !area.value) {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Por favor, preencha todos os campos.', life: 3000 });
    return;
  }

  // Aqui poderia ser a chamada de API para salvar o talhão

  toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Talhão cadastrado!', life: 3000 });

  // Resetando o formulário depois de cadastrar
  fazendaSelecionada.value = '';
  talhao.value = '';
  cultura.value = '';
  produtividadePorAno.value = '';
  ano.value = '';
  tipoSolo.value = '';
  area.value = '';
};
</script>
