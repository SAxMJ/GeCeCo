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
                          <v-card-text  class="text-h5 font-weight-bold white--text">REGISTRO DE EMPRESA</v-card-text>
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
                <v-tabs v-model='tab' dark color="primary">
                  <v-tab href='#tabempresa'>Registrar empresa</v-tab>
                     <v-tab-item value='tabempresa'>
                        <v-card-text>
                    <form>
                        <v-text-field
                        v-model="nombreEmp"
                        name="nombEmp"
                        label="Nombre"
                        type="text"
                        placeholder="Nombre de la empresa"
                        required
                        ></v-text-field>

                        <v-text-field
                        v-model="direccion"
                        name="dirEmp"
                        label="Dirección"
                        type="text"
                        placeholder="Dirección de la empresa"
                        required
                        ></v-text-field>

                        <v-text-field
                        v-model="localidad"
                        name="locali"
                        label="Localidad"
                        type="text"
                        placeholder="Localidad de la empresa"
                        required
                        ></v-text-field>

                        <v-text-field
                        v-model="cp"
                        name="cp"
                        label="CP"
                        type="text"
                        placeholder="CP de la empresa"
                        required
                        ></v-text-field>

                        <v-text-field
                        v-model="dedicacion"
                        name="dedic"
                        label="Dedicación"
                        type="text"
                        placeholder="Actividades de la empresa"
                        required
                        ></v-text-field>

                        <v-card>
                            <v-card-text>
                                Subir logo (Opcional)
                            </v-card-text>
                            <v-card-text>
                                <input @change="imagenSeleccionada($event)" type="file" accept="image/*">
                            </v-card-text>
                            <v-card-text >
                                <v-btn color="green darken-1" text @click="subirImagen"><input value="SUBIR"></v-btn>
                            </v-card-text>
                        </v-card>

                        <v-btn @click="nextTab" class="mt-4" dark color="secondary" value="registerEmp">Siguinte</v-btn>
                    </form>
                </v-card-text>
                </v-tab-item>

                    <v-tab href='#tabadmin'>Registrar administrador</v-tab>
                     <v-tab-item value='tabadmin'>
                     <v-card>
                        <v-card-text>
                           <form>
                              <v-text-field
                                    v-model="nombre"
                                    name="user"
                                    label="Nombre"
                                    type="text"
                                    placeholder="Nombre"
                                    required
                              ></v-text-field>
                              <v-text-field
                                 v-model="apellidos"
                                 name="ape"
                                 label="Apellidos"
                                 type="text"
                                 placeholder="Apellidos"
                                 required
                              ></v-text-field>

                              <v-text-field
                                 v-model="correo"
                                 name="user"
                                 label="Correo electrónico"
                                 type="email"
                                 placeholder="Correo electrónico"
                                 required
                              ></v-text-field>
                           <v-btn  @click="abreConfirmacion" class="mt-4"  dark color="secondary" value="registerUsu">Register</v-btn>
                           </form>
                        </v-card-text>
                     </v-card>
                  </v-tab-item>
                 </v-tabs>
                </v-card>
                <v-card>
                <v-card-text class="trasparent">
                <v-alert dense outlined type="error" v-if="error">
                        {{error}}
                </v-alert>
                </v-card-text>
                <v-card-text>Introduce los datos de la empresa</v-card-text>
                <v-card-text>(Al registrar una empresa deberás registrar tambien  un administrador)</v-card-text>  
            </v-card>
                

        <!--DIÁLOGO DE CONFIRMACIÓN DE BAJA DE USUARIO-->
      <v-dialog width="500" v-model="flagregistraempresa">
      <template>
          <v-card>
              <v-card-title class="justify-center">
                <v-text>¿Estás seguro?</v-text>
              </v-card-title>
              <v-card-text>
                <v-text>Se registrará la empresa y el administrador en el sistema</v-text>
              </v-card-text>
              <v-btn color="red darken-1" text @click="flagregistraempresa=false">CANCELAR</v-btn>
              <v-btn color="green darken-1" text @click="registraEmpresa">ACEPTAR</v-btn>
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

       <!--DIÁLOGO MENSAJE DE ERROR-->
      <v-dialog width="500" v-model="boolExistente">
      <template>
          <v-card>
              <v-card-title class="justify-center">
                <v-alert dense outlined type="error">ERROR</v-alert>
              </v-card-title>
              <v-card-text>
                  <v-text >La empresa ya existe dentro del sistema</v-text>

              </v-card-text>
              <v-btn color="red darken-1" text @click="boolExistente=false">ACEPTAR</v-btn>
          </v-card>
      </template>
      </v-dialog> 

    <BarraLateralSuperUsu v-if = "rol==3"></BarraLateralSuperUsu>
    </v-container>
   </div>
   </v-main>
