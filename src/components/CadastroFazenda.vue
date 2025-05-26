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
<input
  ref="geojsonInput"
  type="file"
  accept=".geojson,.json"
  class="hidden"
  @change="handleGeoJSONUpload"
/>
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
<input
  ref="imageInput"
  type="file"
  accept=".geojson,.json"
  class="hidden"
  @change="handleImageUpload"
/>
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
        <Botao
  type="button"
  @click="cadastrarOuAtualizarFazenda"
  :disabled="loading"
>
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

const compressGeoJson = async (geoJson) => {
  const compressed = pako.gzip(JSON.stringify(geoJson));
  return new Blob([compressed], { type: 'application/gzip' });
};

const handleGeoJSONUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      toast.add({ severity: 'info', summary: 'Processando', detail: 'Carregando arquivo...', life: 3000 });
      // Valida se é um JSON válido
      const text = await file.text();
      JSON.parse(text);
      geojsonFile.value = file;
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'GeoJSON carregado!', life: 3000 });
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      toast.add({ severity: 'error', summary: 'Erro', detail: 'Arquivo GeoJSON inválido', life: 3000 });
      geojsonFile.value = null;
      event.target.value = ''; // Limpa input
    }
  }
};

const removeGeoJSON = () => {
  geojsonFile.value = null;
  geojsonInput.value.value = '';
};

const triggerImageUpload = () => {
  imageInput.value.click();
};

const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      toast.add({ severity: 'info', summary: 'Processando', detail: 'Carregando arquivo...', life: 3000 });
      // Valida se é um JSON válido
      const text = await file.text();
      JSON.parse(text);
      imageFile.value = file;
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Arquivo carregado!', life: 3000 });
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      toast.add({ severity: 'error', summary: 'Erro', detail: 'Arquivo GeoJSON inválido', life: 3000 });
      imageFile.value = null;
      event.target.value = ''; // Limpa input
    }
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

// const readFileAsText = (file) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = (event) => resolve(event.target.result);
//     reader.onerror = (error) => reject(error);
//     reader.readAsText(file);
//   });
// };

const loading = ref(false);

const cadastrarOuAtualizarFazenda = async () => {
  try {
    if (loading.value) return;
    loading.value = true;

    // Validações iniciais
    if (!nomeFazenda.value?.trim()) {
      toast.add({ severity: 'error', summary: 'Erro', detail: 'Nome da fazenda é obrigatório', life: 3000 });
      loading.value = false;
      return;
    }

    if (!estadoSelecionado.value || !cidadeSelecionada.value) {
      toast.add({ severity: 'error', summary: 'Erro', detail: 'Estado e cidade são obrigatórios', life: 3000 });
      loading.value = false;
      return;
    }

    if (!isEditing.value && (!geojsonFile.value || !imageFile.value)) {
      toast.add({ severity: 'error', summary: 'Erro', detail: 'Os arquivos são obrigatórios', life: 3000 });
      loading.value = false;
      return;
    }

    const formData = new FormData();

    // Cria o objeto dados e adiciona ao FormData
    const dados = {
      nomeFazenda: nomeFazenda.value.trim(),
      estado: estadoSelecionado.value,
      cidadeNome: cidadeSelecionada.value,
    };

    // Adiciona o objeto dados como string JSON
    formData.append('dados', JSON.stringify(dados));

    // Adiciona os arquivos
    if (geojsonFile.value instanceof File) {
      formData.append('arquivoFazenda', geojsonFile.value);
    }

    if (imageFile.value instanceof File) {
      formData.append('arquivoErvaDaninha', imageFile.value);
    }

    // Para debug - verifica se todos os campos necessários estão presentes
    console.log('Campos no FormData:');
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    const response = await fetch(
      isEditing.value ? `/api/areas-agricolas/${id}` : '/api/areas-agricolas',
      {
        method: isEditing.value ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${TOKEN}`
        },
        body: formData
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Erro ${response.status}: ${response.statusText}`);
    }

    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: isEditing.value ? 'Fazenda atualizada!' : 'Fazenda cadastrada!',
      life: 3000
    });

    setTimeout(() => {
      router.push('/areasagro');
    }, 1000);

  } catch (error) {
    console.error('Erro ao salvar fazenda:', error);
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: error.message || 'Falha ao salvar fazenda.',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

const voltar = () => {
  router.push('/areasagro'); // ou use router.back() para voltar à página anterior
};

</script>
