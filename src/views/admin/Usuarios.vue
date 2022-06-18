<template>
<v-main>
  <v-container app>
    <v-card class="grey lighten-4">
      <v-container>

        <v-container fluid pa-0>
            <v-img width="1740px" height="100px" small  gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" class="white--text align-center justify-center " src="../../images/adornoTerminal3.jpg">
              <v-row align="center" justify="center" 
                  style="height:100vh" dense>
                  <v-col cols="12" lg="2" md="2" class="transparent fill-height d-flex flex-column justify-center align-center">
                      <v-card flat tile>
                      </v-card>
                  </v-col>
                  <v-col cols="12" lg="7" md="7" class="transparent fill-height d-flex flex-column justify-center align-center">
                      <v-card class="transparent" flat tile>
                          <v-card-text  class="text-h5 font-weight-bold white--text">USUARIOS DE LA EMPRESA</v-card-text>
                      </v-card>
                  </v-col>
                  <v-col cols="12" lg="1" md="1" class="transparent fill-height d-flex flex-column justify-center align-center">
                      <v-card class="transparent" flat tile>
                        <router-link to="/registeradmin/2">
                          <v-btn medium dark class="green"><v-icon>mdi-account-plus-outline</v-icon></v-btn> 
                        </router-link>
                      </v-card>
                  </v-col>
                  <v-col cols="12" lg="1" md="1" class="transparent fill-height d-flex flex-column justify-center align-center">
                  </v-col>
              </v-row>
            </v-img>
        </v-container>
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

/** Ventana donde se muestran los diferentes trabajadores asociados a la misma empresa a la que se
 * encuentra asociado el administrador
* @public
*/
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
    methods:{
    /** Método encargado de recuperar todos los trabajadores asociados a una empresa
     * @public
     * @param firebaseDB Instancia de la base de datos que nos permite trabajar con ella
     * @param {string} IdEmp Id de la empresa correspondiente de la que queremos recuperar todos los
     * trabajadores asociados
    */
      async recuperaTrabajadores(firebaseDB,IdEmp){
        const consulta =  query(collection(firebaseDB, "Trabajadores"), where("IdEmpresa", "==", IdEmp));
        const querySnapshot = await getDocs(consulta);
        
        querySnapshot.forEach((doc) => {
          this.usuarios.push(doc.data());
        });

      },

    /** Método encargado de acceder a la información de un empleado de la empresa
     * @public
     * @param {Object} usuario Objeto que contendrá información relevante que nos permitirá 
     * indentificar al usuario para poder recuperar su información posteriormente.
    */
      VerUsuario(usuario){
        console.log("usuario: "+usuario.Correo);
        this.$router.push('/verusuario/2/'+usuario.Correo);
      },
    /** Método encargado de recuperar el identificador de la empresa a la que pertenece el administrador
    * @public
    */
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
    }
    },
    mounted(){
      this.recuperaIDEmpresaAdmin();
    }
  }


</script>