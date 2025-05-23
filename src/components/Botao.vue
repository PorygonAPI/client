<template>
  <button
    :class="[
      'cursor-pointer rounded shadow border-0 transition font-medium',
      'min-w-[120px] h-10 px-4',
      tipoClasse
    ]"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'Botao',
  props: {
    tipo: {
      type: String,
      default: 'primario',
      validator: (value) => ['primario', 'secundario', 'exclusao'].includes(value)
    }
  },
  computed: {
    tipoClasse() {
      switch (this.tipo) {
        case 'secundario':
          return 'btn-secundario';
        case 'exclusao':
          return 'btn-exclusao';
        default:
          return 'btn-primario';
      }
    }
  }
};
</script>

<!-- Estilos globais para variáveis -->
<style>
:root {
  --primario-start: #3b82f6;
  --primario-end: #2563eb;
  --secundario-start: #cbd5e1;
  --secundario-end: #64748b;
  --exclusao-start: #f87171;
  --exclusao-end: #ef4444;
  --shadow-color: rgba(0, 0, 0, 0.15);
}
</style>

<!-- Estilos do botão, escopados -->
<style scoped>
button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  outline: none;
  border: none;
  cursor: pointer;
  transition: background 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.25s ease;
  will-change: transform, box-shadow, background;
  border-radius: 0.375rem;
  font-weight: 600;
  min-width: 120px;
  height: 40px;
  padding: 0 1rem;
}

.btn-primario {
  background: linear-gradient(135deg, var(--primario-start), var(--primario-end));
  color: white;
  box-shadow: 0 2px 6px var(--shadow-color);
}
.btn-primario:hover {
  background: linear-gradient(135deg, var(--primario-end), var(--primario-start));
  box-shadow: 0 6px 15px rgba(37, 99, 235, 0.35);
  transform: translateY(-1.5px) scale(1.02);
}

.btn-secundario {
  background: linear-gradient(135deg, var(--secundario-start), var(--secundario-end));
  color: white;
  box-shadow: 0 2px 6px var(--shadow-color);
}
.btn-secundario:hover {
  background: linear-gradient(135deg, var(--secundario-end), var(--secundario-start));
  box-shadow: 0 6px 15px rgba(100, 116, 139, 0.35);
  transform: translateY(-1.5px) scale(1.02);
}

.btn-exclusao {
  background: linear-gradient(135deg, var(--exclusao-start), var(--exclusao-end));
  color: white;
  box-shadow: 0 2px 6px var(--shadow-color);
}
.btn-exclusao:hover {
  background: linear-gradient(135deg, var(--exclusao-end), var(--exclusao-start));
  box-shadow: 0 6px 15px rgba(239, 68, 68, 0.35);
  transform: translateY(-1.5px) scale(1.02);
}
</style>
