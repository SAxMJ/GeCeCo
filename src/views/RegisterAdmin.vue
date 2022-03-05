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

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default({
   data(){
      return{
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
            
            if(this.nombre && this.apellidos && this.correo && password){
               this.error=''; //Limpiamos el mensaje de error
               const auth = getAuth();
               
               createUserWithEmailAndPassword(auth, this.correo, password).then((userCredential) => {
                  // Signed in
                     const user = userCredential.user;

                     console.log(user);
                     console.log(password);
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
        }
    }
})
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

</script>
