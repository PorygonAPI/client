<template>
  <div class="bg-white shadow-md rounded-lg p-4 my-4 w-full max-w-lg mx-auto z-0">
    <form>
      <div class="mb-3">
        <RouterLink to="/areasagro">&larr;</RouterLink>
        <p class="text-center text-3xl font-semibold text-gray-800">
          {{ isEditing ? 'Editar Fazenda' : 'Cadastrar Fazenda' }}
        </p>
      </div>

      <Divider type="solid" class="mb-5" />

      <FloatLabel variant="on" class="mb-3">
        <InputText type="text" id="nome_fazenda" class="w-full p-1.5" v-model="nomeFazenda" />
        <label for="nome_fazenda">Nome da Fazenda</label>
      </FloatLabel>

      <div class="flex w-full gap-1.5">
        <span class="w-1/2">
          <FloatLabel variant="on">
            <Select
              editable
              id="estado"
              class="w-full rounded shadow p-1.5 z-0"
              v-model="estadoSelecionado"
              :options="estados"
              optionLabel="nome"
              optionValue="sigla"
            />
            <label for="estado">Estado</label>
          </FloatLabel>
        </span>

        <span class="w-1/2">
          <FloatLabel variant="on">
            <Select
              editable
              id="cidade"
              class="w-full rounded shadow p-1.5 z-0"
              v-model="cidadeSelecionada"
              :options="cidades"
              optionLabel="nome"
              optionValue="nome"
              :disabled="!estadoSelecionado"
            />
            <label for="cidade">Cidade</label>
          </FloatLabel>
        </span>
      </div>

      <div v-if="!isEditing" class="flex mt-4 gap-1.5 w-full">
        <div class="w-1/2 border border-gray-300 rounded-md p-3 flex flex-col items-center justify-center text-center">
          <p class="text-xs mb-0.5">Upload - Arquivo GeoJSON de Saída</p>
          <input
            ref="geojsonInput"
            type="file"
            accept=".geojson"
            class="hidden"
            @change="handleGeoJSONUpload"
          />
          <button
            type="button"
            class="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded w-full cursor-pointer"
            @click="triggerGeoJSONUpload"
          >
            {{ geojsonFile ? 'Trocar Arquivo' : 'Selecionar Arquivo' }}
          </button>
          <div v-if="geojsonFile" class="mt-2 relative w-full">
            <p class="text-sm text-gray-700 truncate w-full">{{ geojsonFile.name }}</p>
            <button
              type="button"
              class="absolute top-0 right-0 text-red-500 text-lg font-bold"
              @click="removeGeoJSON"
            >
              ×
            </button>
          </div>
        </div>

        <div class="w-1/2 border border-gray-300 rounded-md p-3 flex flex-col items-center justify-center text-center">
          <p class="text-xs mb-0.5">Upload - Mapa de Classif. Automática</p>
          <input
            ref="imageInput"
            type="file"
            accept=".geojson"
            class="hidden"
            @change="handleImageUpload"
          />
          <button
            type="button"
            class="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded w-full cursor-pointer"
            @click="triggerImageUpload"
          >
            {{ imageFile ? 'Trocar Arquivo' : 'Selecionar Arquivo' }}
          </button>
          <div v-if="imageFile" class="mt-2 relative w-full">
            <p class="text-sm text-gray-700 truncate w-full">{{ imageFile.name }}</p>
            <button
              type="button"
              class="absolute top-0 right-0 text-red-500 text-lg font-bold"
              @click="removeImage"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <div class="flex justify-center mt-6">
        <button
          type="button"
          class="bg-orange-400 text-white rounded shadow hover:bg-orange-300 transition px-6 py-2"
          @click="cadastrarOuAtualizarFazenda"
        >
        {{ isEditing ? 'Salvar Alterações' : 'Cadastrar Fazenda' }}
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
        arquivoFazenda:geojsonFile.value
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

</script>
