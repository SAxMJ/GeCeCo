<template>
<div>
<v-container app>
  
 <!--DIÁLOGO MENSAJE DE ÉXITO-->
    <v-dialog width="500" v-model="flagexito">
      <template>
          <v-card>
              <v-card-title class="justify-center">
                HECHO
              </v-card-title>
              <v-card-text>
                Se modificó la contraseña correctamente
              </v-card-text>
              <v-btn color="green darken-1" text @click="flagexito=false">ACEPTAR</v-btn>
          </v-card>
      </template>
      </v-dialog> 

  <v-dialog width="500" v-model="cambiarimagen">
      <template>
          <v-card>
              <v-card-title>
                Selecciona una imagen y pulsa subir
              </v-card-title>
              <v-card-text>
                <input @change="imagenSeleccionada($event)" type="file" accept="image/*">
              </v-card-text>
              <v-btn color="red darken-1" text @click="cambiarimagen = false">Cancelar</v-btn>
              <v-btn color="green darken-1" text @click="subirImagen"><input type="submit" value="SUBIR"></v-btn>
          </v-card>
      </template>
  </v-dialog>
<v-main>
<v-container class="grey lighten-2">
<v-card>MI USUARIO</v-card>
<v-container id="user-profile-view" fluid tag="section">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card icon="mdi-account-outline" >  
          <v-card class="black">{{GetDatosUsuario}}</v-card>
          <v-form>
            <v-container class="py-0">
              <v-row>
                <v-col cols="12" md="4" >
                  <v-text-field color="black" label="Nombre" v-model= "nombre" readonly />
                </v-col> 
                <v-col cols="12" md="4">
                  <v-text-field color="black" label="Apellidos" v-model= "apellidos" readonly />
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

              <v-row justify="center">
                <v-dialog v-model="boolCambiaPass" persistent max-width="400">
                  <v-card >
                    <v-card-title class="justify-center">
                      Cambiar contraseña
                    </v-card-title>
                    <v-card-text>
                      <v-form>
                        <v-text-field color="black" label="Anterior contraseña" v-model= "passAntigua" type="password" />
                        <v-text-field color="black" label="Nueva contraseña" v-model= "passNueva" type="password" />
                      </v-form>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="red darken-1" text @click="boolCambiaPass = false">Cancelar</v-btn>
                      <v-btn color="green darken-1" text @click="dialog = true">Restablecer</v-btn>
                    </v-card-actions>
                    <v-card-text>
                      <v-alert dense outlined type="error" v-if="error">
                        {{error}}
                      </v-alert>
                    </v-card-text>
                  </v-card>
                </v-dialog>

                <v-dialog v-model="dialog" persistent max-width="290">
                  <v-card align-content-center>
                    <v-card-title class="text-h5">
                      ¿Estás seguro?
                    </v-card-title>
                    <v-card-text>Se restablecerá tu contraseña</v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="red darken-1" text @click="dialog = false">Cancelar</v-btn>
                      <v-btn color="green darken-1" text @click="restablecePass">Restablecer</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>

              </v-row>
            </v-container>
          </v-form>
        </v-card>
      </v-col>

      <v-col cols="12" md="4" >
        <v-card class="mt-4 text-center">
          <v-card class="black">a</v-card>
          <v-img class="rounded-circle elevation-6 mt-n12 d-inline-block" :src="fotourl" width="128" />
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
            
            <v-card-text class="text-center">
            <h6 class="text-h6 mb-2 text--secondary">
              {{apellidos}}
            </h6>
            <h4 class="text-h4 mb-3 text--primary">
              {{nombre}}
            </h4>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    </v-container>
   
    <BarraLateral v-if = "rol==1"></BarraLateral>
    <BarraLateralAdmin v-if = "rol==2"></BarraLateralAdmin>
    <BarraLateralSuperUsu v-if = "rol==3"></BarraLateralSuperUsu>
    </v-container> 
    
    </v-main>
  </v-container>

  </div>
</template>

<script>
  
  import BarraLateral from '../../components/BarraLateralNormal.vue'
  import BarraLateralAdmin from '../../components/BarraLateralAdmin.vue'
  import BarraLateralSuperUsu from '../../components/BarraLateralSuperUsu.vue'
  import {getFirestore, collection, addDoc,updateDoc} from "firebase/firestore"
  import {query, where, getDocs, onSnapshot  } from "firebase/firestore";
  import firebaseApp from '../../scripts/firebase';
  import { getAuth, sendPasswordResetEmail, updateProfile, reauthenticateWithCredential, updatePassword, EmailAuthProvider, } from "firebase/auth";
  import { getStorage, ref, getDownloadURL,uploadBytes } from "firebase/storage";
  import { getApp } from "firebase/app";
  import { getFunctions, connectFunctionsEmulator } from "firebase/functions"
  import { httpsCallable } from "firebase/functions";

