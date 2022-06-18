<template>
    <v-container>
        <v-layout row wrap  align-center justify-center fill-height >
            <v-img max-height="500" max-width="500" src='../images/LogoTrasparente.png' class="center"></v-img>
          <v-container>
            <router-link to="/login">
                <v-btn dark color="black">LOGIN</v-btn>
              </router-link>
          </v-container>
          
        </v-layout>
        <v-layout row wrap  align-center justify-center fill-height >
           
        </v-layout>
    </v-container>
</template>

<script>

  /**Página principal de la inicio de la aplicación, a la que pueden acceder tanto los usuarios registrados como los no
   * registrados
   * @public
   */

  export default({
  })
</script>
