<template>
<v-main>
<v-container app>
    <v-card class="grey lighten-2">
      <v-container>
        <v-card class="black">
        <v-img height="100" small  gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" class="white--text align-end" src="../../images/adornoTerminal.jpg">
            <v-row>
            <v-col cols="5" md="8" >
            </v-col>
            <v-col cols="5" md="2" >
            </v-col>
            <v-col cols="5" md="1" >
            </v-col>
            <v-col cols="5" md="1" >
              <router-link to="/registerempresa/3">
                <v-btn small dark class="green"><v-icon medium>mdi-home-plus-outline</v-icon></v-btn>
              </router-link>
            </v-col>
            <v-col cols="5" md="1" >
            </v-col>
            </v-row>
          </v-img>
        </v-card>
        <v-card>EMPRESAS</v-card>
          <v-data-table  v-model="seleccionados" :headers="headers" :items="empresas" :single-select="true" item-key="IdEmpresa"  class="elevation-1">
          <template v-slot:top>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon medium class="mr-2" @click="VerEmpresa(item)">mdi-eye</v-icon>
        </template>
          </v-data-table>
        <div class="py-3" />
      </v-container>

    </v-card>

    <BarraLateralSuperUsu v-if = "rol==3"></BarraLateralSuperUsu>
    </v-container>
    </v-main>
</template>

<script>
  import BarraLateralSuperUsu from '../../components/BarraLateralSuperUsu.vue'
  import {getFirestore, collection} from "firebase/firestore"
  import firebaseApp from '../../scripts/firebase'
  import {query, getDocs} from "firebase/firestore";

  /** Ventana en la que se recuperarán y mostrarán todas las empresas registradas dentro de la aplicación
   * además, se podrá solicitar y acceder a la información completa de una empresa
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
        empresas:[],
        headers:[
          {text: 'Nombre',value: "Nombre"},
          {text: 'Dedicación', value: "Dedicacion"},
          {text: 'Localidad', value: "Localidad"},
          {text: 'Dirección', value: "Direccion"},
          {text: 'CP', value: "CP"},
          {text: 'Ver empresa', value: "actions"}
        ],
         opciones:[
          {title: 'Nuevo trabajador'},
          {title: 'Trabajadores'},
          {title: 'Dar de baja'},
        ],
      }
      },
    components:{
      BarraLateralSuperUsu
    },
    methods:{
      /** Método encargado de proporcionarnos acceso a la información completa de una empresa
       * @public
       * @param {Object} empresa Nos proporciona el Id Correspondiente a la empresa a la que queremos acceder
       */
      VerEmpresa(empresa){
        console.log("usuario: "+empresa.idempresa);
        this.$router.push('/fichaempresa/3/'+empresa.IdEmpresa);
      },
      
      /** Método encargado de recuperar las empresas que se encuentran registradas en el sistema */
      async recuperaEmpresas(){
      const firebaseDB= getFirestore(firebaseApp);
      const consulta =  query(collection(firebaseDB, "Empresas"));
      const querySnapshot = await getDocs(consulta);
        querySnapshot.forEach((doc) => {
          this.empresas.push(doc.data());
        });
      },
    },
    mounted(){
      this.recuperaEmpresas();
    }
  }
</script>