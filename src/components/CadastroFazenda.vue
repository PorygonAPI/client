<template>
  <div class="bg-white shadow-md rounded-lg p-4 my-4 w-full max-w-lg mx-auto z-0">
    <form>
      <div class="mb-3">
        <RouterLink to="/home">&larr;</RouterLink>
        <p class="text-center text-3xl font-semibold text-gray-800">Cadastro de Fazendas</p>
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
              id="estado"
              class="w-full rounded shadow p-1.5 z-0"
              v-model="estadoSelecionado"
              :options="estados"
              optionLabel="nome"
              optionValue="id"
            />
            <label for="estado">Estado</label>
          </FloatLabel>
        </span>

        <span class="w-1/2">
          <FloatLabel variant="on">
            <Select
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

      <div class="flex mt-4 gap-1.5 w-full">
        <div class="w-1/2 border border-gray-300 rounded-md p-3 flex flex-col items-center justify-center text-center">
          <input
            ref="geojsonInput"
            type="file"
            accept=".geojson"
            class="hidden"
            @change="handleGeoJSONUpload"
          />
          <button
            type="button"
            class="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded w-full"
            @click="triggerGeoJSONUpload"
          >
            {{ geojsonFile ? 'Trocar Arquivo' : 'Selecionar GeoJSON' }}
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
          <input
            ref="imageInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleImageUpload"
          />
          <button
            type="button"
            class="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded w-full"
            @click="triggerImageUpload"
          >
            {{ imageFile ? 'Trocar Imagem' : 'Selecionar Imagem' }}
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
          @click="cadastrarFazenda"
        >
          Cadastrar Fazenda
        </button>
      </div>
    </form>
  </div>

  <Toast />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { FloatLabel, InputText, Divider, Select, Toast, RadioButton} from 'primevue';
import { useToast } from 'primevue/usetoast';

const geojsonInput = ref(null);
const imageInput = ref(null);
const geojsonFile = ref(null);
const imageFile = ref(null);

const toast = useToast();

const estados = ref([]);
const cidades = ref([]);
const estadoSelecionado = ref('');
const cidadeSelecionada = ref('');
const nomeFazenda = ref(''); 
const statusFazenda = ref(true);

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
    estados.value = data.sort((a, b) => a.nome.localeCompare(b.nome));
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao buscar estados.', life: 3000 });
  }
};

const fetchCidades = async (ufId) => {
  try {
    const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufId}/municipios`);
    const data = await response.json();
    cidades.value = data.sort((a, b) => a.nome.localeCompare(b.nome));
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao buscar cidades.', life: 3000 });
  }
};

watch(estadoSelecionado, (newEstado) => {
  if (newEstado) {
    fetchCidades(newEstado);
    cidadeSelecionada.value = '';
  }
});

onMounted(() => {
  fetchEstados();
});

const cadastrarFazenda = () => {
  if (!geojsonFile.value || !imageFile.value || !estadoSelecionado.value || !cidadeSelecionada.value || !geojsonFile.value.name || !imageFile.value.name) {
    toast.add({ severity: 'error', summary: 'Erro', detail: 'Por favor, preencha todos os campos antes de cadastrar.', life: 3000 });
    return;
  }

  toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Fazenda cadastrada!', life: 3000 });
};

</script>