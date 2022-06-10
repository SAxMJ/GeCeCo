<template>
   <v-container fluid fill-height>
      <v-layout align-center justify-center>
         <v-flex xs12 sm8 md4>
            <v-card elevation="24" shaped tile>
              <!--DIÁLOGO DE REGISTRO DE UN USUARIO PARA UNA EMPRESA-->

         <v-tabs dark color="primary">
            <v-tab>Registrar trabajador</v-tab>
                <v-tab-item>
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
            </v-tab-item>
          </v-tabs>
            </v-card>
         </v-flex>
      </v-layout>

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
   <BarraLateralAdmin v-if = "rol==2"></BarraLateralAdmin>
   <BarraLateralSuperUsu v-if = "rol==3"></BarraLateralSuperUsu>
   </v-container>
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
      }
   },
   components:{
      BarraLateralAdmin,
      BarraLateralSuperUsu
    },
    name: 'Registro',
    methods:{
        async registraTrabajador(){
            
            this.error='';
            var password=generarPassword();

            const firebaseDB= getFirestore(firebaseApp);

            if(this.nombreReg && this.apellidosReg && this.correoReg && password && this.rolregistro){
               this.error=''; //Limpiamos el mensaje de error

               const registrarTrabajador=httpsCallable(functions,"registrarTrabajador");
               registrarTrabajador({usuario: this.correoReg, pass: password}).then(async(resultado)=> {
         
                     console.log("ELUIDDDD es "+resultado.data);
                     await sendPasswordResetEmail(getAuth(),this.correoReg);
                     //UNA VEZ EL USUARIO HA SIDO REGISTRADO LE ASIGNAMOS UN ROL Y LO AÑADIMOS A LA TABLA DE RolUser
                      try {
                        const docRef =  await addDoc(collection(firebaseDB, "RolUser"), {
                           ROL: this.rolregistro,
                           UID: resultado.data,
                           Correo:this.correoReg
                        });
                        } catch (e) {
                        }
               });
            
            //Ahora lo que haremos será obtener el ID de la empresa correspondiente al administrador para asginarselo al nuevo registrado
            //ya que un administrador solo puede registrar trabajadores para su empresa.
            const auth = getAuth();
            const consulta =  query(collection(firebaseDB, "Trabajadores"), where("UID", "==", auth.currentUser.uid));

            try{
               await IdEmpresaAdminYAddTrabajador(firebaseDB,consulta,this.nombreReg,this.apellidosReg,this.correoReg,this.rolregistro);
               this.flagexito=true;
            }catch(e){
               console.log("ERROR: "+e);
            }

            }
            else{
               this.error='Faltan datos por añadir al formulario'
            }
            
        },
        recargaPagina(){
           location.reload();
        }
    }
})



  //FUNCIONES

   //Función encargada de generar una contraseña de 10 caracteres aleatorios
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

   //Función que obtiene el Id empresa del admin y registra al trabajador en la base de datos
   async function IdEmpresaAdminYAddTrabajador(firebaseDB,consulta,nombre,apellidos,correo,rol){

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
                  URLImage: url
               });
               } catch (e) {
               }
         });
      });
   }

</script>
