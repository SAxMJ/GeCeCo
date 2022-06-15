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
            <v-btn small dark class="green" @click="boolNuevoEquipo=true"><v-icon>mdi-plus-box-outline</v-icon></v-btn> 
          </v-col>
          <v-col cols="5" md="1" >
          </v-col>
          </v-row>
        </v-img>
      </v-card>
        <v-card>EQUIPOS DE LA EMPRESA</v-card>
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
                      AÑADIR UN NUEVO EQUIPO
                    </v-card-title>
                    <v-card-text>Introduce el correo del usuario y un nombre para el equipo</v-card-text>
                    <v-card-text>
                      <v-form>
                        <v-text-field color="black" label="Correo Usuario" v-model= "correoRegistroEquipo" type="text" />
                        <v-text-field color="black" label="Nombre Equipo" v-model= "nombreEquipo" type="text" />
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

  /** Vista de la aplicación encargada de mostrar todos los equipos registrados para los usuarios de la empresa, permitirá
  * también acceder a la información correspondiente de un equipo y añadir o registrar nuevos equipos
  * @public
  */
 
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
          {text: 'Nombre equipo',value: "NombreEquipo"},
          {text: 'Trabajador',value: "CorreoTrabajador"},
          {text: 'Ver equipo', value: "actions"}
        ],
        boolNuevoEquipo:false,
        idEmpresa:"",
        flagExitoCrearEquipo:false,
        correoRegistroEquipo:"",
        nombreEquipo:"",
      }
      },
    components:{
      BarraLateralAdmin,
      BarraLateralSuperUsu
    },
  
    methods:{
      /** Método encargado de recuperar y mostrar los equipos correspondientes a la empresa del Administrador
       * se recuperaraán de base de datos todos aquellos cuyo Id de la empresa sea el mismo que el del Administrador
       * @public
       * @param firebaseDB Instancia de la base de datos de Firebase que nos permite el acceso a la misma
       * @param {string} IdEmp ID de la empresa correspondiente de la que debemos recuperar los equipos registrados
       */
      async recuperaEquipos(firebaseDB,IdEmp){
        const consulta =  query(collection(firebaseDB, "Equipos"), where("IdEmpresa", "==", IdEmp));
        const querySnapshot = await getDocs(consulta);

        
        querySnapshot.forEach((doc) => {
          var result=[{IdEquipo:"",NombreUsuario:"", NombreEquipo:"", CorreoTrabajador:""}];
          result.IdEquipo=doc.id
          result.NombreUsuario=doc.get("IdUsuario")
          result.NombreEquipo=doc.get("NombreEquipo")
          result.CorreoTrabajador=doc.get("CorreoTrabajador")
          this.equipos.push(result);
        });

      },

      /** Método encargado de proporcionarnos acceso a la información completa de un equipo
       * @public
       * @param {Object} equipo Nos proporciona el Id Correspondiente al equipo al que queremos acceder
       */
      VerEquipo(equipo){
        console.log("equipo: "+equipo.IdEquipo);
        this.$router.push('/verequipo/2/'+equipo.IdEquipo);
      },

      /** Método encargado de la creación o dada de alta de un nuevo equipo dentro del sistema
       * para una empresa
       * @public
       */
      async nuevoEquipo(){
       
        const firebaseDB= getFirestore(firebaseApp);

        const consulta =  query(collection(firebaseDB, "RolUser"), where("Correo", "==", this.correoRegistroEquipo));
        const querySnapshot = await getDocs(consulta);
          querySnapshot.forEach((doc) => {
            this.idUsuarioNuevoEquipo=doc.get("UID");
            
          });
          
        var idNuevoEquipo=this.idEmpresa+""+this.idUsuarioNuevoEquipo;

        if(this.correoRegistroEquipo && this.nombreEquipo){
          try {
              
              //Creamos el nuevo documento de equipos
              await setDoc(doc(firebaseDB, "Equipos", idNuevoEquipo),{
                IdEmpresa: this.idEmpresa,
                IdUsuario: this.idUsuarioNuevoEquipo,
                CorreoTrabajador: this.correoRegistroEquipo,
                NombreEquipo: this.nombreEquipo
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
       /** Método encargado de recargar la página para visualizar los cambios realizados
        * @public
       */
      recargaPagina(){
         location.reload();
      },
      /** Método encargado de recuperar el ID de la empresa del administrador que está utilizando la aplicación
      * @public
      */
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
    mounted(){
      this.recuperaIDEmpresaAdmin();
    }
  }


</script>