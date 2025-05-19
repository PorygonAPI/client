<script setup>
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Toast from 'primevue/toast'
import Titulo from '@/components/Titulo.vue'
import Botao from '@/components/Botao.vue'

const toast = useToast()

const usuarios = ref([])
const search = ref("")
const error = ref(null)

const TOKEN = localStorage.getItem('token')

const fetchData = async () => {
  try {
    const response = await fetch('/api/usuarios', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + TOKEN
      }
    })
    const data = await response.json()
    usuarios.value = data
  } catch (err) {
    error.value = 'Erro ao carregar os dados'
    showToast('error', error.value)
  }
}

const deleteUsuario = async (id) => {
  try {
    const response = await fetch('/api/usuarios/' + id, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + TOKEN
      }
    })

    if (!response.ok) throw new Error('Erro ao excluir registro')

    usuarios.value = usuarios.value.filter(user => user.id !== id)
    showToast('success', 'Exclusão realizada com sucesso')
  } catch (err) {
    showToast('error', 'Erro ao excluir registro')
  }
}

const cadastrarOuEditarUsuario = (id) => {
  window.location.href = `/cadastroUsuario?id=${id}`
}

const showToast = (severity, message) => {
  toast.add({ severity, summary: 'Informando:', detail: message, life: 5000 })
}

const filteredUsuarios = computed(() => {
  if (!search.value) return usuarios.value
  return usuarios.value.filter(user =>
    user.nome.toLowerCase().includes(search.value.toLowerCase()) ||
    user.cargoNome.toLowerCase().includes(search.value.toLowerCase())
  )
})

onMounted(() => {
  fetchData()
})
</script>

<template>
  <Toast />


  <div class="h-full w-[90%] mx-auto">
    <div class="flex flex-col">
      <Titulo title="Gerenciamento de Usuários" @update:search="search = $event" />
      <div class="p-5 py-3 bg-white rounded-xl shadow">
        <div class="flex items-center lg:justify-between gap-5 mb-2">
          <div
            class="flex gap-2 items-center border border-gray-300 rounded-lg w-44 lg:w-96 p-1 focus-within:ring focus-within:ring-orange-200">
            <input v-model="search" type="text" placeholder="Pesquisar"
              class="w-full outline-none bg-transparent ml-1" />
          </div>

          <div class="lg:my-0 flex justify-center lg:justify-start">
            <Botao label="Cadastrar Usuário" @click="cadastrarOuEditarUsuario(0)" tipo="primario">Cadastrar Usuário</Botao>
          </div>
        </div>


        <DataTable :value="filteredUsuarios" removableSort paginator :rows="15" stripedRows
          class="p-datatable-gridlines">
          <Column field="nome" header="Nome" sortable class="text-center p-1 col-span-2 w-1/3 lg:w-3/5">
            <template #body="slotProps">
              <span class="text-gray-700 font-medium flex justify-start lg:pl-1">{{ slotProps.data.nome }}</span>
            </template>
          </Column>

          <Column field="cargoNome" header="Cargo" sortable class="text-center p-1 lg:w-1/5">
            <template #body="slotProps">
              <span class="text-gray-600 flex justify-start px-0.5 lg:pl-1">{{ slotProps.data.cargoNome }}</span>
            </template>
          </Column>

          <Column class="p-1" header="Ações">
            <template #body="slotProps">
              <div class="flex justify-center lg:gap-2">
                <Botao @click="cadastrarOuEditarUsuario(slotProps.data.id)" tipo="primario">Editar</Botao>

                <Botao @click="deleteUsuario(slotProps.data.id)" tipo="exclusao">Excluir</Botao>
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>
