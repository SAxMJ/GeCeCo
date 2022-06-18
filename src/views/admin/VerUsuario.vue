<template>
<v-main>
<v-container app>
<v-card>
<v-container class="grey lighten-4">
  <v-card class="blue lighten-3">FICHA DE USUARIO</v-card>
    <v-container id="user-profile-view" fluid tag="section">
        <v-card icon="mdi-account-outline">
          <v-card class="black">.</v-card>
          <v-form>
            <v-container class="py-0">
              <v-row align-content-center>
                <v-col cols="12" md="4" >
                  <v-text-field color="black" label="Nombre" v-model= "nombre" readonly />
                </v-col> 

                <v-col cols="12" md="4">
                  <v-text-field color="black" label="Apellidos" v-model= "apellidos" readonly />
                </v-col>

                <v-col cols="12" md="4">
                  <v-img class="rounded-circle elevation-6 mt-n1 d-inline-block" :src="imgurl" width="128"></v-img>
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
                  <v-text-field color="black" label="Email" v-model= "email" readonly=false />
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
                <v-text>Se grabarán los cambios realizados al usuario</v-text>
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

      <!--DIÁLOGO DE MODIFICACION DE UN USUARIO PARA UNA EMPRESA-->
      <v-dialog width="700" v-model="flagmodificandousuario">
      <v-card>
        <v-card-title>MODIFICAR TRABAJADOR</v-card-title>
        <v-card-text>
          <v-form>
            <v-container class="py-0">
              <v-row align-content-center>
                <v-col cols="12" md="4" >
                  <v-text-field color="black" label="Nombre" v-model= "nombreModifica" :readonly=false required/>
                </v-col> 

                <v-col cols="12" md="4">
                  <v-text-field color="black" label="Apellidos" v-model= "apellidosModifica" :readonly=false required/>
                </v-col>

                <v-col align-content-space- cols="12" md="4">
                  <v-img align-center max-height="100" max-width="100" :src="imgurl"></v-img>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field color="black" label="Email" v-model= "emailModifica" :readonly=false required />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field color="black" label="Empresa" v-model= "empresaModifica" readonly required/>
                </v-col>

                <v-radio-group v-model="roles">
                  <v-radio label="Admin" value="Admin">
                  </v-radio>
                  <v-radio label="Trabajador" value="Trabajador">
                  </v-radio>
              </v-radio-group>

                <v-col cols="12" class="text-right">
                </v-col>
              </v-row>
            </v-container>
          </v-form>
          </v-card-text>
       </v-card>
       <v-card>
        <v-btn color="green darken-1" text @click="flagmodificauser=true">Guardar cambios</v-btn> 
       </v-card>
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
              <v-btn color="green darken-1" text @click="recargarPagina">ACEPTAR</v-btn>
          </v-card>
      </template>
      </v-dialog> 
      </v-container>
        <BarraLateralAdmin v-if = "rol==2"></BarraLateralAdmin>
        <BarraLateralSuperUsu v-if = "rol==3"></BarraLateralSuperUsu>
        
      </v-container>
      </v-card>
      </v-container>
      </v-main>
</template>

<script>
  
  import BarraLateralAdmin from '../../components/BarraLateralAdmin.vue'
  import BarraLateralSuperUsu from '../../components/BarraLateralSuperUsu.vue'
  import {getFirestore, collection, updateDoc,doc, deleteDoc} from "firebase/firestore"
  import firebaseApp from '../../scripts/firebase'
  import { getAuth,sendPasswordResetEmail } from "firebase/auth";
  import {query, where, getDocs} from "firebase/firestore";
  import { getFunctions } from "firebase/functions"
  import { httpsCallable } from "firebase/functions";


  var rolUsr=1;
  console.log("Es--> " +rolUsr);
  
  const functions = getFunctions(firebaseApp);

  const firebaseDB= getFirestore(firebaseApp);
