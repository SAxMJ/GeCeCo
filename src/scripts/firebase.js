
//FICHERO CON LA CONFIGURACIÓN DE FIREBASE
import  firebase  from 'firebase/compat/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';


const firebaseConfig = {
    apiKey: "AIzaSyAZWJA8GkibUqjbRRMfFQ_OhYhjOV3NAQs",
    authDomain: "gececo-c0865.firebaseapp.com",
    projectId: "gececo-c0865",
    storageBucket: "gececo-c0865.appspot.com",
    messagingSenderId: "850837378930",
    appId: "1:850837378930:web:8c6aa4e4bd92284a9d2feb"
  };
  
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  
   //Nos conectamos a la colección de usuarios
   const coleccion = collection(db,'users');
  
   //Creo algunas funciones para usarlas en otros componentes
   export const crearUsuario=usuario => {
     return coleccion.add(usuario);
   }