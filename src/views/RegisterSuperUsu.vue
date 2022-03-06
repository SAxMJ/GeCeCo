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
                                    name="user"
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
                                 name="user"
                                 label="Correo electrónico"
                                 type="email"
                                 placeholder="Correo electrónico"
                                 required
                              ></v-text-field>

                              <v-radio-group v-model="rol" required>
                                 <v-radio
                                    label="TRABAJADOR"
                                    value="Trabajador"
                                 ></v-radio>

                                  <v-radio
                                    label="ADMINISTRADOR"
                                    value="Admin"
                                 ></v-radio>
                                 </v-radio-group>
                           <v-btn  @click="registraUsuario" class="mt-4"  dark color="secondary" value="registerUsu">Register</v-btn>
                           </form>
                        </v-card-text>
                     </v-card>
                     </v-tab-item>
                  <v-tab>Registrar empresa</v-tab>
                     <v-tab-item>
                        <v-card>
                           <v-card-text>
                              <form>
                                 <v-text-field
                                    v-model="nombreEmp"
                                    name="nombEmp"
                                    label="Nombre"
                                    type="text"
                                    placeholder="Nombre de la empresa"
                                    required
                                 ></v-text-field>

                                 <v-text-field
                                    v-model="direccion"
                                    name="dirEmp"
                                    label="Dirección"
                                    type="text"
                                    placeholder="Dirección de la empresa"
                                    required
                                 ></v-text-field>

                                 <v-text-field
                                    v-model="localidad"
                                    name="locali"
                                    label="Localidad"
                                    type="text"
                                    placeholder="Localidad de la empresa"
                                    required
                                 ></v-text-field>

                                 <v-text-field
                                    v-model="cp"
                                    name="cp"
                                    label="CP"
                                    type="text"
                                    placeholder="CP de la empresa"
                                    required
                                 ></v-text-field>

                                 <v-text-field
                                    v-model="dedicacion"
                                    name="dedic"
                                    label="Dedicación"
                                    type="text"
                                    placeholder="Actividades de la empresa"
                                    required
                                 ></v-text-field>
                                 <v-btn @click="registraEmpresa" class="mt-4" dark color="secondary" value="registerEmp">Register</v-btn>
                              </form>
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

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {getFirestore, collection, addDoc} from "firebase/firestore"
import firebaseApp from '../scripts/firebase';

export default({
    
    data(){
      return{
         nombre: '',
         apellidos: '',
         correo: '',
         rol:'',
         nombreEmp: '',
         direccion: '',
         localidad: '',
         cp: '',
         dedicacion: '',
         error: ''
      }
   },
    name: 'Registro',
    methods:{
        registraUsuario(){

            var password=generarPassword();
            
            if(this.nombre && this.apellidos && this.correo && password){
               this.error=''; //Limpiamos el mensaje de error
               const auth = getAuth();
               
               createUserWithEmailAndPassword(auth, this.correo, password).then((userCredential) => {
                  // Signed in
                  const user = userCredential.user;

                  console.log(user);
                  console.log(password);
 
                  //UNA VEZ EL USUARIO HA SIDO REGISTRADO LE ASIGNAMOS UN ROL Y LO AÑADIMOS A LA TABLA DE RolUser
                  const firebaseDB= getFirestore(firebaseApp);

                     try {
                        const docRef =  addDoc(collection(firebaseDB, "RolUser"), {
                           ROL: this.rol,
                           UID: user.uid
                        });
                        console.log("Document written with ID: ", docRef.id);
                        } catch (e) {
                        console.error("Error adding document: ", e);
                        }
               }).catch((error) => {
                     const errorCode = error.code;
                     const errorMessage = error.message;
                     
                     console.log(errorCode);
                     console.log(errorMessage);
                  });
            }

            else{
               this.error='Faltan datos por añadir al formulario'
            }
        },
         registraEmpresa(){
            console.log("Se registro la empresa");
        }
    }
})

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

</script>