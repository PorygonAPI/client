<template>
  <div class="bg-white shadow-xl rounded-2xl p-6 my-6 w-full max-w-2xl mx-auto mt-23">
    <form>
      <div class="mb-6 flex items-center gap-2">
        <div class="flex items-start gap-3">
          <i @click="voltar"
            class="pi pi-angle-left text-3xl text-gray-600 cursor-pointer hover:text-gray-800 transition" />
          <h1 class="text-2xl font-semibold text-gray-800">Cadastrar Fazenda</h1>
        </div>
      </div>
      <br>

      <FloatLabel variant="on" class="mb-5">
        <InputText type="text" id="nome_fazenda" class="w-full p-2 text-base rounded-md" v-model="nomeFazenda" />
        <label for="nome_fazenda">Nome da Fazenda</label>
      </FloatLabel>

      <div class="flex flex-col md:flex-row gap-4">
        <FloatLabel variant="on" class="flex-1">
          <Select editable id="estado" class="w-full p-2 rounded-md shadow-sm" v-model="estadoSelecionado"
            :options="estados" optionLabel="nome" optionValue="sigla" />
          <label for="estado">Estado</label>
        </FloatLabel>

        <FloatLabel variant="on" class="flex-1">
          <Select editable id="cidade" class="w-full p-2 rounded-md shadow-sm" v-model="cidadeSelecionada"
            :options="cidades" optionLabel="nome" optionValue="nome" :disabled="!estadoSelecionado" />
          <label for="cidade">Cidade</label>
        </FloatLabel>
      </div>

      <div v-if="!isEditing" class="flex flex-col md:flex-row gap-4 mt-6">
        <div class="flex-1 border border-gray-200 rounded-xl p-4 text-center bg-gray-50">
          <p class="text-sm text-gray-600 mb-2">Upload - GeoJSON de Saída</p>
          <input ref="geojsonInput" type="file" accept=".geojson" class="hidden" @change="handleGeoJSONUpload" />
          <Botao type="button"
            @click="triggerGeoJSONUpload">
            {{ geojsonFile ? 'Trocar Arquivo' : 'Selecionar Arquivo' }}
          </Botao>
          <div v-if="geojsonFile" class="mt-2 relative">
            <p class="text-sm text-gray-700 truncate">{{ geojsonFile.name }}</p>
            <button type="button" class="absolute top-0 right-0 text-red-500 font-bold" @click="removeGeoJSON">
              ×
            </button>
          </div>
        </div>

        <div class="flex-1 border border-gray-200 rounded-xl p-4 text-center bg-gray-50">
          <p class="text-sm text-gray-600 mb-2">Upload - Mapa Classificação Automática</p>
          <input ref="imageInput" type="file" accept=".geojson" class="hidden" @change="handleImageUpload" />
          <Botao type="button"
            @click="triggerImageUpload">
            {{ imageFile ? 'Trocar Arquivo' : 'Selecionar Arquivo' }}
          </Botao>
          <div v-if="imageFile" class="mt-2 relative">
            <p class="text-sm text-gray-700 truncate">{{ imageFile.name }}</p>
            <button type="button" class="absolute top-0 right-0 text-red-500 font-bold" @click="removeImage">
              ×
            </button>
          </div>
        </div>
      </div>

      <div class="flex justify-center mt-8">
        <Botao type="button"
            @click="cadastrarOuAtualizarFazenda">
            {{ isEditing ? 'Salvar Alterações' : 'Cadastrar Fazenda' }}
          </Botao>
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
import Botao from './Botao.vue';

const route = useRoute()
const router = useRouter()
const id = route.query.id;
const isEditing = ref(false);

const geojsonInput = ref(null);
const imageInput = ref(null);
const geojsonFile = ref(null);
const imageFile = ref(null);

const toast = useToast();
const TOKEN = localStorage.getItem('token');

const estados = ref([]);
const cidades = ref([]);
const estadoSelecionado = ref('');
const cidadeSelecionada = ref('');
const nomeFazenda = ref('');
const statusFazenda = ref('Pendente');

