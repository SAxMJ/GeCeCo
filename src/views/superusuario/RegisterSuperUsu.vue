<template>
   <v-container fluid fill-height>
     <v-layout align-center justify-center>
         <v-flex xs12 sm8 md4>
            <v-card elevation="24" shaped tile>
              <!--DIÁLOGO DE REGISTRO DE UN USUARIO PARA UNA EMPRESA-->
         <v-tabs dark color="primary">
            <v-tab>Registrar SuperUsuario</v-tab>
                <v-tab-item>
                <v-card>
                <v-card-text>
                    <form>
                    <v-text-field v-model="nombreSuper" name="user" label="Nombre" type="text" placeholder="Nombre" required></v-text-field>
                    <v-text-field v-model="apellidosSuper" name="ape" label="Apellidos" type="text" placeholder="Apellidos" required></v-text-field>
                    <v-text-field v-model="correoSuper" name="user" label="Correo electrónico" type="email" placeholder="Correo electrónico" required></v-text-field>
                    <v-btn  @click="boolConfirmacionAlta=true" class="mt-4"  dark color="secondary" value="registerUsu">Registrar</v-btn>
                    </form>
                </v-card-text>

                <v-card-text> 
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

        <!--DIÁLOGO MENSAJE DE CONFIRMACION ALTA-->
      <v-dialog width="500" v-model="boolConfirmacionAlta">
      <template>
          <v-card>
              <v-card-title class="justify-center">
                <v-text>CONFIRMACIÓN</v-text>
              </v-card-title>
              <v-card-text>
                <v-text>¿Estás seguro de que quieres dar de alta este usuario?</v-text>
              </v-card-text>
              <v-btn color="red darken-1" text @click="reseteaFlags">CANCELAR</v-btn>
              <v-btn color="green darken-1" text @click="registraSuperUsuario">ACEPTAR</v-btn>
          </v-card>
      </template>
      </v-dialog>


    <!--DIÁLOGO MENSAJE DE ÉXITO-->
      <v-dialog width="500" v-model="flagexito">
      <template>
          <v-card>
              <v-card-title class="justify-center">
                <v-text>HECHO</v-text>
              </v-card-title>
              <v-card-text>
                <v-text>Se realizó con éxito</v-text>
              </v-card-text>
              <v-btn color="green darken-1" text @click="volverASuperusuarios">ACEPTAR</v-btn>
          </v-card>
      </template>
      </v-dialog> 
      
   </v-container>

</template>

<script>

import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import {getFirestore, collection, addDoc} from "firebase/firestore"
import firebaseApp from '../../scripts/firebase';
import { httpsCallable } from "firebase/functions";
import { getDownloadURL, getStorage, ref } from '@firebase/storage';
import { getApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions"

const functions = getFunctions(getApp());
connectFunctionsEmulator(functions, "localhost", 5001);

export default({
    
    data(){
      return{
         nombreSuper:"",
         apellidosSuper: "",
         correoSuper: "",
         passReautenticar:"",
         boolConfirmacionAlta:false,
         error:"",
      }
   },
    name: 'Registro',
    methods:{
        async registraSuperUsuario(){
            var password=generarPassword();
            console.log(password);
            const firebaseDB= getFirestore(firebaseApp);
            var imagesRef= '';
            this.error=''; //Limpiamos el mensaje de error
            this.boolConfirmacionAlta=false;

            if(this.nombreSuper && this.apellidosSuper && this.correoSuper && password){
               
               const registrarTrabajador=httpsCallable(functions,"registrarTrabajador");
               registrarTrabajador({usuario: this.correoSuper, pass: password}).then(async(resultado)=> {
                    console.log("ELUIDDDD es "+resultado.data);
                    await sendPasswordResetEmail(getAuth(),this.correoSuper);
                     //UNA VEZ EL USUARIO HA SIDO REGISTRADO LE ASIGNAMOS UN ROL Y LO AÑADIMOS A LA TABLA DE RolUser
                    try {
                        const docRef =  await addDoc(collection(firebaseDB, "RolUser"), {
                            ROL: "SuperUsu",
                            UID: resultado.data,
                            Correo:this.correoSuper
                        });

                        console.log("Document written with ID: ", docRef.id);
                    } catch (e) {
                        console.error("Error adding document: ", e);
                    }
                        //AÑADIMOS EL NUEVO ADMIN A LA BASE DE DATOS DE TRABAJADORES
                        const storage=getStorage();
                        imagesRef= ref(storage,'porDefecto.png');

                    await getDownloadURL(imagesRef).then(async(url)=>{
                      try {
                          const docRef =  await addDoc(collection(firebaseDB, "SuperUsuarios"), {
                          Nombre: this.nombreSuper,
                          Apellidos: this.apellidosSuper,
                          Correo: this.correoSuper,
                          ROL: "SuperUsu",
                          URLImage: url
                          });
                          console.log("Document written with ID: ", docRef.id);
                          this.flagexito=true;
                          
                      } catch (e) {
                          console.error("Error adding document: ", e);
                      }
                    });
               });
            }
            else{
              this.error='Faltan datos por añadir al formulario'
            }
      },
      volverASuperusuarios(){
         this.$router.push('/superusuarios/3');
      },
      reseteaFlags(){
          this.error="";
          this.flagexito=false;
          this.boolConfirmacionAlta=false;
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