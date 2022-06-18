<template>
  <v-app>
    <div id="app">
      <v-layout>
        <router-link to="/">
          <v-img  max-height="50" max-width="50" src='./images/Gececo.jpg'></v-img>
        </router-link>
      </v-layout>
      <router-view/> 
   </div>
  </v-app>
</template>


<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background:url("https://img.freepik.com/vector-gratis/diseno-fondo-blanco-estilo-perspectiva-3d-forma-hexagonal_1017-27558.jpg?w=2000");
  //background:url("https://png.pngtree.com/thumb_back/fw800/back_our/20190628/ourmid/pngtree-light-blue-background-image_264178.jpg");
  width:100%;			// El tamaño se establece en 100%
  height:100%;			// El tamaño se establece en 100%
  background-size:100% 100%;
}

nav {

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

