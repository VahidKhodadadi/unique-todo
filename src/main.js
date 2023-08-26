import './assets/main.css'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VDatePicker } from 'vuetify/labs/VDatePicker'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia';
import MomentUtils from "@date-io/jalaali"

const momentUtil = new MomentUtils({ locale: "sv" });

const app = createApp(App);
const pinia = createPinia();
const vuetify = createVuetify({
    components: {
        ...components,
        VDatePicker
    },
    directives,
    date: {
        adapter: momentUtil
    },
})

app.use(router).use(pinia).use(vuetify);

app.mount('#app')
