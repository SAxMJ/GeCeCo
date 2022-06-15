<template>
      <v-navigation-drawer app  :mini-variant.sync="mini" permanent class="secondary">
        <v-card class="transparent">
            <v-card-title class="justify-center" >
              <v-img width="100" class="justify-center" src="../images/LogoTrasparente2.png">
              </v-img>
           </v-card-title>
        </v-card>

        <v-list-item class="px-2" dark>
        <v-list-item-avatar>
          <v-img :src="fotourl">
             
          </v-img>
        </v-list-item-avatar>

        <v-list-item-title>TRABAJADOR</v-list-item-title>
        
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

      <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon dark v-on="on" ><v-icon dark>mdi-key-remove</v-icon>Cerrar sesión</v-btn>
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

      </v-navigation-drawer>
      
</template>

<script>

import { getAuth, signOut } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

  export default {
    data () {
      return {
        drawer: true,
        items: [
          { title: 'Inicio', icon: 'mdi-home', path: '/paginainicio/1',},
          { title: 'Tickets', icon: 'mdi-ticket', path: '/ticketsusuario/1'},
          { title: 'Usuario', icon: 'mdi-account', path: '/miusuario/1' },
        ],
        mini: false,
        fotourl: "",
        opciones:[
          {title: 'Cerrar sesión'}
        ]
      }
    },
       methods:{
        /** Método encargado de borrar la sesión creada
         * @public
         */
        cerrarSesion(){
          var auth = getAuth();
          signOut(auth).then(() => {
            console.log("Sesion cerrada, redirigir a inicio "+error)
          }).catch((error) => {
            console.log("Error, no se cerró sesíon: "+error)
          });
        },

        /** Método encargado de recuperar la URL de la foto de perfil del usuario correspondiente para que pueda ser mostrada
         * en la barra lateral
         * @public
         */
        async getUrlFotoPerfil(){ 
            var photo;
            var auth=getAuth();
            var user=auth.currentUser;

            
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
      },
      mounted(){
        this.getUrlFotoPerfil();
      }
  }
</script>