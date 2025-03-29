import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import fetchPlugin from './plugins/fetch.js'
import './assets/main.css'

import PrimeVue from 'primevue/config';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Aura from '@primeuix/themes/aura';

const app = createApp(App)
app.use(router)
app.use(fetchPlugin)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      cssLayer: {
        name: "primevue",
        order: "base, primevue",
      },
      darkModeSelector: ".dark",
    },
  },
});app.component('DataTable', DataTable);
app.component('DataTableColumn', Column);
app.mount('#app')
