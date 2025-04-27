<template>
  <div class="bg-white shadow-md rounded-lg p-4 my-4 w-full max-w-lg mx-auto z-0">
    <form>
      <div class="mb-3">
        <RouterLink to="/areasagro">&larr;</RouterLink>
        <p class="text-center text-3xl font-semibold text-gray-800">Edição de Talhão</p>
      </div>

      <Divider type="solid" class="mb-5" />

      <FloatLabel variant="on" class="mb-3">
        <Select
          editable
          id="fazenda"
          class="p-dropdown-item w-full rounded shadow p-1.5"
          v-model="fazendaSelecionada"
          :options="fazendas"
          optionLabel="nomeFazenda"
          optionValue="id"
        />
        <label for="fazenda">Fazenda</label>
      </FloatLabel>

      <div class="flex gap-4 mb-3">
        <FloatLabel variant="on" class="w-1/2">
          <InputText type="number" id="talhao" class="w-full p-1.5" v-model="safra" />
          <label for="talhao">Safra</label>
        </FloatLabel>
        <FloatLabel variant="on" class="w-1/2">
          <InputText type="text" id="cultura" class="w-full p-1.5" v-model="cultura" />
          <label for="cultura">Cultura</label>
        </FloatLabel>
      </div>

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

      <div class="flex justify-center mt-6">
        <button
          type="button"
          class="cursor-pointer bg-orange-400 text-white rounded shadow hover:bg-orange-300 transition px-6 py-2"
          @click="cadastrarTalhao"
        >
          Salvar alterações
        </button>
      </div>
    </form>
  </div>

  <Toast />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { FloatLabel, InputText, Divider, Select, Toast } from 'primevue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const fazendas = ref([]);
const fazendaSelecionada = ref('');
const safra = ref('');
const cultura = ref('');
const produtividadePorAno = ref('');
const ano = ref('');
const tipoSolo = ref('');
const area = ref('');

const fetchTalhoes = async (fazendaId) => {
  try {
    const response = await fetch(`/api/areas-agricolas/${fazendaId}/detalhes-completos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await response.json();
    console.log(data)
    // toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Talhões carregados!', life: 3000 });
  } catch (error) {
    console.error('Erro ao buscar talhões:', error);
    // toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar talhões.', life: 3000 });
  }
};

watch(fazendaSelecionada, (newFazendaId) => {
  if (newFazendaId) {
    fetchTalhoes(newFazendaId);
  }
});

const fetchFazendas = async () => {
  await fetch('/api/areas-agricolas', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      fazendas.value = data;
    })
    .catch((error) => {
      console.error('Erro ao buscar fazendas:', error);
      toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar fazendas.', life: 3000 });
    });
};

const fetchSafras = async () => {
  await fetch('/api/safras', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      /**TODO
       * Implementar lógica para lidar com as safras
       * Exibir as safras em um dropdown ou lista
       */
      console.log(data);
    })
    .catch((error) => {
      console.error('Erro ao buscar fazendas:', error);
      toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar fazendas.', life: 3000 });
    });
};

onMounted(() => {
  fetchFazendas();
  fetchSafras();
});

const cadastrarTalhao = async () => {
  if (!fazendaSelecionada.value || !talhao.value || !cultura.value || !produtividadePorAno.value || !ano.value || !tipoSolo.value || !area.value) {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Por favor, preencha todos os campos.', life: 3000 });
    return;
  }

  try{
    const fetchData = {
      area: area.value,
      areaAgricola: fazendaSelecionada.value,
      tipoSoloNome: tipoSolo.value,
      ano: ano.value,
      produtividadeAno: produtividadePorAno.value,
      status: 'Pendente',
      culturaNome: cultura.value,
    };
    await fetch('/api/talhoes', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(fetchData)
    });
    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Talhão cadastrado!', life: 3000 });
    fazendaSelecionada.value = '';
    talhao.value = '';
    cultura.value = '';
    produtividadePorAno.value = '';
    ano.value = '';
    tipoSolo.value = '';
    area.value = '';
  }catch (error) {
    console.log(error);
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao cadastrar talhão.', life: 3000 });
    return;
  }
};
</script>

