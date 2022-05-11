<template>
<v-main>
  <v-container app>
    <v-card>USUARIOS DE LA EMPRESA</v-card>
    <v-card class="grey lighten-2">
      <v-card class="black">{{recuperaIDEmpresaAdmin}}
        <v-row justify="right">
        <v-col cols="12" md="3" >
        </v-col>
        <v-col cols="12" md="3" >
        </v-col>
        <v-col cols="12" md="3" >
        </v-col>
        <v-col cols="12" md="3" >
          <router-link to="/registeradmin/2">
            <v-btn class="green"><v-icon>mdi-account-plus-outline</v-icon></v-btn> 
          </router-link>
        </v-col>
        </v-row>
      </v-card>

      <v-container id="regular-tables-view" fluid tag="section">
        <v-data-table  v-model="seleccionados" :headers="headers" :items="usuarios" :single-select="true" item-key="Correo" class="elevation-1">

        <template v-slot:item.actions="{ item }">
          <v-icon medium class="mr-2" @click="VerUsuario(item)">mdi-eye</v-icon>
        </template>
          
        </v-data-table>
        <div class="py-3" />
          
      </v-container>

    </v-card>
    <BarraLateralAdmin v-if = "rol==2"></BarraLateralAdmin>
    <BarraLateralSuperUsu v-if = "rol==3"></BarraLateralSuperUsu>

  </v-container>
  </v-main>
</template>
<script>
  import BarraLateralAdmin from '../../components/BarraLateralAdmin.vue'
  import BarraLateralSuperUsu from '../../components/BarraLateralSuperUsu.vue'
  import {getFirestore, collection, updateDoc,doc, deleteDoc} from "firebase/firestore"
  import firebaseApp from '../../scripts/firebase'
  import { getAuth} from "firebase/auth";
  import {query, where, getDocs,addDoc} from "firebase/firestore";
  import { getApp } from "firebase/app";
  import { getFunctions, connectFunctionsEmulator } from "firebase/functions"

//Esto es para poder llamar a las funciones del backend
const functions = getFunctions(getApp());
connectFunctionsEmulator(functions, "localhost", 5001);

  export default{
    data (){
      return{
        seleccionados: [],
        singleSelect: true,
        rol: this.$route.params.rol,
        unoseleccionado:false,
        fechas:[],
        usuarios:[],
        headers:[
          {text: 'Nombre',value: "Nombre"},
          {text: 'Apellidos', value: "Apellidos"},
          {text: 'Correo', value: "Correo"},
          {text: 'Rol', value: "ROL"},
          {text: 'Ver usuario', value: "actions"}
        ],
         opciones:[
          {title: 'Restablecer contraseña'},
          {title: 'Modificar'},
          {title: 'Dar de baja'},
        ],
      }
      },
    components:{
      BarraLateralAdmin,
      BarraLateralSuperUsu
    },
   computed:{ //Cada vez que inicializamos la paginarecogemos los datos
      //Para el administrador los tickets recuperados serán todos aquellos que coincidan con su código de empresa 
      async recuperaIDEmpresaAdmin(){
      //Buscamos IdEmpresa de este administrador
      const firebaseDB= getFirestore(firebaseApp);
      const auth = getAuth();
      const consulta =  query(collection(firebaseDB, "Trabajadores"), where("Correo", "==", auth.currentUser.email));
      const querySnapshot = await getDocs(consulta);
        querySnapshot.forEach((doc) => {
          var IdEmp=doc.get("IdEmpresa")
          this.recuperaTrabajadores(firebaseDB,IdEmp)
        });
      },
    },
    methods:{
      async recuperaTrabajadores(firebaseDB,IdEmp){
        const consulta =  query(collection(firebaseDB, "Trabajadores"), where("IdEmpresa", "==", IdEmp));
        const querySnapshot = await getDocs(consulta);
        
        querySnapshot.forEach((doc) => {
          this.usuarios.push(doc.data());
        });

      },
      VerUsuario(usuario){
        console.log("usuario: "+usuario.Correo);
        this.$router.push('/verusuario/2/'+usuario.Correo);
      }
    }
  }


</script>