/** Ventana donde se muestra la información completa sobre un trabajador, así como diferentes opciones 
* como darlo de baja, modificar su información o restablecer su contraseña
* @public
*/

  export default{
    data (){
      return{
        rol: this.$route.params.rol,
        correoUsuario: this.$route.params.correoUsuario,
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

        roles: "",
        nombreModifica: "",
        apellidosModifica: "",
        emailModifica: "",
        rolUserModifica: "",
        empresaModifica: "",

        flaginicio: false,
        flagmodificapass:false,
        flagmodificauser:false,
        flagbajausuario: false,
        flagexito:false,
        flagmodificandousuario:false,
        flagregistrausuario:false,
      }
      },
    components:{
      BarraLateralAdmin,
      BarraLateralSuperUsu
    }, 
    methods:{
        /** Método encargado de comprobar cual ha sido la opción seleccionada realizar con el usuario, 
         * estás opciones serán: Restablecer contraseña, modificar el usuario o darlo de baja.
        * @public
        * @param {Number} index Valor flag utilizado para seleccionar la acción en función de la opción seleccionada
        */
        itemSeleccionado(index){
        if(index==0){
          this.flagmodificapass=true;
          console.log("Queremos restablecer la contraseña")
        }else if(index==1){
          console.log("Queremos modificar el usuario")
          this.flagmodificandousuario=true;
          this.roles=this.rolUser;
          this.nombreModifica=this.nombre;
          this.apellidosModifica=this.apellidos;
          this.emailModifica=this.email;
          this.empresaModifica=this.empresa;
        }
        else if(index==2){
          console.log("Queremos dar de baja el usuario")
          this.flagbajausuario=true;
          this.flagmodificapasshecho=true;
        }
      },
      /** Método encargado de enviar un correo de restablecimiento de contraseña al usuario correspondiente
      * @public
      */
      async restablecerPass(){
        console.log("PUMBA! SE ENVIÓ EL CORREO")
        await sendPasswordResetEmail(getAuth(),this.email);
        this.flagmodificapass=false;
        this.flagexito=true;
      },
      /** Método encargado de modificar la información correspondiente al usuario, se llamará a la Cloud Function
      * que modifica el correo del usuario en el caso de que sea necesario.
      * Posteriormente estos cambios serán también actualizados en las bases de datos correspondientes
      * @public
      */
      async modificarUsuario(){
        const firebaseDB= getFirestore(firebaseApp);
       //COMPROBAMOS AQUI LAS variableModifica JUNTO CON LAS VARIABLES NORMALES PARA HACER SOLO LAS MODIFICACIONES NECESARIAS
        if(this.email!=this.emailModifica){
        
          const modificaCorreoUsuario=httpsCallable(functions,"modificaCorreoUsuario");
          modificaCorreoUsuario({correo1: this.email, correo2: this.emailModifica}).then(async(result) => {
            
          console.log("Se modificó el usuario con nuevo email: "+result.data)
          await sendPasswordResetEmail(getAuth(),this.emailModifica);
          });
       }
       //Ahora, esta parte se hará siempre, volver a introducir los datos actualizados en las base de datos
        const consulta =  query(collection(firebaseDB, "RolUser"), where("Correo", "==", this.email));
        const querySnapshot = await getDocs(consulta);

          querySnapshot.forEach(async(doc) => {
            await updateDoc(doc.ref, {
            Correo:this.emailModifica,
            ROL: this.roles
          });
        });
        const consulta2 =  query(collection(firebaseDB, "Trabajadores"), where("Correo", "==", this.email));
        const querySnapshot2 = await getDocs(consulta2);

          querySnapshot2.forEach(async(doc) => {
            await updateDoc(doc.ref, {
            Correo:this.emailModifica,
            ROL: this.roles,
            Nombre: this.nombreModifica,
            Apellidos: this.apellidosModifica
          });

          this.flagexito=true;
        });
      },
      /** Método encargado de dar de baja a un usuario, para ello se llamará a la Cloud Function correspondiente
      * y posteriormente se eliminarán sus registros correspondientes de las bases de datos.
      * @public
      */
      async darDeBajaUsuario(){
        const firebaseDB= getFirestore(firebaseApp);
        //const darDeBajaUsuario=httpsCallable(functions,"darDeBajaUsuario");
        //darDeBajaUsuario({correo: this.email}).then(async(result) => {
        const darDeBajaUsuario=httpsCallable(functions,"darDeBajaUsuario");
          darDeBajaUsuario({correo: this.email}).then(async(result) => {
            console.log(result.data);

            //Después de dar de baja el usuario eliminamos todas sus referencias de la base de datos
            const consulta=query(collection(firebaseDB,"Trabajadores"),where("Correo", "==", this.email));
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
        }).catch((error)=>{
            console.log("ERROR al eliminar usuario "+this.email+": "+error);
        });
      },
      /** Método encargado de recargar la página tras una actualización para que se muestren los cambios
      * @public
      */ 
      async recargarPagina(){
        if(this.rol==2)
          this.$router.push('/usuarios/2');

        if(this.rol==3){
          const q = query(collection(firebaseDB, "Empresas"), where("Nombre", "==", this.empresa));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            this.idEmpresa=doc.get("IdEmpresa")
          });
          this.$router.push('/verusuariosdeempresa/3/'+this.idEmpresa);
        }
      },
      /** Método encargado de restablecer los flag con los que trabajan los diferentes diálogos de la ventana
      * @public
      */ 
      reseteaFlags(){
        this.flagmodificapass=false;
        this.flagmodificauser=false;
        this.flagbajausuario=false;
        this.flagexito=false;
      },
        /**Método encargado de recuperar la información correspondeinte al usuario que se solicita
         * @public
         */
        async GetDatosUsuario(){
        const firebaseDB= getFirestore(firebaseApp);
        var codEmp;

        //Buscamos el nombre, apellidos, email y empresas
        const consulta =  query(collection(firebaseDB, "Trabajadores"), where("Correo", "==", ""+this.$route.params.correoUsuario));
        const querySnapshot = await getDocs(consulta);
          querySnapshot.forEach(async(doc) => {
            this.nombre=doc.get("Nombre");
            this.apellidos=doc.get("Apellidos");
            this.email=doc.get("Correo");
            this.imgurl=doc.get("URLImage");
            this.rolUser=doc.get("ROL");
            codEmp=doc.get("IdEmpresa")
          });
            console.log("El codemp "+this.img+"y "+this.$route.params.correoUsuario);
          //Buscamos el nombre de la empresa
          const consulta3 =  query(collection(firebaseDB, "Empresas"), where("IdEmpresa", "==", codEmp));
          const querySnapshot3 = await getDocs(consulta3);
          querySnapshot3.forEach((doc) => {
            this.empresa=doc.get("Nombre");
          });
        },
    },
    mounted(){
      this.GetDatosUsuario();
    }
  }
</script>