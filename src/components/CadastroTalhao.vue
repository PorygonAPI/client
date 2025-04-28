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
          disabled
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
import { useRoute, useRouter } from 'vue-router';

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

const retornoPagina = () =>{
  router.push({path:"/areasagro"})
}

const fetchPreenchimento = async (fazendaId, talhaoId) => {
  try {
    const response = await fetch(`/api/areas-agricolas/${fazendaId}/detalhes-completos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const data = await response.json();

    if (!data || !data.talhao) {
      console.error('Dados da fazenda não encontrados.');
      return;
    }

    const talhao = data.talhao.find(t => t.id === Number(talhaoId));
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

    console.log(fazendaSelecionada)
  } catch (error) {
    console.error('Erro ao buscar detalhes do talhão:', error);
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar detalhes.', life: 3000 });
  }
};

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

onMounted(() => {
  fetchFazendas();

  console.log(fazendaId)
  if (fazendaId && talhaoId) {
    fetchPreenchimento(fazendaId, talhaoId);
    console.log(produtividadePorAno)
  } else {
    console.error('FazendaId ou TalhaoId não encontrados na URL.');
  }
});

const cadastrarTalhao = async () => {
  if (!fazendaSelecionada.value || !talhao.value || !cultura.value || !produtividadePorAno.value || !ano.value || !tipoSolo.value || !area.value) {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Por favor, preencha todos os campos.', life: 3000 });
    return;
  }



  try{
    const fetchData = {
      idTalhao: talhaoId,
      anoSafra: ano.value,
      culturaNome: cultura.value,
      produtividadeAno: produtividadePorAno.value,
      tipoSoloNome: tipoSolo.value,
      area: area.value
    };
    await fetch(`/api/safras/${talhaoId}/atualizar`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(fetchData)
    });
    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Talhão cadastrado!', life: 3000 });
    retornoPagina();
  }catch (error) {
    console.log(error);
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao cadastrar talhão.', life: 3000 });
    return;
  }
};
</script>

