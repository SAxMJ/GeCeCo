<template>
   <v-container fluid fill-height>
      <v-layout align-center justify-center >
         <v-flex xs12 sm8 md4>
            <v-card elevation="24" shaped tile>
               <v-tabs dark color="primary">
                  <v-tab >RECUPERAR CONTRASEÑA</v-tab>
                     <v-tab-item>
                     <v-card>
                        <v-card-text>
                           <form>
                                <v-text-field
                                 label="Introduce tu correo asociado"
                                 solo
                                 readonly
                                 centered
                              ></v-text-field>
                              <v-text-field
                                 v-model="correo"
                                 name="email"
                                 label="Email"
                                 type="email"
                                 placeholder="Email"
                                 required
                              ></v-text-field>
                                 <v-btn @click="enviarMail" class="mt-4"  dark color="secondary" value="login">ENVIAR</v-btn>
                           </form>
                        </v-card-text>
                        <v-alert dense outlined type="error" v-if="error">
                              {{error}}
                        </v-alert>
                     </v-card>
                     </v-tab-item>
               </v-tabs>
            </v-card>
            <v-dialog width="500" v-model="enviado">
                <template>
                    <v-card>
                        <v-card-title>
                        </v-card-title>
                        <v-card-text>
                            <v-alert dense outlined type="success" v-if="enviado">
                            {{mensajeenviado}}
                            </v-alert>
                        </v-card-text>
                        <v-btn color="green darken-1" text @click="enviado = false">Aceptar</v-btn>
                    </v-card>
                </template>
            </v-dialog>
         </v-flex>
      </v-layout>
   </v-container>
</template>

<script>

import { getAuth, sendPasswordResetEmail,  } from "firebase/auth";

/** 
 * Vista encargada de proporcionar un correo electrónico de recuperación de la contraseña 
 * @public 
 * @displayName PasswordOlvidada
 */
export default({
  
   data(){
      return{
         correo: '',
         enviado: '',
         mensajeenviado: '',
         error: '',
      }
   },
    name: 'Login',
    methods:{
         /** Método encargado del envío del email 
         * @public
         */
         enviarMail(){
            if(this.correo){
                const auth=getAuth();
                try{ //Se envía un mensaje de resauración de la contraseña al email
                    sendPasswordResetEmail(auth,this.correo);
                    this.enviado= 'Se envió el correo de recuperación';
                    this.mensajeenviado= 'Se envió el correo de recuperación';
                    this.correo= '';
                    this.error='';
                }catch(e){
                    console.log("EL ERROR: "+e)
                }
            }else{
                this.error='Introduce tu email'
            }
        }
    }
})

</script>