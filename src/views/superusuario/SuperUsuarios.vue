<template>
<v-main permanent>
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
                  <v-col cols="12" lg="6" md="6" class="transparent fill-height d-flex flex-column justify-center align-center">
                      <v-card class="transparent" flat tile>
                          <v-card-text  class="text-h5 font-weight-bold white--text">SUPER USUARIOS</v-card-text>
                      </v-card>
                  </v-col>
                  <v-col cols="12" lg="1" md="1" class="transparent fill-height d-flex flex-column justify-center align-center">
                      <v-card class="transparent" flat tile>
                <v-btn medium dark class="green" @click="opcionBajaAlta(1)"><v-icon>mdi-account-plus-outline</v-icon></v-btn> 
                      </v-card>
                  </v-col>

                  <v-col cols="12" lg="1" md="1" class="transparent fill-height d-flex flex-column justify-center align-center">
                      <v-card class="transparent" flat tile>
              <v-btn medium dark class="red" @click="opcionBajaAlta(2)"><v-icon>mdi-account-minus-outline</v-icon></v-btn> 
                      </v-card>
                  </v-col>
              </v-row>
            </v-img>
        </v-container>
   
        <v-data-table  v-model="usuariosSeleccionados" :headers="headerUsuarios" :items="superusuarios" :single-select="true" item-key="Correo"   show-select class="elevation-1">
        <template v-slot:top>
        </template>
        </v-data-table>
        <div class="py-3" />
    </v-container>
        
    <!--<v-container v-if="usuariosSeleccionados.Correo!==null"> 
        {{compruebaUsuarios()}}
    <v-row justify="center">
    <v-col cols="12" md="8">
        <v-card icon="mdi-account-outline">  
        <v-card class="black"></v-card>
        <v-form>
            <v-container class="py-0">
            <v-row align-content-center>
                <v-col cols="12" md="4" >
                <v-text-field color="black" label="Nombre" v-model= "nombreUsuario" readonly />
                </v-col> 

                <v-col cols="12" md="4">
                <v-text-field color="black" label="Apellidos" v-model= "apellidosUsuario" readonly />
                </v-col>

                <v-col align-content-space- cols="12" md="4">
                    <v-img align-center max-height="100" max-width="100" :src="imgurlUsuario"></v-img>
                </v-col>

                <v-col cols="12" md="6">
                <v-text-field color="black" label="Email" v-model= "emailUsuario" readonly />
                </v-col>

                <v-col cols="12">
                <v-text-field color="black" label="ROL:" v-model= "rolUserUsuario" readonly />
                </v-col>

                <v-col cols="12" class="text-right">
                </v-col>
            </v-row>
            </v-container>
        </v-form>
        </v-card>
    </v-col>
    </v-row>
    <div class="py-3" />
    </v-container> -->
    </v-card>

       <!--DIÁLOGO MENSAJE DE CONFIRMACION DE BAJA-->
      <v-dialog width="500" v-model="boolConfirmacionBaja">
      <template>
            <v-card>
              <v-card-title class="justify-center">
                <v-text>CONFIRMACIÓN</v-text>
              </v-card-title>
              <v-card-text>
                <v-text>¿Estás seguro de que quieres dar de baja este usuario?</v-text>
              </v-card-text>
              <v-btn color="red darken-1" text @click="reseteaFlags">CANCELAR</v-btn>
              <v-btn color="green darken-1" text @click="darDeBajaSuperUsuario">ACEPTAR</v-btn>
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
              <v-btn color="green darken-1" text @click="recargaPagina">ACEPTAR</v-btn>
          </v-card>
      </template>
      </v-dialog> 

        <!--DIÁLOGO SOLICITAR CONTRASEÑA-->
       <v-dialog v-model="flagIntroducePass" persistent max-width="400">
                  <v-card >
                    <v-card-title class="justify-center">
                      INTRODUCE TU CONTRASEÑA
                    </v-card-title>
                    <v-card-text>
                      <v-form>
                        <v-text-field color="black" label="Contraseña" v-model= "passReautenticar" type="password" />
                      </v-form>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="red darken-1" text @click="reseteaFlags">Cancelar</v-btn>
                      <v-btn v-if="boolalta" color="green darken-1" text @click="reautenticarSuperUsuario(1)">Aceptar</v-btn>
                      <v-btn v-if="boolbaja" color="green darken-1" text @click="reautenticarSuperUsuario(2)">Aceptar</v-btn>
                    </v-card-actions>
                    <v-card-text>
                      <v-alert dense outlined type="error" v-if="error">
                        {{error}}
                      </v-alert>
                    </v-card-text>
                  </v-card>
                </v-dialog>

    <BarraLateralSuperUsu v-if = "rol==3"></BarraLateralSuperUsu>
    </v-container>
    </v-main>
