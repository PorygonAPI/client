import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import fetchPlugin from './plugins/fetch.js'
import './assets/main.css'
import 'primeicons/primeicons.css'

import PrimeVue from 'primevue/config';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Aura from '@primeuix/themes/aura';
import ToastService from 'primevue/toastservice';

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
});
app.use(ToastService);
app.component('DataTable', DataTable);
app.component('DataTableColumn', Column);
app.mount('#app')
