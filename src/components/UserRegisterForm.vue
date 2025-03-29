<template>
  <Toast />
  <div class="register-container">
    <div class="register-card">
      <div class="card-header">
        <button class="back-button" type="button" @click="retornar">
          <span>&larr;</span>
        </button>
        <h2>Cadastro de Usuário</h2>
      </div>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="fullName">Nome completo:</label>
          <input type="text" id="fullName" v-model="formData.nome" required />
        </div>

        <div class="form-group">
          <label for="email">E-mail:</label>
          <input type="email" id="email" v-model="formData.email" required />
        </div>

        <div v-if="flagSenha" class="form-group">
          <label for="password">Senha:</label>
          <input type="password" id="password" v-model="formData.senha" required />
        </div>

        <div class="form-group">
          <label for="role">Cargo:</label>
          <select id="role" v-model="formData.cargoId" required>
            <option value="" disabled selected>Selecione um cargo</option>
            <option value="1" > Consultor</option>
            <option value="2"> Analista</option>
            <option value="3"> Administrador</option>
          </select>
        </div>

        <div class="button-container">
          <button type="submit" class="register-button"> {{btnLabel}}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { useToast } from "primevue/usetoast";
import Toast from 'primevue/toast';
import { ref } from 'vue';

const TOKEN =  localStorage.getItem('token')

export default {
  name: 'UserRegisterForm',
  components:{
    Toast,
  },
  data() {
    return {
      formData: {
        nome: '',
        email: '',
        senha: '',
        cargoId: ''
      },
      flagSenha: ref(true),
      btnLabel: 'Cadastrar'
    }
  },
  mounted(){
  
    const fetchData = async () => {
      try {
        const response = await fetch('api/usuarios/' + this.$route.query.id , {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ TOKEN
          }
        });
        this.formData = await response.json();
      } catch (error) {
        error.value = 'Erro ao carregar os dados';
      } 
    };

    if (this.$route.query.id > 0)
    {
      fetchData()
      this.flagSenha = false
      this.btnLabel = 'Editar'
    }

    this.$toast = useToast();

  },
  methods: {
    retornar()
    {
      this.$router.push('/usuario')
    },

    showToast(strSeverity,strMensagem) 
   {
    this.$toast.add({ severity: strSeverity, summary: 'Informando:', detail: strMensagem, life: 5000 })
   },

    handleRegister() {
      console.log('Form data submitted:', this.formData)

      if (this.$route.query.id > 0)
    {
      this.alterarUsuario()
    }
    else
    {
      this.inserirUsuario()
    }
    },

    async inserirUsuario()
   {
      try {
        const response = await fetch('/api/usuarios', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ TOKEN,
            'Access-Control-Allow-Origin': '*',
            'origin':'*'
          },
          method: 'POST',
          body: JSON.stringify(this.formData)
        }).then((response) => {
          this.showToast('success', 'Cadastro realizado com sucesso')
        }).catch((response) => {
          this.showToast('error','Erro ao cadastrar os dados')
        })
        
      } catch (error) {
        error.value = 'Erro ao cadastrar os dados';
      } 
   },
   async alterarUsuario()
   {
      try {
        const response = await fetch('/api/usuarios/' + this.$route.query.id, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ TOKEN,
            'Access-Control-Allow-Origin': '*',
            'origin':'*'
          },
          method: 'PUT',
          body: JSON.stringify(this.formData)
        }).then((response) => {
          this.showToast('success', 'Atualização realizada com sucesso')
        }).catch((response) => {
          this.showToast('error','Erro ao atualizar os dados')
        })
      } catch (error) {
        error.value = 'Erro ao atualizar os dados';
      } 
   }
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 1rem;
  background-color: white;
}

.register-card {
  background-color: white;
  border-radius: 0;
  box-shadow: none;
  padding: 2rem;
  width: 100%;
  max-width: 600px;
}

.card-header {
  position: relative;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.back-button {
  position: absolute;
  left: 0;
  top: 0;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #555;
  padding: 0;
}

.register-card h2 {
  text-align: center;
  margin-bottom: 1rem;
  color: #333;
  font-size: 1.8rem;
}

.form-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #555;
  width: 100%;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #333;
  border-radius: 4px;
  font-size: 1rem;
  height: 40px;
  box-sizing: border-box;
}

.form-group select {
  background-color: white;
}

.button-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.register-button {
  width: 25%;
  padding: 0.8rem;
  background-color: #777777;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.register-button:hover {
  background-color: #555555;
}
</style>
