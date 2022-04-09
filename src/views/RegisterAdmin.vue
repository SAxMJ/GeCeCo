<template>
   <v-container fluid fill-height>
      <v-layout align-center justify-center>
         <v-flex xs12 sm8 md4>
            <v-card elevation="24" shaped tile>
               <v-tabs dark color="primary">
                  <v-tab>Registrar usuario</v-tab>
                     <v-tab-item>
                     <v-card>
                        <v-card-text>
                           <form>
                              <v-text-field
                                    v-model="nombre"
                                    name="nombre"
                                    label="Nombre"
                                    type="text"
                                    placeholder="Nombre"
                                    required
                              ></v-text-field>
                              <v-text-field
                                 v-model="apellidos"
                                 name="ape"
                                 label="Apellidos"
                                 type="text"
                                 placeholder="Apellidos"
                                 required
                              ></v-text-field>

                              <v-text-field
                                 v-model="correo"
                                 name="correo"
                                 label="Correo electrónico"
                                 type="email"
                                 placeholder="Correo electrónico"
                                 required
                              ></v-text-field>
                           <v-btn @click="registraUsuario" class="mt-4"  dark color="secondary" value="Registro">Register</v-btn>
                           </form>
                           <v-alert dense outlined type="error" v-if="error">
                              {{error}}
                           </v-alert>
                        </v-card-text>
                     </v-card>
                     </v-tab-item>
               </v-tabs>
            </v-card>
         </v-flex>
      </v-layout>
   </v-container>
</template>

<script>

import { getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth";
import {getFirestore, collection, addDoc} from "firebase/firestore"
import firebaseApp from '../scripts/firebase';
//import  {enviaMail} from '../../functions/mails';
import {query, where, getDocs, onSnapshot  } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { getApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions"


const functions = getFunctions(getApp());
connectFunctionsEmulator(functions, "localhost", 5001);

export default({
   data(){
      return{
         rol: this.$route.params.rol,
         nombre: '',
         apellidos: '',
         correo: '',
         error: ''
      }
   },
    name: 'Registro',
    methods:{
        registraUsuario(){
            
            var password=generarPassword();

            const firebaseDB= getFirestore(firebaseApp);
            //functions=getFunctions();

            if(this.nombre && this.apellidos && this.correo && password){
               this.error=''; //Limpiamos el mensaje de error

               const registrarTrabajador=httpsCallable(functions,"registrarTrabajador");
               registrarTrabajador({usuario: this.correo, pass: password}).then(async(resultado)=> {
         
                  //const mailEstablecerPassword=httpsCallable(functions,"mailEstablecerPassword");
                  //mailEstablecerPassword({usuario: this.correo}).then(result=> {
                     //const data=result.data;
                     console.log("ELUIDDDD es "+resultado.data);
                     await sendPasswordResetEmail(getAuth(),this.correo);
                     //UNA VEZ EL USUARIO HA SIDO REGISTRADO LE ASIGNAMOS UN ROL Y LO AÑADIMOS A LA TABLA DE RolUser
                      try {
                        const docRef =  await addDoc(collection(firebaseDB, "RolUser"), {
                           ROL: "Trabajador",
                           UID: resultado.data,
                           Correo:this.correo
                        });
                        //console.log("Document written with ID: ", docRef.id);
                        } catch (e) {
                        //console.error("Error adding document: ", e);
                        }
                  //});
               });
            }
            else{
               this.error='Faltan datos por añadir al formulario'
            }

            //Ahora lo que haremos será obtener el ID de la empresa correspondiente al administrador para asginarselo al nuevo registrado
            //ya que un administrador solo puede registrar trabajadores para su empresa.
            const auth = getAuth();
            const consulta =  query(collection(firebaseDB, "Trabajadores"), where("UID", "==", auth.currentUser.uid));

            IdEmpresaAdminYAddTrabajador(firebaseDB,consulta,this.nombre,this.apellidos,this.correo);
        }
    }
})

//FUNCIONES

    //Función encargada de generar una contraseña de 10 caracteres aleatorios
   function generarPassword() {
      const longitud = 10;
      const caracteres = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

      var cadena = "";
      var max = caracteres.length-1;
      for (var i = 0; i<longitud; i++) {
          cadena += caracteres[ Math.floor(Math.random() * (max+1)) ];
      }

      return cadena;
   }

   //Función que obtiene el Id empresa del admin y registra al trabajador en la base de datos
   async function IdEmpresaAdminYAddTrabajador(firebaseDB,consulta,nombre,apellidos,correo){

      const querySnapshot = await getDocs(consulta);
      
      querySnapshot.forEach((doc) => {
         //Ahora una vez que tenemos el documento del administrador, le crearemos un documento para el nuevo trabajador
         //con el id de la empresa del administrador
         try {
            const docRef =  addDoc(collection(firebaseDB, "Trabajadores"), {
               Nombre: nombre,
               Apellidos: apellidos,
               Correo: correo,
               IdEmpresa: doc.get("IdEmpresa"),
               ROL: "Trabajador"
            });
            //console.log("Document written with ID: ", docRef.id);
            } catch (e) {
            //console.error("Error adding document: ", e);
            }
      });
   }

</script>
