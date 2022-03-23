
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
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const firestoreDB = getFirestore(firebaseApp);
  
  export default firebaseApp;
  //export default firebaseApp.firestore();
    
    //Nos conectamos a la colección de usuarios
  const coleccion = collection(firestoreDB,'users');



