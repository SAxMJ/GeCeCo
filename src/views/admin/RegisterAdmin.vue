<template>
   <v-main>
       <div>
        <v-container class="grey lighten-4">

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
                          <v-card-text  class="text-h5 font-weight-bold white--text">REGISTRO DE TRABAJADOR</v-card-text>
                      </v-card>
                  </v-col>
                  <v-col cols="12" lg="1" md="1" class="transparent fill-height d-flex flex-column justify-center align-center">
                      <v-card class="transparent" flat tile>
                      </v-card>
                  </v-col>
                  <v-col cols="12" lg="1" md="1" class="transparent fill-height d-flex flex-column justify-center align-center">
                  </v-col>
              </v-row>
            </v-img>
        </v-container>

         <v-card elevation="24" shaped tile>
            <!--DIÁLOGO DE REGISTRO DE UN USUARIO PARA UNA EMPRESA-->
                <v-card>
                  <v-card-text>
                    <form>
                      <v-text-field v-model="nombreReg" name="user" label="Nombre" type="text" placeholder="Nombre" required></v-text-field>
                      <v-text-field v-model="apellidosReg" name="ape" label="Apellidos" type="text" placeholder="Apellidos" required></v-text-field>
                      <v-text-field v-model="correoReg" name="user" label="Correo electrónico" type="email" placeholder="Correo electrónico" required></v-text-field>
                      <v-radio-group v-model="rolregistro" required>
                          <v-radio label="TRABAJADOR" value="Trabajador"></v-radio>
                          <v-radio label="ADMINISTRADOR" value="Admin"></v-radio>
                      </v-radio-group>
                    <v-btn  @click="registraTrabajador" class="mt-4"  dark color="secondary" value="registerUsu">Registrar</v-btn>
                    </form>
                  </v-card-text>
                  <v-card-text>
                    <v-alert dense outlined type="error" v-if="error">
                      {{error}}
                    </v-alert>
                  </v-card-text>
                </v-card>
            </v-card>
         
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

      <!--DIÁLOGO MENSAJE DE ERROR-->
      <v-dialog width="500" v-model="boolExistente">
      <template>
          <v-card>
              <v-card-title class="justify-center">
                <v-alert dense outlined type="error">ERROR</v-alert>
              </v-card-title>
              <v-card-text>
                  <v-text >Ya existe un usuario con este email asociado</v-text>

              </v-card-text>
              <v-btn color="red darken-1" text @click="boolExistente=false">ACEPTAR</v-btn>
          </v-card>
      </template>
      </v-dialog> 

   <BarraLateralAdmin v-if = "rol==2"></BarraLateralAdmin>
   <BarraLateralSuperUsu v-if = "rol==3"></BarraLateralSuperUsu>
    
   </v-container>
   </div>
   </v-main>
</template>

<script>
import BarraLateralAdmin from '../../components/BarraLateralAdmin.vue'
import BarraLateralSuperUsu from '../../components/BarraLateralSuperUsu.vue'
import { getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail} from "firebase/auth";
import {getFirestore, collection, addDoc} from "firebase/firestore"
import firebaseApp from '../../scripts/firebase';
import {query, where, getDocs, onSnapshot  } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { getApp } from "firebase/app";
import { getFunctions } from "firebase/functions"
import { getDownloadURL, getStorage, ref } from '@firebase/storage';

const functions = getFunctions(firebaseApp);

/** Ventana que proporciona a los Administradores de las empresas, dar de alta nuevos epleados, ya sean otros Administradores
 * o empleados normales.
 * @displayName RegisterAdmin
 * @public
 */
