<template>
  <v-app>
    <div id="app">
      <v-layout justify-center>
         <v-app-bar color="primary">
                  <router-link to="/">
                    <v-img max-height="100" max-width="123" src='./images/gececo.jpg'></v-img>
                  </router-link>
                  <div>
                  <router-link to="/login">
                    <v-btn dark color="black">LOGIN</v-btn>
                  </router-link> 
                  <router-link to="/register">
                    <v-btn dark color="black">REGISTRATE</v-btn>
                  </router-link>
                  </div>
        </v-app-bar>
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
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
