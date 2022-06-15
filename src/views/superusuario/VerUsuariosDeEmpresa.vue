<template>
<v-main>
<v-container app>
    <div>
    <v-card class="grey lighten-2"> 
     <v-container>
      <v-card class="black">
        <v-img height="100" small  gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" class="white--text align-end" src="../../images/adornoTerminal.jpg"></v-img>
      </v-card>
        <v-card>USUARIOS DE LA EMPRESA</v-card>
        <v-data-table  v-model="seleccionados" :headers="headers" :items="usuarios" :single-select="true" item-key="Correo" class="elevation-1">
        <template v-slot:item.actions="{ item }">
          <v-icon medium class="mr-2" @click="VerUsuario(item)">mdi-eye</v-icon>
        </template>
        </v-data-table>
        <div class="py-3" />
          
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
              <v-btn color="green darken-1" text @click="restablecerPassUsuario">ACEPTAR</v-btn>
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


      <v-dialog width="700" v-model="flagmodificandousuario">
      <v-card>
         <v-card-title class="justify-center">MODIFICAR USUARIO</v-card-title>
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
                  <v-img align-center max-height="100" max-width="100" :src="imgurlUsuario"></v-img>
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

    </v-card>

    </div>


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

    <BarraLateralSuperUsu v-if = "rol==3"></BarraLateralSuperUsu>
    </v-container>
    </v-main>
</template>

<script>
  import BarraLateralSuperUsu from '../../components/BarraLateralSuperUsu.vue'
  import {getFirestore, collection, updateDoc,doc, deleteDoc, addDoc} from "firebase/firestore"
  import firebaseApp from '../../scripts/firebase'
  import { getAuth,sendPasswordResetEmail } from "firebase/auth";
  import {query, where, getDocs} from "firebase/firestore";
  import { getFunctions } from "firebase/functions"
  import { httpsCallable } from "firebase/functions";

