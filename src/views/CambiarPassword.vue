<template>
   <v-container fluid fill-height>
      <v-layout align-center justify-center >
         <v-flex xs12 sm8 md4>
            <v-card elevation="24" shaped tile>
               <v-tabs dark color="primary">
                  <v-tab >Cambiar contraseña</v-tab>
                     <v-tab-item>
                     <v-card>
                        <v-card-text>
                           <form>
                              <v-text-field
                                    v-model="passwordAnt"
                                    name="passwordAnt"
                                    label="Antigua contraseña"
                                    type="password"
                                    placeholder="Antigua contraseña"
                                    required
                              ></v-text-field>
                              <v-text-field
                                 v-model="passwordNue"
                                 name="passwordNue"
                                 label="Contraseña nueva"
                                 type="password"
                                 placeholder="Contraseña nueva"
                                 required
                              ></v-text-field>
                               <router-link to="/cambiarpassword">
                                 <v-btn @click="cambiarPassword" class="mt-4"  dark color="secondary" value="Enviar">ENVIAR</v-btn>
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
import firebaseApp from '../scripts/firebase';
import {getAuth, EmailAuthProvider, reauthenticateWithCredential} from "firebase/auth";
export default({
   data(){
      return{
         passwordAnt: '',
         passwordNue: '',
         error: ''
      }
   },
    name: 'cambiarPassword',
    methods:{
         cambiarPassword(){
            if(this.passwordAnt && this.passwordNue){
               
                this.error='';
                const auth=getAuth();
                const user = auth.currentUser;
                
                //ANTES DE CAMBIAR LA CONTRASEÑA HABRÍA QUE HACER UNA COMPROBACION DE SI LA ANTERIOR CONTRASEÑA ES UNA CONTRASEÑA VÁLIDA O NO
                const credential = EmailAuthProvider.credential(user.email, this.passwordAnt);
                
                reauthenticateWithCredential(user,credential).then(result=>{
                    console.log("PassCambiada");
                    const cambiarPassword=firebaseApp.functions().httpsCallable('cambiarPassword');
                    cambiarPassword({usuario: user.uid, pass: passwordNue}).then(result=> {
                    
                });
                }).catch(function(error) {
                   console.log("La contraseña anterior es incorrecta"); //ESTO HABRÍA QUE PONERLO POR HTML
                });
            }
             else{
               this.error='Introduce las contraseñas'
            }
        }
    }
})
</script>
