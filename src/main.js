import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant';
import axios from 'axios';
import api from '@/assets/config/api.js'
import 'vant/lib/index.css';
Vue.config.productionTip = false
Vue.use(Vant);
Vue.prototype.axios = axios
new Vue({
  router,
  store,
  data: {
    api
  },
  render: h => h(App)
}).$mount('#app')