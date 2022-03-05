<template>
   <v-container fluid fill-height>
      <v-layout align-center justify-center >
         <v-flex xs12 sm8 md4>
            <v-card elevation="24" shaped tile>
               <v-tabs dark color="primary">
                  <v-tab >LOGIN</v-tab>
                     <v-tab-item>
                     <v-card>
                        <v-card-text>
                           <form>
                              <v-text-field
                                    v-model="correo"
                                    name="correo"
                                    label="Usuario"
                                    type="email"
                                    placeholder="Correo electrónico"
                                    required
                              ></v-text-field>
                              <v-text-field
                                 v-model="password"
                                 name="password"
                                 label="Contraseña"
                                 type="password"
                                 placeholder="Contraseña"
                                 required
                              ></v-text-field>
                               <router-link to="/paginainicio">
                                 <v-btn @click="loginUsuario" class="mt-4"  dark color="secondary" value="login">LOGIN</v-btn>
                              </router-link>
                           </form>
                        </v-card-text>
                        <v-alert dense outlined type="error" v-if="error">
                              {{error}}
                           </v-alert>
                     </v-card>
                     </v-tab-item>
               </v-tabs>
            </v-card>
         </v-flex>
      </v-layout>
   </v-container>
</template>

<script>

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default({
   data(){
      return{
         correo: '',
         password: '',
         error: ''
      }
   },
    name: 'Login',
    methods:{
         loginUsuario(){

            if(this.correo && this.password){
               
               this.error='';
               const auth=getAuth();

               signInWithEmailAndPassword(auth,this.correo,this.password).then((userCredential)=>{
                  const user=userCredential.user;
                  console.log(user);

               }).catch((error)=>{
                  const errorCode=error.errorCode;
                  const errorMesage=error.message;

                  console.log(errorCode);
                  console.log(errorMesage);
               })
            }
             else{
               this.error='Introduce tus datos'
            }
        }
    }
})

</script>