export default({
   data(){
      return{
         rol: this.$route.params.rol,
                 nombreReg: '',
         apellidosReg: '',
         correoReg: '',
         error: '',
         rolregistro:'',
         flagexito:false,
         boolExistente:false,
      }
   },
   components:{
      BarraLateralAdmin,
      BarraLateralSuperUsu
    },
    name: 'Registro',
    methods:{
         /** Método encargado de realizar la llamada a la Cloud Function correspondiente encargada de 
         * registrar un usuario y posteriormente de añadir los registros necesarios en base de datos.
         * También se enviará un correo de restablecimiento de contraseña para que el usuario pueda
         * establecer una contraseña.
         * @public
         */
        async registraTrabajador(){
            
            this.error='';
            var password=generarPassword();

            const firebaseDB= getFirestore(firebaseApp);

            if(this.nombreReg && this.apellidosReg && this.correoReg && password && this.rolregistro){
               this.error=''; //Limpiamos el mensaje de error

               const registrarTrabajador=httpsCallable(functions,"registrarTrabajador");
               registrarTrabajador({usuario: this.correoReg, pass: password}).then(async(resultado)=> {
                     console.log("Resultado: "+resultado.data)
                     if(resultado.data != "0"){
                        console.log("ELUIDDDD es "+resultado.data);
                        //await sendPasswordResetEmail(getAuth(),this.correoReg);
                        //UNA VEZ EL USUARIO HA SIDO REGISTRADO LE ASIGNAMOS UN ROL Y LO AÑADIMOS A LA TABLA DE RolUser
                        try {
                           const docRef =  await addDoc(collection(firebaseDB, "RolUser"), {
                              ROL: this.rolregistro,
                              UID: resultado.data,
                              Correo:this.correoReg
                           });

                            //Ahora lo que haremos será obtener el ID de la empresa correspondiente al administrador para asginarselo al nuevo registrado
                           //ya que un administrador solo puede registrar trabajadores para su empresa.
                           const auth = getAuth();
                           const consulta =  query(collection(firebaseDB, "Trabajadores"), where("UID", "==", auth.currentUser.uid));

                           try{
                              await IdEmpresaAdminYAddTrabajador(resultado.data, firebaseDB, consulta, this.nombreReg, this.apellidosReg, this.correoReg, this.rolregistro);
                              this.flagexito=true;
                           }catch(e){
                              console.log("ERROR: "+e);
                           }

                        } catch (e) {
                           }
                     }else{
                        this.boolExistente=true;
                     }
               });
            
            }
            else{
               this.error='Faltan datos por añadir al formulario'
            }
            
        },
        /** Método encargado de recargar la página tras el registro del nuevo empleado
         * @public
         */
        recargaPagina(){
           location.reload();
        }
    }
})



   /** Función encargada de generar contraseñas aleatorias durante el registro de un nuevo usuario para asociarla
   * a su cuenta
   * @public
   */
   function generarPassword() {
      const longitud = 10;
      const caracteres = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

      var cadena = "";
      var max = caracteres.length-1;
      for (var i = 0; i<longitud; i++) {
          cadena += caracteres[ Math.floor(Math.random() * (max+1)) ];
      }

      return cadena;
   }

   
   /** Función encargada de obtener el ID de un nuevo trabajador creado y añadir su información a la base de datos
   * @public
   */
   async function IdEmpresaAdminYAddTrabajador(uid,firebaseDB,consulta,nombre,apellidos,correo,rol){
      
      const querySnapshot = await getDocs(consulta);
      const storage=getStorage();
     
      var imagesRef=ref(storage,'porDefecto.png');
      await getDownloadURL(imagesRef).then(async(url)=>{
         querySnapshot.forEach((doc) => {
            //Ahora una vez que tenemos el documento del administrador, le crearemos un documento para el nuevo trabajador
            //con el id de la empresa del administrador
            try {
               const docRef =  addDoc(collection(firebaseDB, "Trabajadores"), {
                  Nombre: nombre,
                  Apellidos: apellidos,
                  Correo: correo,
                  IdEmpresa: doc.get("IdEmpresa"),
                  ROL: rol,
                  URLImage: url,
                  UID: uid
               });
               } catch (e) {
                  console.log("ERROR: "+e);
               }
         });
      });
   }

</script>
