import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import firebase from './scripts/firebase'

Vue.config.productionTip = false

//Creamos una instancia de vue
new Vue({
  router,
  vuetify,
  firebase,
  render: h => h(App)
}).$mount('#app')


// Your web app's Firebase configuration