const triggerGeoJSONUpload = () => {
  geojsonInput.value.click();
};

const handleGeoJSONUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    geojsonFile.value = file;
    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'GeoJSON carregado!', life: 3000 });
  } else {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar GeoJSON.', life: 3000 });
  }
};

const removeGeoJSON = () => {
  geojsonFile.value = null;
  geojsonInput.value.value = '';
};

const triggerImageUpload = () => {
  imageInput.value.click();
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageFile.value = file;
    toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Imagem carregada!', life: 3000 });
  } else {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar imagem.', life: 3000 });
  }
};

const removeImage = () => {
  imageFile.value = null;
  imageInput.value.value = '';
};

const fetchEstados = async () => {
  try {
    const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
    const data = await response.json();
    estados.value = data
      .map(estado => ({ nome: estado.nome, sigla: estado.sigla }))
      .sort((a, b) => a.nome.localeCompare(b.nome));
  } catch (error) {
    console.error(error);
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao buscar estados.', life: 3000 });
  }
};

const fetchCidades = async (ufId) => {
  try {
    const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufId}/municipios`);
    const data = await response.json();
    cidades.value = data.sort((a, b) => a.nome.localeCompare(b.nome));
  } catch (error) {
    console.error(error);
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao buscar cidades.', life: 3000 });
  }
};

watch(estadoSelecionado, (newEstado) => {
  if (newEstado) {
    fetchCidades(newEstado);
    cidadeSelecionada.value = '';
  }
});

const fetchFazenda = async () => {
  try {
    const response = await fetch(`/api/areas-agricolas/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + TOKEN
      }
    });
    const data = await response.json();

    nomeFazenda.value = data.nomeFazenda;
    estadoSelecionado.value = data.estado;
    statusFazenda.value = data.status;
    geojsonFile.value = data.arquivoFazenda;
    isEditing.value = true;

    await fetchCidades(data.estado);

    cidadeSelecionada.value = data.cidadeNome;

  } catch (error) {
    console.error(error);
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao carregar fazenda.', life: 3000 });
  }
};

onMounted(() => {
  fetchEstados();
  if (id > 0) {
    fetchFazenda();
  }
});

const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

const cadastrarOuAtualizarFazenda = async () => {
  if (!geojsonFile.value || (!imageFile.value && !isEditing.value) || !estadoSelecionado.value || !cidadeSelecionada.value) {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Preencha todos os campos.', life: 3000 });
    return;
  }

  try {
    let fetchData = {};

    if (isEditing.value) {

      fetchData = {
        nomeFazenda: nomeFazenda.value,
        estado: estadoSelecionado.value,
        cidadeNome: cidadeSelecionada.value,
        status: statusFazenda.value,
        arquivoFazenda: geojsonFile.value
      };
    } else {
      const geojsonContent = await readFileAsText(geojsonFile.value);
      const imageContent = await readFileAsText(imageFile.value);
      fetchData = {
        nomeFazenda: nomeFazenda.value,
        estado: estadoSelecionado.value,
        cidadeNome: cidadeSelecionada.value,
        status: statusFazenda.value,
        arquivoFazenda: geojsonContent,
        arquivoErvaDaninha: imageContent
      };
    }

    if (isEditing.value) {
      await fetch(`/api/areas-agricolas/${id}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + TOKEN
        },
        body: JSON.stringify(fetchData)
      });
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Fazenda atualizada!', life: 3000 });
    } else {
      await fetch('/api/areas-agricolas', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + TOKEN
        },
        body: JSON.stringify(fetchData)
      });
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Fazenda cadastrada!', life: 3000 });
    }

    router.push('/areasagro');

  } catch (error) {
    console.error(error);
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao salvar fazenda.', life: 3000 });
  }
};

const voltar = () => {
  router.push('/areasagro'); // ou use router.back() para voltar à página anterior
};

</script>
