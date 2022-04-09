<template>
  <v-container app>
    <v-card>USUARIOS DE LA EMPRESA</v-card>
    <v-card class="grey lighten-2">
      <v-card class="black">{{recuperaIDEmpresaAdmin}}</v-card>
      <v-container id="regular-tables-view" fluid tag="section">
          <v-data-table  v-model="seleccionados" :headers="headers" :items="usuarios" :single-select="true" item-key="Correo"   show-select class="elevation-1">
          <template v-slot:top>
          </template>
          </v-data-table>
        <div class="py-3" />
        <router-link to="/registeradmin/2">
          <v-btn  class="primary">Registrar</v-btn>
        </router-link>  
      </v-container>

      <v-container v-if="seleccionados.Correo!==null"> 
        {{comprueba()}}
      <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card icon="mdi-account-outline">  
          <v-card class="black"></v-card>
          <v-form>
            <v-container class="py-0">
              <v-row align-content-center>
                <v-col cols="12" md="4" >
                  <v-text-field color="black" label="Nombre" v-model= "nombre" readonly />
                </v-col> 

                <v-col cols="12" md="4">
                  <v-text-field color="black" label="Apellidos" v-model= "apellidos" readonly />
                </v-col>

                <v-col align-content-space- cols="12" md="4">
                  <v-img align-center max-height="100" max-width="100" :src="imgurl"></v-img>
                  <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon color="black" dark v-bind="attrs" v-on="on"><v-icon dark>mdi-cog</v-icon></v-btn>
                  </template>
                  <v-list dark>
                    <v-list-item
                      v-for="(opciones, index) in opciones"
                      :key="index"
                      @click="itemSeleccionado(index)"
                    >
                      <v-list-item-title>{{ opciones.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field color="black" label="Email" v-model= "email" readonly />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field color="black" label="Empresa" v-model= "empresa" readonly />
                </v-col>

                <v-col cols="12">
                  <v-text-field color="black" label="ROL:" v-model= "rolUser" readonly />
                </v-col>

                <v-col cols="12" class="text-right">
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card>
      </v-col>
      </v-row>
      </v-container>

      <!--DIÁLOGO DE CONFIRMACIÓN DE RESTABLECIMIENTO DE CONTRASEÑA-->
      <v-dialog width="500" v-model="flagmodificapass">
      <template>
          <v-card>
              <v-card-title class="justify-center">
                <v-text>¿Estás seguro?</v-text>
              </v-card-title>
              <v-card-text>
                <v-text>Se enviará un correo al usuario de restablecimiento de su contraseña</v-text>
              </v-card-text>
              <v-btn color="red darken-1" text @click="reseteaFlags">CANCELAR</v-btn>
              <v-btn color="green darken-1" text @click="restablecerPass">ACEPTAR</v-btn>
          </v-card>
      </template>
      </v-dialog>

      <!--DIÁLOGO DE MODIFICAR EL USUARIO-->
      <v-dialog width="500" v-model="flagmodificauser">
      <template>
          <v-card>
              <v-card-title class="justify-center">
                <v-text>¿Estás seguro?</v-text>
              </v-card-title>
              <v-card-text>
                <v-text>Se enviará un correo al usuario de restablecimiento de su contraseña</v-text>
              </v-card-text>
              <v-btn color="red darken-1" text @click="reseteaFlags">CANCELAR</v-btn>
              <v-btn color="green darken-1" text @click="modificarUsuario">ACEPTAR</v-btn>
          </v-card>
      </template>
      </v-dialog>

      <!--DIÁLOGO DE CONFIRMACIÓN DE BAJA DE USUARIO-->
      <v-dialog width="500" v-model="flagbajausuario">
      <template>
          <v-card>
              <v-card-title class="justify-center">
                <v-text>¿Estás seguro?</v-text>
              </v-card-title>
              <v-card-text>
                <v-text>Se dará de baja al usuario</v-text>
              </v-card-text>
              <v-btn color="red darken-1" text @click="reseteaFlags">CANCELAR</v-btn>
              <v-btn color="green darken-1" text @click="darDeBajaUsuario">ACEPTAR</v-btn>
          </v-card>
      </template>
      </v-dialog>


      <!--DIÁLOGO MENSAJE DE ÉXITO-->
      <v-dialog width="500" v-model="flagexito">
      <template>
          <v-card>
              <v-card-title class="justify-center">
                <v-text>HECHO</v-text>
              </v-card-title>
              <v-card-text>
                <v-text>Se realizó con éxito</v-text>
              </v-card-text>
              <v-btn color="green darken-1" text @click="reseteaFlags">ACEPTAR</v-btn>
          </v-card>
      </template>
      </v-dialog> 


    </v-card>
    <BarraLateralAdmin v-if = "rol==2"></BarraLateralAdmin>
    <BarraLateralSuperUsu v-if = "rol==3"></BarraLateralSuperUsu>

  </v-container>
</template>
<script>
  import BarraLateralAdmin from '../../components/BarraLateralAdmin.vue'
  import BarraLateralSuperUsu from '../../components/BarraLateralSuperUsu.vue'
  import {getFirestore, collection, updateDoc,doc, deleteDoc, enableMultiTabIndexedDbPersistence} from "firebase/firestore"
  import firebaseApp from '../../scripts/firebase'
  import { getAuth,sendPasswordResetEmail } from "firebase/auth";
  import {query, where, getDocs} from "firebase/firestore";
  import { getApp } from "firebase/app";
  import { getFunctions, connectFunctionsEmulator } from "firebase/functions"
  import { httpsCallable } from "firebase/functions";

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
          {text: 'Rol', value: "ROL"}
        ],
         opciones:[
          {title: 'Restablecer contraseña'},
          {title: 'Modificar'},
          {title: 'Dar de baja'},
        ],
        nombre: "",
        apellidos: "",
        email: "",
        rolUser: "",
        empresa: "",
        imgurl: "",

        flaginicio: false,
        flagmodificapass:false,
        flagmodificauser:false,
        flagbajausuario: false,
        flagexito:false
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
          //console.log("la ID EMPRESA ES "+IdEmp);
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
      comprueba(){
        console.log("Entro comprueba");
        
        if(this.seleccionados[0]){
          //console.log("Tiene algo");
          this.unoseleccionado=true;
          this.GetDatosUsuario();
        }
        else{
          //console.log("Esta vacio");
          this.unoseleccionado=false;
        }
      },
      async GetDatosUsuario(){
          //var auth = getAuth();
        const firebaseDB= getFirestore(firebaseApp);
        var codEmp;

        //Buscamos el nombre, apellidos, email y empresas
        const consulta =  query(collection(firebaseDB, "Trabajadores"), where("Correo", "==", this.seleccionados[0].Correo));
        const querySnapshot = await getDocs(consulta);
          querySnapshot.forEach((doc) => {
            this.nombre=doc.get("Nombre");
            this.apellidos=doc.get("Apellidos");
            this.email=doc.get("Correo");
            this.imgurl=doc.get("URLImage");
            this.rolUser=doc.get("ROL");
            codEmp=doc.get("IdEmpresa")
          });

          //Buscamos el nombre de la empresa
          const consulta3 =  query(collection(firebaseDB, "Empresas"), where("IdEmpresa", "==", codEmp));
          const querySnapshot3 = await getDocs(consulta3);
          querySnapshot3.forEach((doc) => {
            this.empresa=doc.get("Nombre");
          });
      },
      itemSeleccionado(index){
        if(index==0){
          this.flagmodificapass=true;
          console.log("Queremos restablecer la contraseña")
        }else if(index==1){
          console.log("Queremos modificar el usuario")
          this.flagmodificauser=true;
        }
        else if(index==2){
          console.log("Queremos dar de baja el usuario")
          this.flagbajausuario=true;
          this.flagmodificapasshecho=true;
        }
      },
      async restablecerPass(){
        console.log("PUMBA! SE ENVIÓ EL CORREO")
        await sendPasswordResetEmail(getAuth(),this.seleccionados[0].Correo);
        this.flagmodificapass=false;
        this.flagexito=true;
      },
      modificarUsuario(){
        this.flagmodificauser=false;
        this.flagexito=true;
      },
      async darDeBajaUsuario(){
        const firebaseDB= getFirestore(firebaseApp);
        const darDeBajaUsuario=httpsCallable(functions,"darDeBajaUsuario");
          darDeBajaUsuario({correo: this.seleccionados[0].Correo}).then(async(result) => {
            console.log(result.data);

            //Después de dar de baja el usuario eliminamos todas sus referencias de la base de datos
            const consulta=query(collection(firebaseDB,"Trabajadores"),where("Correo", "==", this.seleccionados[0].Correo));
            const querySnapshot = await getDocs(consulta);
      
            querySnapshot.forEach((doc) => {
              deleteDoc(doc.ref);
            });

            const consulta2=query(collection(firebaseDB,"RolUser"),where("UID", "==", result.data));
            const querySnapshot2 = await getDocs(consulta2);
          
            querySnapshot2.forEach((doc) => {
              deleteDoc(doc.ref);  
            }); 
            this.flagbajausuario=false;
            this.flagexito=true;
        });
      },

      reseteaFlags(){
        this.flagmodificapass=false;
        this.flagmodificauser=false;
        this.flagbajausuario=false;
        this.flagexito=false;
      }
    }
  }
</script>