import Vue from 'vue'
import App from './App.vue'
import {router, store} from '@/config/index'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