//Esto es para poder llamar a las funciones del backend
const functions = getFunctions(firebaseApp);

 /** Vista que permite a los super usuarios acceder a una lista de los usuarios o trabajadores asociados a una
  * empresa determinada
  * @public
  */

  export default{
    data (){
      return{
        seleccionados: [],
        singleSelect: true,
        rol: this.$route.params.rol,
        idEmpresa: this.$route.params.idEmpresa,
        unoseleccionado:false,
        
        //Flas de control de los mensajes
        flagmodificapass:false,
        flagmodificauser:false,
        flagbajausuario: false,
        flagexito:false,
        flagbajaempresa:false,
        
        //ESTAS SON LAS VARIABLES QUE SE ENCARGAN DE LOS USUARIOS
        flagMostrarTrabajadores:false,
        usuariosSeleccionados: [],
        usuarios:[],
        headers:[
          {text: 'Nombre',value: "Nombre"},
          {text: 'Apellidos', value: "Apellidos"},
          {text: 'Correo', value: "Correo"},
          {text: 'Rol', value: "ROL"},
          {text: 'Ver usuario', value: "actions"}
        ],

        nombre:"",
        nombreUsuario: "",
        apellidosUsuario: "",
        emailUsuario: "",
        rolUserUsuario: "",
        empresaUsuario: "",
        imgurlUsuario: "",
        
        roles: "",
        nombreModifica: "",
        apellidosModifica: "",
        emailModifica: "",
        empresaModifica: "",
         opcionesUsuarios:[
          {title: 'Restablecer contraseña'},
          {title: 'Modificar'},
          {title: 'Dar de baja'},
        ],
        usuarioSeleccionado:false,
        flagmodificandousuario:false,
      }
      },
    components:{
      BarraLateralSuperUsu
    },
    methods:{
       /** Método encargado de restablecer el valor de los flags
        * @public
        */
      reseteaFlags(){
        this.flagmodificauser=false;
        this.flagbajausuario=false;
        this.flagexito=false;
        this.flagbajaempresa=false;
        this.flagmodificapass=false;
      },
       /** Método encargado de comprobar cual ha sido la opción seleccionada a realizar con un usuario, 
        * estás opciones serán: Restablecer su contraseña, modificar su información o darlo de baja.
        * @public
        * @param {Number} index Valor flag utilizado para seleccionar la acción en función de la opción seleccionada
        */
      itemSeleccionadoUsuarios(index){
        if(index==0){
          this.flagmodificapass=true;
          console.log("Queremos restablecer la contraseña")
        }else if(index==1){
          console.log("Queremos modificar el usuario")
          this.flagmodificandousuario=true;
          this.roles=this.rolUserUsuario;
          this.nombreModifica=this.nombreUsuario;
          this.apellidosModifica=this.apellidosUsuario;
          this.emailModifica=this.emailUsuario;
          this.empresaModifica=this.empresaUsuario;
        }
        else if(index==2){
          console.log("Queremos dar de baja el usuario")
          this.flagbajausuario=true;
        }
      },

      /** Método encargado de comprobar si existe algún usuario seleccionado
      * @public
      */
      compruebaUsuarios(){
        console.log("Entro comprueba");
        if(!this.flagmodificandousuario){
          if(this.usuariosSeleccionados[0]){
            //console.log("Tiene algo");
            this.usuarioSeleccionado=true;
            this.GetDatosUsuario();
          }
          else{
            //console.log("Esta vacio");
            this.usuarioSeleccionado=false;
            this.nombreUsuario="";
            this.apellidosUsuario="";
            this.emailUsuario="";
            this.imgurlUsuario="";
            this.rolUserUsuario="";
            this.empresaUsuario="";
          }
        }
      },
      /** Método encargado de recoger los datos de un usuario
      * @public
      */
      async GetDatosUsuario(){
          this.nombreUsuario=this.usuariosSeleccionados[0].Nombre;
          this.apellidosUsuario=this.usuariosSeleccionados[0].Apellidos;
          this.emailUsuario=this.usuariosSeleccionados[0].Correo;
          this.imgurlUsuario=this.usuariosSeleccionados[0].URLImage;
          this.rolUserUsuario=this.usuariosSeleccionados[0].ROL;
          this.empresaUsuario=this.nombre;
      },

      /** Método encargado de dar de baja a un usuario de la empresa
      * @public
      */
      async darDeBajaUsuario(){
        const firebaseDB= getFirestore(firebaseApp);
        const darDeBajaUsuario=httpsCallable(functions,"darDeBajaUsuario");
          darDeBajaUsuario({correo: this.usuariosSeleccionados[0].Correo}).then(async(result) => {
            console.log(result.data);

            //Después de dar de baja el usuario eliminamos todas sus referencias de la base de datos
            const consulta=query(collection(firebaseDB,"Trabajadores"),where("Correo", "==", this.usuariosSeleccionados[0].Correo));
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

      /** Método encargado de enviar un correo de restablecimiento de contraseña
        * @public
        */
      async restablecerPassUsuario(){
        console.log("PUMBA! SE ENVIÓ EL CORREO")
        await sendPasswordResetEmail(getAuth(),this.usuariosSeleccionados[0].Correo);
        this.flagmodificapass=false;
        this.flagexito=true;
      },

      /** Método encargado de modificar la información de un usuario
        * @public
      */
      async modificarUsuario(){
        const firebaseDB= getFirestore(firebaseApp);
       //COMPROBAMOS AQUI LAS variableModifica JUNTO CON LAS VARIABLES NORMALES PARA HACER SOLO LAS MODIFICACIONES NECESARIAS
        if(this.emailUsuario!=this.emailModifica){
        
          const darDeBajaUsuario=httpsCallable(functions,"modificaCorreoUsuario");
          darDeBajaUsuario({correo1: this.emailUsuario, correo2: this.emailModifica}).then(async(result) => {
            
          console.log("Se modificó el usuario con nuevo email: "+result.data)
          await sendPasswordResetEmail(getAuth(),this.emailModifica);
          });
       }
       //Ahora, esta parte se hará siempre, volver a introducir los datos actualizados en las base de datos
        const consulta =  query(collection(firebaseDB, "RolUser"), where("Correo", "==", this.emailUsuario));
        const querySnapshot = await getDocs(consulta);

          querySnapshot.forEach(async(doc) => {
            await updateDoc(doc.ref, {
            Correo:this.emailModifica,
            ROL: this.roles
          });
        });
        const consulta2 =  query(collection(firebaseDB, "Trabajadores"), where("Correo", "==", this.emailUsuario));
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
      /** Método encargado de devolvernos a la vista de la ficha de la empresa
        * @public
      */
      volverAEmpresas(){
        this.$router.push('/fichaempresa/3/'+this.idEmpresa);
      },

      /** Método encargado de recuperar todos los usuarios de la empresa
      * @public
      */
      async recuperaUsuariosPorIdEmpresa(){
        this.usuarios=[];
        this.nombreUsuario="";
        this.apellidosUsuario="";
        this.emailUsuario="";
        this.empresaUsuario="";
        this.rolUserUsuario="";
        console.log("El nombre"+this.nombreModifica);
        const firebaseDB= getFirestore(firebaseApp);
        const consulta =  query(collection(firebaseDB, "Trabajadores"), where("IdEmpresa", "==", this.idEmpresa));
        const querySnapshot = await getDocs(consulta);
        
        querySnapshot.forEach((doc) => {
          this.usuarios.push(doc.data());
        });
        this.flagMostrarTrabajadores=true;

        const consulta2 =  query(collection(firebaseDB, "Empresas"), where("IdEmpresa", "==", this.idEmpresa));
        const querySnapshot2 = await getDocs(consulta2);
          querySnapshot2.forEach((doc) => {
          this.nombre=doc.get("Nombre");
        });
      },
      /** Método encargado de acceder a la información de un empleado de la empresa
     * @public
     * @param {Object} usuario Objeto que contendrá información relevante que nos permitirá 
     * indentificar al usuario para poder recuperar su información posteriormente.
      */
      VerUsuario(usuario){
        console.log("usuario: "+usuario.Correo);
        this.$router.push('/verusuario/3/'+usuario.Correo);
      },
    },
    mounted(){
      this.recuperaUsuariosPorIdEmpresa();
    }
  }
</script>