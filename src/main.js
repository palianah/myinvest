import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import vuetour from './plugins/vuetour'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  vuetour,
  render: (h) => h(App),
}).$mount('#app')
