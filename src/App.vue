<template>
  <v-app>
    <div id="app">
      <v-layout>
         <v-app-bar color="secondary">
                    <router-link to="/">
                      <v-img max-height="50" max-width="50" src='./images/Gececo.jpg'></v-img>
                    </router-link>
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