</template>

<script>
import BarraLateralSuperUsu from '../../components/BarraLateralSuperUsu.vue'
import {getFirestore, collection, updateDoc,doc, deleteDoc, addDoc, where} from "firebase/firestore"
import firebaseApp from '../../scripts/firebase'
import { getAuth, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import {query, getDocs} from "firebase/firestore";
import { getFunctions } from "firebase/functions"
import { httpsCallable } from "firebase/functions";

//Esto es para poder llamar a las funciones del backend
const functions = getFunctions(firebaseApp);

 /** Vista encargada de mostrar todos los super usuarios de la aplicación, proporcionará también la posibilidad
  * de registrar y eliminar super usuarios del sistema
  * @public
  */

export default{
   data (){
      return{
        rol: this.$route.params.rol,

        error:"",
        //ESTAS SON LAS VARIABLES QUE SE ENCARGAN DE LOS USUARIOS
        flagMostrarTrabajadores:false,

        usuariosSeleccionados: [],
        superusuarios:[],
        headerUsuarios:[
          {text: 'Nombre',value: "Nombre"},
          {text: 'Apellidos', value: "Apellidos"},
          {text: 'Correo', value: "Correo"},
          {text: 'Rol', value: "ROL"}
        ],

        //Variables de la ficha
        nombreUsuario: "",
        apellidosUsuario: "",
        emailUsuario: "",
        rolUserUsuario: "",
        imgurlUsuario: "",
        
         opcionesUsuarios:[
          {title: 'Restablecer contraseña'},
          {title: 'Modificar'},
          {title: 'Dar de baja'},
        ],
        usuarioSeleccionado:false,
        flagmodificandousuario:false,
        flagRegistraSuperUsuario:false,
        flagexito:false,
        flagIntroducePass:false,

        boolalta:false,
        boolbaja:false,
        boolConfirmacionBaja:false,

        passReautenticar:"",
      }
    },
    components:{
      BarraLateralSuperUsu
    },
    methods:{
         /** Método encargado de comprobar si hay algún super usuario seleccionado de la lista
        * @public
        */
        compruebaUsuarios(){
            console.log("Entro comprueba");
            if(!this.flagmodificandousuario){
                if(this.usuariosSeleccionados[0]){
                    
                    this.usuarioSeleccionado=true;
                    this.GetDatosUsuario();
                }
                else{
                    this.usuarioSeleccionado=false;
                    this.nombreUsuario="";
                    this.apellidosUsuario="";
                    this.emailUsuario="";
                    this.rolUserUsuario="";
                    this.imgurlUsuario="";
                }
            }
      },
       /** Método encargado de dar de baja un super usuario del sistema, se llamará a la Cloud Functio correspondiente
        * y se eliminará posteriormente su información de la base de datos
        * @public
        */
      async darDeBajaSuperUsuario(){
            const firebaseDB= getFirestore(firebaseApp);

            const darDeBajaUsuario=httpsCallable(functions,"darDeBajaUsuario");
            darDeBajaUsuario({correo: this.usuariosSeleccionados[0].Correo}).then(async(result) => {
                console.log(result.data);

                //Después de dar de baja el usuario eliminamos todas sus referencias de la base de datos
                const consulta=query(collection(firebaseDB,"SuperUsuarios"),where("Correo", "==", this.usuariosSeleccionados[0].Correo));
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
       /** Método encargado de recuperar para mostrar la información correspondiente a un superusuario seleccionado
        * @public
        */
      async GetDatosUsuario(){
        const firebaseDB= getFirestore(firebaseApp);

        const consulta =  query(collection(firebaseDB, "SuperUsuarios"), where("Correo", "==", this.usuariosSeleccionados[0].Correo));
        const querySnapshot = await getDocs(consulta);
          querySnapshot.forEach((doc) => {
            this.nombreUsuario=doc.get("Nombre");
            this.apellidosUsuario=doc.get("Apellidos");
            this.emailUsuario=doc.get("Correo");
            this.rolUserUsuario=doc.get("ROL");
            this.imgurlUsuario=doc.get("URLImage");
          });
      },
       /** Método encargado de reautenticar a un super usuario por medio de su contraseña previamente a realizar
        * una alta o una baja de un super usuario dentro del sistema
        * @public
        * @param {Number} accion Nos indica si la acción que queremos realizar es un alta o una baja
        */
      async reautenticarSuperUsuario(accion){

            this.error="";
            var elError="";
            var exito=false;

            var auth=getAuth();
            var user = auth.currentUser;

            var credential=EmailAuthProvider.credential(user.email,this.passReautenticar);
           
            if(this.passReautenticar){
                //Reautenticamos al super usuario antes de poder establecer una contraseña
                await reauthenticateWithCredential(user,credential).then(async function() {
                    exito=true;
                }).catch(function(e){
                console.log(e);

                elError="La contraseña no es correcta";
                })

                //Darde alta
                if(exito && accion==1){
                    console.log("Contraseña correcta para ALTA");
                    //this.flagRegistraSuperUsuario=true;
                    this.$router.push('/registersuperusu/3');
                    this.flagIntroducePass=false;
                }else if(exito && accion==2){ //DAR DE BAJA AL USUARIO
                    console.log("Contraseña correcta para BAJA");

                    this.boolConfirmacionBaja=true;
                    this.flagIntroducePass=false;
                }
                else{
                    this.error=elError;
                }
            }else{
                this.error="Introduce la contraseña"
            }
      },
         /** Método encargado de controlar si vamos a realizar una alta o una baja
        * @public
        * @param {Number} opcion Parámetro de control
        */
        opcionBajaAlta(opcion){
          if(opcion==1){
            this.flagIntroducePass=true;
            this.boolalta=true;
            this.boolbaja=false;
          }
          else{ 
            if(this.usuariosSeleccionados[0]){
                this.flagIntroducePass=true;
                this.boolalta=false;
                this.boolbaja=true;
                console.log("PISTOLONES");
            }
          }
      },
       /** Método encargado de restablecer los flags
        * @public
        */
      reseteaFlags(){
          this.error="";
          this.flagexito=false;
          this.flagRegistraSuperUsuario=false;
          this.flagIntroducePass=false;
          this.boolalta=false;
          this.boolbaja=false;
          this.boolConfirmacionBaja=false;
      },
      /** Método encargado recuperar los usuarios que se encuentran registrados en la aplicación
        * @public
        */
      async recuperaSuperUsuarios(){
        const firebaseDB= getFirestore(firebaseApp);
        const consulta =  query(collection(firebaseDB, "SuperUsuarios"));
        const querySnapshot = await getDocs(consulta);
          querySnapshot.forEach((doc) => {
            this.superusuarios.push(doc.data());
          });
      },
       /** Método encargado de recargar la página para visualizar los cambios realizados
        * @public
       */
      recargaPagina(){
         location.reload();
      },
    },
    mounted(){
      this.recuperaSuperUsuarios()
    }
}
</script>
