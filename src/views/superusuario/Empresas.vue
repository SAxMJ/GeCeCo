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
                          <v-card-text  class="text-h5 font-weight-bold white--text">EMPRESAS</v-card-text>
                      </v-card>
                  </v-col>
                  <v-col cols="12" lg="1" md="1" class="transparent fill-height d-flex flex-column justify-center align-center">
                      <v-card class="transparent" flat tile>
                        <router-link to="/registerempresa/3">
                          <v-btn medium dark class="green"><v-icon medium>mdi-home-plus-outline</v-icon></v-btn>
                        </router-link>
                      </v-card>
                  </v-col>
                  <v-col cols="12" lg="1" md="1" class="transparent fill-height d-flex flex-column justify-center align-center">
                  </v-col>
              </v-row>
            </v-img>
        </v-container>

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
      
       /** Método encargado de recuperar las empresas que se encuentran registradas en el sistema
       * @public
       */
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