<template>
  <Toast />
  <div class="register-container">
    <div class="register-card">
      <div class="mb-6 flex items-center gap-2">
        <div class="flex items-start gap-3">
          <i @click="retornar"
            class="pi pi-angle-left text-3xl text-gray-600 cursor-pointer hover:text-gray-800 transition" />
          <h1 class="text-2xl font-semibold text-gray-800">Cadastrar Usuário </h1>
        </div>
      </div>
      <div class="card-header">
      </div>
      <form @submit.prevent="handleRegister" novalidate>
        <div class="form-group">
          <label for="fullName">Nome completo:</label>
          <input type="text" id="fullName" v-model="formData.nome" required autocomplete="name" />
        </div>

        <div class="form-group">
          <label for="email">E-mail:</label>
          <input type="email" id="email" v-model="formData.email" required autocomplete="email" />
        </div>

        <div v-if="flagSenha" class="form-group">
          <label for="password">Senha:</label>
          <input type="password" id="password" v-model="formData.senha" required autocomplete="new-password" />
        </div>

        <div class="form-group">
          <label for="role">Cargo:</label>
          <select id="role" v-model="formData.cargo" required>
            <option value="" disabled selected>Selecione um cargo</option>
            <option value="1">Consultor</option>
            <option value="2">Analista</option>
            <option value="3">Administrador</option>
          </select>
        </div>

        <div class="button-container">
          <button type="submit" class="register-button">{{ btnLabel }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useToast } from "primevue/usetoast";
import Toast from 'primevue/toast';
import { ref } from 'vue';
import Botao from "./Botao.vue";

const TOKEN = localStorage.getItem('token')

export default {
  name: 'UserRegisterForm',
  components: {
    Toast,
  },
  data() {
    return {
      formData: {
        nome: '',
        email: '',
        senha: '',
        cargo: ''
      },
      flagSenha: ref(true),
      btnLabel: 'Cadastrar'
    }
  },
  mounted() {
    const fetchData = async () => {
      try {
        const response = await fetch('api/usuarios/' + this.$route.query.id, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + TOKEN
          }
        });
        this.formData = await response.json();
      } catch (error) {
        // Pode exibir erro no toast ou log
        console.error('Erro ao carregar os dados', error);
      }
    };

    if (this.$route.query.id > 0) {
      fetchData();
      this.flagSenha = false;
      this.btnLabel = 'Editar';
    }

    this.$toast = useToast();
  },
  methods: {
    retornar() {
      this.$router.push('/usuario');
    },

    showToast(strSeverity, strMensagem) {
      this.$toast.add({ severity: strSeverity, summary: 'Informando:', detail: strMensagem, life: 5000 });
    },

    handleRegister() {
      if (this.$route.query.id > 0) {
        this.alterarUsuario();
      } else {
        this.inserirUsuario();
      }
    },

    async inserirUsuario() {
      try {
        const response = await fetch('/api/usuarios', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + TOKEN,
            'Access-Control-Allow-Origin': '*',
            'origin': '*'
          },
          method: 'POST',
          body: JSON.stringify(this.formData)
        });

        if (response.status == 200) {
          this.showToast('success', 'Cadastro realizado com sucesso');
          // Limpa formulário
          this.formData = { nome: '', email: '', senha: '', cargo: '' };
          // Volta para página anterior
          this.$router.push('/usuario');
        } else {
          this.showToast('error', 'Erro ao cadastrar os dados');
        }
      } catch (error) {
        this.showToast('error', 'Erro ao cadastrar os dados');
      }
    },

    async alterarUsuario() {
      try {
        const response = await fetch('/api/usuarios/' + this.$route.query.id, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + TOKEN,
            'Access-Control-Allow-Origin': '*',
            'origin': '*'
          },
          method: 'PUT',
          body: JSON.stringify(this.formData)
        });

        if (response.status == 200) {
          this.showToast('success', 'Atualização realizada com sucesso');
          this.$router.push('/usuario');
        } else {
          this.showToast('error', 'Erro ao atualizar os dados');
        }
      } catch (error) {
        this.showToast('error', 'Erro ao atualizar os dados');
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
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.register-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  padding: 2.5rem 3rem;
  width: 100%;
  max-width: 480px;
  transition: transform 0.3s ease;
  margin-top: 7rem;
}

.card-header {
  position: relative;
  margin-bottom: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.back-button {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  font-size: 1.6rem;
  cursor: pointer;
  color: #3b82f6;
  transition: color 0.2s ease;
}

.back-button:hover {
  color: #2563eb;
}

.register-card h2 {
  font-weight: 700;
  font-size: 2rem;
  color: #111827;
  margin: 0;
}

.form-group {
  margin-bottom: 1.8rem;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.6rem;
  font-size: 1rem;
}

.form-group input,
.form-group select {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1.8px solid #d1d5db;
  border-radius: 8px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  outline-offset: 2px;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
  outline: none;
  background: #fff;
}

.form-group select {
  background-color: #fff;
  appearance: none;
  cursor: pointer;
}

.button-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.register-button {
  width: 100%;
  max-width: 160px;
  padding: 0.85rem 0;
  font-weight: 700;
  font-size: 1.1rem;
  color: #fff;
  background-color: #3b82f6;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 6px 12px rgba(59, 130, 246, 0.3);
}

.register-button:hover {
  background-color: #2563eb;
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.5);
}

/* Responsividade */
@media (max-width: 480px) {
  .register-card {
    padding: 2rem 1.5rem;
  }
}
</style>
