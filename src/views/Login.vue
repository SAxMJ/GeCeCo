<template>
   <v-app >
         <v-container fluid fill-height>
            <v-layout align-center justify-center>
               <v-flex xs12 sm8 md4>
                  <v-card class="elevation-12">
                     <v-toolbar dark color="primary">
                        <v-toolbar-title>Login</v-toolbar-title>
                     </v-toolbar>
                     <v-card-text>
                     <form ref="form" @submit.prevent="login()">
                            <v-text-field
                              v-model="username"
                              name="user"
                              label="Correo electrónico"
                              type="text"
                              placeholder="user"
                              required
                           ></v-text-field>
                           
                            <v-text-field
                              v-model="password"
                              name="psswd"
                              label="Constraseña"
                              type="password"
                              placeholder="psswd"
                              required
                           ></v-text-field>
                           <v-btn type="submit" class="mt-4" color="primary" value="log in">Login</v-btn>
                      </form>
                     </v-card-text>
                  </v-card>
                    <h1>¿No tienes cuenta? Registrate</h1>
               </v-flex>
            </v-layout>
         </v-container>
   </v-app>
</template>

<!--
La declaración export se utiliza al crear módulos de JavaScript para exportar funciones, 
objetos o tipos de dato primitivos del módulo para que puedan ser utilizados por otros programas con la sentencia import.
!--> 

<script>

//Exportamos valores de user y pass , defalt es la infor por defecto
export default ({
    name: "Login",
    //Data tendrá que retornar algo
    data() {
        return {
            user: "",
            psswd: ""
        };
    },

    methods:{
        login() {
            const{user}=this;
            console.log(user +"logged in")
        }
    }
});
</script>
