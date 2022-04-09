<template>
      <v-navigation-drawer app  :mini-variant.sync="mini" permanent class="secondary">
        <v-list-item class="px-2" dark>
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/men/85.jpg">
           <div class="text-center">
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="transparent" dark v-bind="attrs" v-on="on"></v-btn>
                  </template>
                  <v-list dark>
                    <v-list-item
                      v-for="(opciones, index) in opciones"
                      :key="index"
                      @click="cerrarSesion"
                    >
                      <v-list-item-title>{{ opciones.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
          </v-img>
        </v-list-item-avatar>

        <v-list-item-title>NombreUsuario</v-list-item-title>
        <v-btn
          icon
          @click.stop="mini = !mini"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>
      <v-list  dark>
        <v-list-item 
          v-for="item in items"
          :key="item.title"
          link
          :to="item.path"
        >
          <v-list-item-icon >
            <v-icon >{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class:>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      </v-navigation-drawer>
</template>

<script>
import { getAuth, signOut } from "firebase/auth";

  export default {
    data () {
      return {
        drawer: true,
        items: [
          { title: 'Inicio', icon: 'mdi-home', path: '/paginainicio/3',},
          { title: 'Empresas', icon: 'mdi-domain', path: '/empresas/3' },
          { title: 'MiUsuario', icon: 'mdi-account', path: '/miusuario/3' },
        ],
        mini: true,
        opciones:[
          {title: 'Cerrar sesión'}
        ]
      }
    },methods:{
        cerrarSesion(){
          const auth = getAuth();
          signOut(auth).then(() => {
            console.log("Sesion cerrada, redirigir a inicio "+error)
          }).catch((error) => {
            console.log("Error, no se cerró sesíon: "+error)
          });
        }
      }
  }
</script>