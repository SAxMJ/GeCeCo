import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

import 'firebase/firestore';
import { initializeApp } from "firebase/app";

Vue.config.productionTip = false

//Creamos una instancia de vue
new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyAZWJA8GkibUqjbRRMfFQ_OhYhjOV3NAQs",
  authDomain: "gececo-c0865.firebaseapp.com",
  projectId: "gececo-c0865",
  storageBucket: "gececo-c0865.appspot.com",
  messagingSenderId: "850837378930",
  appId: "1:850837378930:web:8c6aa4e4bd92284a9d2feb"
};


// Initialize Firebase
 export const firebaseApp = initializeApp(firebaseConfig);
 //Acceso al servicio de firestore (creo que el export no s permite usar el db en otro fichero que lo importemos)
 export const db = firebaseApp.firestore();

 //Nos conectamos a la colección de usuarios
 const coleccion = db.collection('users');

 //Creo algunas funciones para usarlas en otros componentes
 export const crearUsuario=usuario => {
   return coleccion.add(usuario);
 }