</template>

<script>
import BarraLateralSuperUsu from '../../components/BarraLateralSuperUsu.vue'
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import {getFirestore, collection, addDoc, getDoc, query, where, getDocs} from "firebase/firestore"
import firebaseApp from '../../scripts/firebase';
import { httpsCallable } from "firebase/functions";
import { getFunctions } from "firebase/functions"
import { getDownloadURL, getStorage, ref, uploadBytes } from "@firebase/storage";

const functions = getFunctions(firebaseApp);

 /** Vista encargada de los registros de nuevas empresas dentro del sistema
  * @public
  * @displayName  RegisterEmpresa
*/

export default({
    
    data(){
      return{
        rol: this.$route.params.rol,
        nombreEmp: '',
        direccion: '',
        localidad: '',
        cp: '',
        dedicacion: '',
        error: '',
        nombre:'',
        apellidos: '',
        correo:'',
        boolExistente:false,
        tab:'tabempresa',
        flagregistraempresa:false,
        flagexito:false,
        flaghayfoto: false,

        imagenSel: null,
        urlphoto: "",
      }
   },
    components:{
      BarraLateralSuperUsu
    },
    name: 'Registro',
    methods:{
        /** Método encargado de comprobar si se encuentra toda la información necesaria para añadir una nueva empresa
        * @public
        */
        abreConfirmacion(){
            
            if(this.nombreEmp && this.direccion && this.localidad && this.cp && this.dedicacion && this.nombre && this.apellidos && this.correo){
                this.error=''; //Limpiamos el mensaje de error
                this.flagregistraempresa=true;
            }
            else{
               this.error='Faltan datos por añadir al formulario'
            }
        },
        /** Método encargado de pasar a la ventana de registrar un administrador asociado a la empresa
        * @public
        */
        nextTab(){
            this.tab='tabadmin';
        },
        /** Método encargado de realizar el propio registro de la empresa, se almacenará toda la información
         * correspondiente en base de datos, tanto de la empresa como del nuevo usuario
        * @public
        */
        async registraEmpresa(){
            var existe="0";

            const firebaseDB= getFirestore(firebaseApp);
            const consulta =  query(collection(firebaseDB, "Empresas"), where("Nombre", "==", this.nombreEmp));
            const querySnapshot = await getDocs(consulta);

            querySnapshot.forEach(async(doc) => {
                existe="1"
            });
            
            if(existe=="1"){
                console.log("La empresa ya existe")
                this.boolExistente=true;
            }else{
                var password=generarPassword();
                var idEmp= generaIdEmpresa();
                

                //Añadimos el nuevo administrador a RolUser y lo registramos en el sistema
                const registrarTrabajador=httpsCallable(functions,"registrarTrabajador");
                registrarTrabajador({usuario: this.correo, pass: password}).then(async(resultado)=> {
            
                    console.log("ELUIDDDD es "+resultado.data);
                    await sendPasswordResetEmail(getAuth(),this.correo);
                    //UNA VEZ EL USUARIO HA SIDO REGISTRADO LE ASIGNAMOS UN ROL Y LO AÑADIMOS A LA TABLA DE RolUser
                    try {
                        const docRef =  await addDoc(collection(firebaseDB, "RolUser"), {
                        ROL: "Admin",
                        UID: resultado.data,
                        Correo:this.correo
                        });
                    //console.log("Document written with ID: ", docRef.id);
                    } catch (e) {
                    //console.error("Error adding document: ", e);
                    }

                    const stg=getStorage();
                    var imgRef=ref(stg,'porDefecto.png');

                     await getDownloadURL(imgRef).then(async(url)=>{
                    //AÑADIMOS EL NUEVO ADMIN A LA BASE DE DATOS DE TRABAJADORES
                        try {
                            const docRef =  await addDoc(collection(firebaseDB, "Trabajadores"), {
                            Nombre: this.nombre,
                            Apellidos: this.apellidos,
                            Correo: this.correo,
                            IdEmpresa: idEmp,
                            ROL: "Admin",
                            UID: resultado.data,
                            URLImage: url,
                            });
                            //console.log("Document written with ID: ", docRef.id);
                        } catch (e) {
                            //console.error("Error adding document: ", e);
                        }
                     });

                    //En el caso de que haya foto, entonces primero subimos la foto y luego generamos la url para subir la empresa a base de datos con la url
                        const storage=getStorage();
                        var imagesRef='';
                        var photo;
                        var storageRef='';

                        if(this.flaghayfoto){

                            storageRef=ref(storage,'FotosDeEmpresas/'+idEmp);
                            await uploadBytes(storageRef, this.imagenSel).then((snapshot) => {
                                console.log('La foto se subió con éxito');
                            });
                            //Ahora vamos a obtener la url de la imagen que acabamos de subir para asocuar esa url al photourl
                            photo = "FotosDeEmpresas/"+idEmp;
                            
                            //Vamos a recuperar la foto de perfil correspondiente al usuario
                            imagesRef = ref(storage, photo);
                        }else{
                            imagesRef=ref(storage,'empresaPorDefecto.png');
                        }
                        //Con esta función obtenemos la url
                        await getDownloadURL(imagesRef).then(async(url)=>{
                            //REGISTRAMOS LA EMPRESA EN LA BASE DE DATOS DE EMPRESAS
                            try {
                                const docRef =  await addDoc(collection(firebaseDB, "Empresas"), {
                                Nombre: this.nombreEmp,
                                Direccion: this.direccion,
                                Localidad: this.localidad,
                                CP: this.cp,
                                Dedicacion: this.dedicacion,
                                IdEmpresa: idEmp,
                                URLImage: url
                                });
                                //console.log("Document written with ID: ", docRef.id);
                            } catch (e) {
                                //console.error("Error adding document: ", e);
                            }
                        });

                    this.flagregistraempresa=false;
                    this.flagexito=true;
                });
                }   
        },
        /** Método encargado de recargar la página tras el registro de una nueva empresa en el sistema
        * @public
        */
        recargaPagina(){
           this.$router.push('/empresas/3');
        },
        /** Método encargado de recoger la imagen para una empresa
        * @public
        */
        imagenSeleccionada(evento){
          this.imagenSel=evento.target.files[0];
          console.log(this.imagenSel);
        },
        /** Método encargado de subir la imagen para una empresa
        * @public
        */
        async subirImagen(){
          
          if(!this.imagenSel){
            this.flaghayfoto=false;
            return;
          }
          
          this.flaghayfoto=true;
        }
    },
    
})

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
    /** Función encargada de generar un ID identificativo para una empresa nueva
    * @public
    */
   function generaIdEmpresa() {
      const longitud = 6;
      const caracteres = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

      var cadena = "";
      var max = caracteres.length-1;
      for (var i = 0; i<longitud; i++) {
          cadena += caracteres[ Math.floor(Math.random() * (max+1)) ];
      }

      return cadena;
   }


</script>