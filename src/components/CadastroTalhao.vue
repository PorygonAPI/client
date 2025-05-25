<template>
  <div class="bg-white shadow-lg rounded-xl p-6 my-6 max-w-lg mx-auto z-0
           flex flex-col mt-23">
    <header class="mb-6 flex items-center gap-4">
      <div class="flex items-start gap-3">
        <i @click="voltar" class="pi pi-angle-left text-3xl text-gray-600 cursor-pointer hover:text-gray-800 transition"
          aria-label="Voltar" role="button" tabindex="0" @keyup.enter="voltar" />
        <h1 class="text-2xl font-semibold text-gray-800">Edição de Talhão</h1>
      </div>
    </header>
    <br>
    <form @submit.prevent="cadastrarTalhao" class="space-y-6">
      <FloatLabel variant="on" class="w-full">
        <Select disabled editable id="fazenda" v-model="fazendaSelecionada" :options="fazendas"
          optionLabel="nomeFazenda" optionValue="id" class="w-full rounded-md shadow-sm p-2" />
        <label for="fazenda">Fazenda</label>
      </FloatLabel>

      <div class="grid grid-cols-2 gap-6">
        <FloatLabel variant="on">
          <InputText type="text" id="talhao" v-model="safra" class="w-full p-2 rounded-md border border-gray-300" />
          <label for="talhao">Safra</label>
        </FloatLabel>

        <FloatLabel variant="on">
          <InputText type="text" id="cultura" v-model="cultura" class="w-full p-2 rounded-md border border-gray-300" />
          <label for="cultura">Cultura</label>
        </FloatLabel>

        <FloatLabel variant="on">
          <InputText type="number" id="produtividade" v-model="produtividadePorAno"
            class="w-full p-2 rounded-md border border-gray-300" />
          <label for="produtividade">Produtividade por Ano</label>
        </FloatLabel>

        <FloatLabel variant="on">
          <InputText type="number" id="ano" v-model="ano" class="w-full p-2 rounded-md border border-gray-300" />
          <label for="ano">Ano</label>
        </FloatLabel>

        <FloatLabel variant="on">
          <InputText type="text" id="solo" v-model="tipoSolo" class="w-full p-2 rounded-md border border-gray-300" />
          <label for="solo">Tipo de Solo</label>
        </FloatLabel>

        <FloatLabel variant="on">
          <InputText type="number" id="area" v-model="area" class="w-full p-2 rounded-md border border-gray-300" />
          <label for="area">Área</label>
        </FloatLabel>
      </div>

      <div class="flex justify-center mt-4">
        <Botao type="submit" tipo="primario">Salvar</Botao>
      </div>
    </form>
  </div>

  <Toast />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { FloatLabel, InputText, Divider, Select, Toast } from 'primevue';
import { useToast } from 'primevue/usetoast';
import { useRoute, useRouter } from 'vue-router';
import Botao from './Botao.vue';

const voltar = () => {
  router.push('/areasagro');
};

const route = useRoute();
const router = useRouter();
const toast = useToast();

const fazendaId = Number(route.query.idFazenda);
const talhaoId = Number(route.query.id);

const fazendas = ref([]);
const fazendaSelecionada = ref('');
const safra = ref('');
const cultura = ref('');
const produtividadePorAno = ref('');
const ano = ref('');
const tipoSolo = ref('');
const area = ref('');

const retornoPagina = () => {
  router.push({ path: '/areasagro' });
};

const fetchPreenchimento = async (fazendaId, talhaoId) => {
  try {
    const response = await fetch(
      `/api/areas-agricolas/${fazendaId}/detalhes-completos`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    const data = await response.json();

    if (!data || !data.talhao) {
      console.error('Dados da fazenda não encontrados.');
      return;
    }

    const talhao = data.talhao.find((t) => t.id === Number(talhaoId));
    if (!talhao) {
      console.error('Talhão não encontrado.');
      return;
    }

    const primeiraSafra = talhao.safras[0];

    if (!primeiraSafra) {
      console.error('Nenhuma safra encontrada no talhão.');
      return;
    }

    fazendaSelecionada.value = fazendaId;
    safra.value = primeiraSafra.id;
    cultura.value = primeiraSafra.cultura;
    produtividadePorAno.value = primeiraSafra.produtividadeAno || 0;
    ano.value = primeiraSafra.ano;
    tipoSolo.value = talhao.tipoSolo;
    area.value = talhao.area;

    console.log('Preenchimento realizado com sucesso.');
  } catch (error) {
    console.error('Erro ao buscar detalhes do talhão:', error);
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao buscar detalhes.',
      life: 3000,
    });
  }
};

const fetchFazendas = async () => {
  try {
    const response = await fetch('/api/areas-agricolas', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await response.json();
    fazendas.value = data;
  } catch (error) {
    console.error('Erro ao buscar fazendas:', error);
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao buscar fazendas.',
      life: 3000,
    });
  }
};

onMounted(() => {
  fetchFazendas();

  if (fazendaId && talhaoId) {
    fetchPreenchimento(fazendaId, talhaoId);
  } else {
    console.error('FazendaId ou TalhaoId não encontrados na URL.');
  }
});

const cadastrarTalhao = async () => {
  if (!validarCampos()) return;

  try {
    const formData = new FormData();
    formData.append('idTalhao', talhaoId || '');
    formData.append('anoSafra', ano.value);
    formData.append('culturaNome', cultura.value);
    formData.append('produtividadeAno', produtividadePorAno.value);
    formData.append('tipoSoloNome', tipoSolo.value);
    formData.append('area', area.value);

    if (imagemDaninha.value instanceof File) {
      formData.append('arquivoDaninha', imagemDaninha.value);
    }

    const response = await fetch('/api/talhoes', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });

    if (!response.ok) throw new Error('Erro ao cadastrar talhão');

    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Talhão cadastrado!',
      life: 3000,
    });
    retornoPagina();
  } catch (error) {
    console.error(error);
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Falha ao cadastrar talhão.',
      life: 3000,
    });
  }
};
</script>