//Esto es para poder llamar a las funciones del backend
const functions = getFunctions(getApp());
connectFunctionsEmulator(functions, "localhost", 5001);


  export default{
    data (){
      return{
        fotourl:"",
        dialog: false,
        rol: this.$route.params.rol,
        nombre:"",
        email:"",
        apellidos:"",
        empresa:"",
        rolUser:"",
        opciones:[
          {title: 'Cambiar foto'},
          {title: 'Restablecer contraseña'}
        ],
        cambiarimagen:'',
        imagenSel: null,

        boolCambiaPass:false,
        flagmodificimagen:false,
        flagmodificapass:false,
        flagexito:false,
        passAntigua:'',
        passNueva:'',
        error:'',

      }
      },
    components:{
      BarraLateral,
      BarraLateralAdmin,
      BarraLateralSuperUsu
    },
    computed:{
      //Obtenemos los datos del ususario de firestore
      async GetDatosUsuario(){
        var auth = getAuth();
        const firebaseDB= getFirestore(firebaseApp);
        var codEmp;

        if(this.rol!=3){ //Es un administrador o un usuario normal
          //Buscamos el nombre, apellidos, email y empresas
          const consulta =  query(collection(firebaseDB, "Trabajadores"), where("Correo", "==", auth.currentUser.email));
          const querySnapshot = await getDocs(consulta);
          querySnapshot.forEach((doc) => {
            this.nombre=doc.get("Nombre");
            this.apellidos=doc.get("Apellidos");
            this.email=doc.get("Correo");
            codEmp=doc.get("IdEmpresa")
          });

          //Buscamos el rol
          const consulta2 =  query(collection(firebaseDB, "RolUser"), where("UID", "==", auth.currentUser.uid));
          const querySnapshot2 = await getDocs(consulta2);
          querySnapshot2.forEach((doc) => {
            this.rolUser=doc.get("ROL");
          });

          //Buscamos el nombre de la empresa
          const consulta3 =  query(collection(firebaseDB, "Empresas"), where("IdEmpresa", "==", codEmp));
          const querySnapshot3 = await getDocs(consulta3);
          querySnapshot3.forEach((doc) => {
            this.empresa=doc.get("Nombre");
          });
        }
        else{//Es un super usuario
          //Buscamos el nombre, apellidos, email y empresas
          const consulta =  query(collection(firebaseDB, "SuperUsuarios"), where("Correo", "==", auth.currentUser.email));
          const querySnapshot = await getDocs(consulta);
          querySnapshot.forEach((doc) => {
            this.nombre=doc.get("Nombre");
            this.apellidos=doc.get("Apellidos");
            this.email=doc.get("Correo");
            this.rolUser="SuperUsu";
            this.empresa="GECECO"
          });
        }
          //AHORA CARGAMOS LO REFERENTE A LA IMÁGEN DE PERFIL
          
          var photo;
          var user=auth.currentUser;

          if(user.photoURL){
            photo = "FotosDeUsuarios/"+user.uid;
          }else{
            photo = "porDefecto.png"
          }

          //Vamos a recuperar la foto de perfil correspondiente al usuario
          const storage = getStorage();
          const imagesRef = ref(storage, photo);

          //Con esta función obtenemos la url
          await getDownloadURL(imagesRef).then((url)=>{
            this.fotourl=url;
          });

      }
    },
    methods:{
      itemSeleccionado(index){
        if(index==0){
          this.cambiarFotoPerfil();
        }else if(index==1){
          this.boolCambiaPass=true;
        }
      },
        async restablecePass(){

          var auth=getAuth();
          var user = auth.currentUser;
          var credential
          var exito=false;
          var newpass;
          var errorcont;

          this.error='';

          if(this.passAntigua && this.passNueva){
             console.log("Son: "+this.passAntigua + 'y'+ this.passNueva)

            credential=EmailAuthProvider.credential(user.email,this.passAntigua);
            newpass=this.passNueva;
             await reauthenticateWithCredential(user,credential).then(async function() {
              // User re-authenticated.
              await updatePassword(user,newpass).then(function() {
                    
                  console.log("La contraseña se modificó correctamente");
                  exito=true;
                })
                .catch(function(e) {
                    console.log("An error occurred while changing the password:",error);
                    errorcont="Error al cambiar la contraseña";
                });
            }).catch(function(e){
              console.log(e);
              //this.error = "La pass no es correcta";
              //this.error='La contraseña introducida es incorrecta';
              errorcont="La contraseña antigua no es correcta";
            })
          }else{
            errorcont = 'Introduce ambas contraseñas'
            this.dialog=false;
          }
          if(exito){
            this.boolCambiaPass=false;
            this.dialog=false;
            this.flagexito=true;
          }else{
            this.dialog=false;
            this.error=errorcont;
          }
        },

        imagenSeleccionada(evento){
          this.imagenSel=evento.target.files[0];
          console.log(this.imagenSel);
        },

        async subirImagen(){
          
          if(!this.imagenSel){
            return;
          }
          var auth=getAuth();
          const storage=getStorage();
          const storageRef=ref(storage,'FotosDeUsuarios/'+auth.currentUser.uid);
          uploadBytes(storageRef, this.imagenSel).then((snapshot) => {
            console.log('La foto se subió con éxito');
          });
          //Ahora vamos a obtener la url de la imagen que acabamos de subir para asocuar esa url al photourl
          var photo = "FotosDeUsuarios/"+auth.currentUser.uid;
           
          //Vamos a recuperar la foto de perfil correspondiente al usuario
          const imagesRef = ref(storage, photo);

          //Con esta función obtenemos la url
          await getDownloadURL(imagesRef).then((url)=>{
            updateProfile(auth.currentUser, {
            photoURL: url
          }).then(() => {
            console.log('Se actualizó la URLPhoto');
            this.actualizarImagenEnBaseDeDatos(url);
            
          }).catch((error) => {
            console.log(error);
          });
          
          });
        
        },

        cambiarFotoPerfil(){
          this.cambiarimagen=true
        },

        async actualizarImagenEnBaseDeDatos(url){
          const firebaseDB= getFirestore(firebaseApp);
          const consulta =  query(collection(firebaseDB, "Trabajadores"), where("Correo", "==", this.email));
          const querySnapshot = await getDocs(consulta);

           querySnapshot.forEach(async(doc) => {
            await updateDoc(doc.ref, {
            URLImage:url
          });
           location.reload();
        });
          
        }
    }
}
</script>
