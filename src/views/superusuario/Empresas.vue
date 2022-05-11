<template>
<v-main>
<v-container app>
<div>
<v-card>EMPRESAS</v-card>
    <v-card class="grey lighten-2">
      <v-card class="black">{{recuperaEmpresas}}
        <v-row>
        <v-col cols="14" md="5" >
        </v-col>
        <v-col cols="14" md="5" >
        </v-col>
        <v-col cols="14" md="2" >
        <router-link to="/registerempresa/3">
          <v-btn small class="green"><v-icon medium>mdi-home-plus-outline</v-icon></v-btn>
        </router-link>
        </v-col>
        </v-row>
        </v-card>
      <v-container id="regular-tables-view" fluid tag="section">
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
    </div>

    <BarraLateralSuperUsu v-if = "rol==3"></BarraLateralSuperUsu>
    </v-container>
    </v-main>
</template>

<script>
  import BarraLateralSuperUsu from '../../components/BarraLateralSuperUsu.vue'
  import {getFirestore, collection} from "firebase/firestore"
  import firebaseApp from '../../scripts/firebase'
  import {query, getDocs} from "firebase/firestore";

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
   computed:{  
      async recuperaEmpresas(){
        const firebaseDB= getFirestore(firebaseApp);
        const consulta =  query(collection(firebaseDB, "Empresas"));
        const querySnapshot = await getDocs(consulta);
          querySnapshot.forEach((doc) => {
            this.empresas.push(doc.data());
          });
      },
    },
    methods:{

      VerEmpresa(empresa){
        console.log("usuario: "+empresa.idempresa);
        this.$router.push('/fichaempresa/3/'+empresa.IdEmpresa);
      },

    }
  }
</script>