<template>
<v-main>
  <v-container app>
    <v-card class="grey lighten-2">
      <v-container>
        <v-card>EQUIPOS DE LA EMPRESA</v-card>
      </v-container>
      <v-container>
        
      <v-card class="black">{{recuperaIDEmpresaAdmin}}
        <v-row>
        <v-col cols="5" md="8" >
        </v-col>
        <v-col cols="5" md="2" >
        </v-col>
        <v-col cols="5" md="1" >
        </v-col>
        <v-col cols="5" md="1" >
          <v-btn small dark class="green" @click="boolNuevoEquipo=true"><v-icon>mdi-plus-box-outline</v-icon></v-btn> 
        </v-col>
        <v-col cols="5" md="1" >
        </v-col>
        </v-row>
      </v-card>
      </v-container>

      <v-container id="regular-tables-view" fluid tag="section">
        <v-data-table  v-model="seleccionados" :headers="headers" :items="equipos" :single-select="true" item-key="IdEquipo" class="elevation-1">

        <template v-slot:item.actions="{ item }">
          <v-icon medium class="mr-2" @click="VerEquipo(item)">mdi-eye</v-icon>
        </template>
          
        </v-data-table>
        <div class="py-3" />
      </v-container>

       
       <v-dialog v-model="boolNuevoEquipo" persistent max-width="600">
                  <v-card >
                    <v-card-title class="justify-center">
                      INTRODUCE EL ID DEL USUARIO CORRESPONDIENTE
                    </v-card-title>
                    <v-card-text>
                      <v-form>
                        <v-text-field color="black" label="ID Usuario" v-model= "idUsuarioNuevoEquipo" type="text" />
                      </v-form>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="red darken-1" text @click="boolNuevoEquipo=false">Cancelar</v-btn>
                      <v-btn color="green darken-1" text @click="nuevoEquipo()">Aceptar</v-btn>
                    </v-card-actions>
                    <v-card-text>
                      <v-alert dense outlined type="error" v-if="error">
                        {{error}}
                      </v-alert>
                    </v-card-text>
                  </v-card>
                </v-dialog>
    </v-card>

    <!--DIÁLOGO MENSAJE DE ÉXITO-->
      <v-dialog width="500" v-model="flagExitoCrearEquipo">
      <template>
          <v-card>
              <v-card-title class="justify-center">
                <v-text>HECHO</v-text>
              </v-card-title>
              <v-card-text>
                <v-text>Se creó el equipo con éxito</v-text>
              </v-card-text>
              <v-btn color="green darken-1" text @click="recargaPagina">ACEPTAR</v-btn>
          </v-card>
      </template>
      </v-dialog>
    <BarraLateralAdmin v-if = "rol==2"></BarraLateralAdmin>
    <BarraLateralSuperUsu v-if = "rol==3"></BarraLateralSuperUsu>

  </v-container>
  </v-main>
</template>
<script>
  import BarraLateralAdmin from '../../components/BarraLateralAdmin.vue'
  import BarraLateralSuperUsu from '../../components/BarraLateralSuperUsu.vue'
  import {getFirestore, collection, updateDoc,doc, deleteDoc, setDoc} from "firebase/firestore"
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
        error:"",
        seleccionados: [],
        singleSelect: true,
        rol: this.$route.params.rol,
        idEquipo:'',
        idUsuarioNuevoEquipo:'',
        equipos:[],
        headers:[
          {text: 'ID (Equipo)',value: "IdEquipo"},
          {text: 'Usuario', value: "NombreUsuario"},
          {text: 'Ver equipo', value: "actions"}
        ],
        boolNuevoEquipo:false,
        idEmpresa:"",
        flagExitoCrearEquipo:false,
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
          var IdEmp=doc.get("IdEmpresa");
          this.idEmpresa=IdEmp;
          this.recuperaEquipos(firebaseDB,IdEmp)
        });
      },
    },
    methods:{
      async recuperaEquipos(firebaseDB,IdEmp){
        const consulta =  query(collection(firebaseDB, "Equipos"), where("IdEmpresa", "==", IdEmp));
        const querySnapshot = await getDocs(consulta);

        
        querySnapshot.forEach((doc) => {
          var result=[{IdEquipo:"",NombreUsuario:""}];
          result.IdEquipo=doc.id
          result.NombreUsuario=doc.get("IdUsuario")
          this.equipos.push(result);
        });

      },

      VerEquipo(equipo){
        console.log("equipo: "+equipo.IdEquipo);
        this.$router.push('/verequipo/2/'+equipo.IdEquipo);
      },

      async nuevoEquipo(){
        var idNuevoEquipo=this.idEmpresa+""+this.idUsuarioNuevoEquipo;
        const firebaseDB= getFirestore(firebaseApp);

        if(this.idUsuarioNuevoEquipo){
          try {
              
              //Creamos el nuevo documento de equipos
              await setDoc(doc(firebaseDB, "Equipos", idNuevoEquipo),{
                IdEmpresa: this.idEmpresa,
                IdUsuario: this.idUsuarioNuevoEquipo
              })

              const docRef = await addDoc(collection(firebaseDB, "Equipos",idNuevoEquipo,"Monitorizacion"), {
              });              
             
              this.flagExitoCrearEquipo=true;
              console.log("Se registró el equipo: ", docRef.id);
            } catch (e) {
              console.error("Error adding document: ", e);
            }
        }
      },
      recargaPagina(){
         location.reload();
      }
    }
  }


</script>