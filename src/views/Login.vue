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
                           <v-btn @click="loginUsuario" type="submit" class="mt-4"  dark color="secondary" value="login">LOGIN</v-btn>
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

<!--
La declaración export se utiliza al crear módulos de JavaScript para exportar funciones, 
objetos o tipos de dato primitivos del módulo para que puedan ser utilizados por otros programas con la sentencia import.
!--> 

<script>

export default({
    name: 'Login',
    methods:{
         loginUsuario(){
            console.log("Usuario logueado");
        }
    }
})
</script>

