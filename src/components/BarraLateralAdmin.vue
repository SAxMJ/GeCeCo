<template> <!-- @slot Barra de navegación con la que contarán los administradores para navegar por la aplicación-->
      <v-navigation-drawer app  :mini-variant.sync="mini" permanent class="secondary">
              
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

            </v-img>    
          </v-list-item-avatar>
        <v-list-item-title>ADMINISTRADOR</v-list-item-title>
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
            <v-icon v-if="item.title!=='Alertas' && item.title!=='Tickets'">{{ item.icon }}</v-icon>
            
            <v-badge v-if="item.title==='Alertas'"  color="orange"  right>
              <template   v-slot:badge>
                <span>{{nAvisos}}</span>
              </template>
              <v-icon >{{ item.icon }}</v-icon>
            </v-badge>

            <v-badge v-if="item.title==='Tickets'"  color="lime"  right>
              <template   v-slot:badge>
                <span>{{nTickets}}</span>
              </template>
              <v-icon >{{ item.icon }}</v-icon>
            </v-badge>


          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title  class:>{{ item.title }}</v-list-item-title>
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
import { collection, getDocs, getFirestore, query, where } from '@firebase/firestore';
import firebaseApp from '../scripts/firebase'

  var auth=getAuth();
  var user=auth.currentUser;

/**
 * Opciones de navegación para los Administradores 
 * @public
 */
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
        ],
        nAvisos:0,
        nTickets:0,
      }
    },
    methods:{
    /** 
    * Método encargado de eliminar la sesión creada 
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
      /** Método encargado de cargar la foto de perfil de la barra de navegación así como de las burbujas
        * informativas referentes a si existen alertas y tickets sin resolver y cuantos
        * @public
        */
        async getUrlFotoPerfilYAvisosAlerta(){
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

          const firebaseDB= getFirestore(firebaseApp);
          const auth = getAuth();

          const avisosRef = collection(firebaseDB, 'AvisosDeAlerta');
          console.log(auth.currentUser.uid)
          const consulta2 =  query(avisosRef, where("IdAdmin", "==", auth.currentUser.uid), where("Estado", "==", "No resuelta"));
          const querySnapshot2 = await getDocs(consulta2);
          
          querySnapshot2.forEach((doc) => {
            this.nAvisos++;
          });

          var IdEmp=""
          const consulta =  query(collection(firebaseDB, "Trabajadores"), where("Correo", "==", auth.currentUser.email));
          const querySnapshot = await getDocs(consulta);
          querySnapshot.forEach((doc) => {
            IdEmp=doc.get("IdEmpresa")
          });

          const consulta3 =  query(collection(firebaseDB, "Tickets"), where("IdEmpresa", "==", IdEmp),  where("Estado", "==", "No resuelta"));
          const querySnapshot3 = await getDocs(consulta3);
        
          querySnapshot3.forEach(async(doc) => {
            this.nTickets++;
          });
    }
    },
    mounted(){
      this.getUrlFotoPerfilYAvisosAlerta()
    }
  }
</script>