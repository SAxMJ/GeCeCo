<template>
      <v-navigation-drawer app  :mini-variant.sync="mini" permanent class="secondary">
        <v-list-item class="px-2" dark>
          
          <v-list-item-avatar>
            <v-img :src="fotourl">
            
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
          @click.stop="mini = mini"
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
      {{getUrlFotoPerfil}}
      </v-navigation-drawer>
</template>

<script>

import { getAuth, signOut } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

  var auth=getAuth();
  var user=auth.currentUser;

  export default {
    data () {
      return {
        drawer: true,
        items: [
          { title: 'Inicio', icon: 'mdi-home', path: '/paginainicio/2',},
          { title: 'Equipos', icon: 'mdi-chart-bar', path: '/equipos/2' },
          { title: 'Usuarios', icon: 'mdi-account-group', path: '/usuarios/2' },
          { title: 'Alertas', icon: 'mdi-alert', path: '/alertas/2'},
          { title: 'Tickets', icon: 'mdi-ticket', path: '/ticketsadmin/2'},
          { title: 'MiUsuario', icon: 'mdi-account', path: '/miusuario/2' },
        ],
        mini: false,
        fotourl: "",
        opciones:[
          {title: 'Cerrar sesión'}
        ]
      }
    },
    methods:{
      cerrarSesion(){
        const auth = getAuth();
        signOut(auth).then(() => {
          console.log("Sesion cerrada, redirigir a inicio "+error)
        }).catch((error) => {
          console.log("Error, no se cerró sesíon: "+error)
        });
      }
    },
      computed:{
      async getUrlFotoPerfil(){ //Método para obtener la url de la foto de perfil
        var photo;
        const auth2=getAuth();
        user=auth2.currentUser;

        console.log("EL VALOR ES: "+user.photoURL);

        if(user.photoURL){
              photo = "FotosDeUsuarios/"+user.uid;
            }else{
              photo = "porDefecto.png"
            }

            console.log("LA RUTITA ES: "+photo);
            //Vamos a recuperar la foto de perfil correspondiente al usuario
            const storage = getStorage();
            const imagesRef = ref(storage,photo);

            //Con esta función obtenemos la url
            await getDownloadURL(imagesRef).then((url)=>{
              this.fotourl=url;
            });
    }
  }
  }
</script>