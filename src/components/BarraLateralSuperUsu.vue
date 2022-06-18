<template>
      <v-navigation-drawer app  :mini-variant.sync="mini" permanent class="secondary">
<!--        <v-card class="transparent">
            <v-card-title class="justify-center" >
              <v-img width="100" class="justify-center" src="../images/LogoTrasparente2.png">
              </v-img>
           </v-card-title>
        </v-card>
-->
        <v-card class="transparent">
        <v-card-title class="justify-center" >
          <v-list class=" align-center justify-center " width="130">           
            <v-img width="130" src="../images/LogoTrasparente2.png"></v-img> 
          </v-list>
        </v-card-title>
      </v-card>
        
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

        <v-list-item-title>SUPER USUARIO</v-list-item-title>
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
import {query, where, getDocs} from "firebase/firestore";
import {getFirestore, collection, updateDoc,doc, deleteDoc, addDoc} from "firebase/firestore"
import firebaseApp from '../scripts/firebase'

/**
 * Opciones de navegación para los Super usuarios
 * @public
 */
  export default {
    data () {
      return {
        fotourl:"",
        drawer: true,
        nombreusuario: "",
        items: [
          { title: 'Inicio', icon: 'mdi-home', path: '/paginainicio/3',},
          { title: 'Empresas', icon: 'mdi-domain', path: '/empresas/3' },
          { title: 'Super Usuarios', icon: 'mdi-face-agent', path: '/superusuarios/3' },
          { title: 'MiUsuario', icon: 'mdi-account', path: '/miusuario/3' },
        ],
        mini: false,
        opciones:[
          {title: 'Cerrar sesión'}
        ]
      }
    },methods:{
       
        /** Método encargado de borrar la sesión creada
         * @public
         */
        cerrarSesion(){
          const auth = getAuth();
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
        async getUrlFotoPerfil(){ //Método para obtener la url de la foto de perfil
            const firebaseDB= getFirestore(firebaseApp);

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

            console.log("EES"+auth.currentUser.email)
            const consulta =  query(collection(firebaseDB, "SuperUsuarios"), where("Correo", "==",""+ auth.currentUser.email));
            const querySnapshot = await getDocs(consulta);
            querySnapshot.forEach((doc) => {
              this.nombreusuario=doc.get("Nombre");
              console.log("Nombre "+ this.nombreusuario)
            });
        }
      },
      mounted(){
        this.getUrlFotoPerfil();
      }
  }
</script>