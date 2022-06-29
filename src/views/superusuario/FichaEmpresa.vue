<template>
<v-main>
<v-container>
  <v-card class="grey lighten-4">
      
    <v-container>
      
        <v-card icon="mdi-account-outline">  
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
                          <v-card-text  class="text-h5 font-weight-bold white--text">FICHA DE LA EMPRESA</v-card-text>
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
          <v-container>
          <v-form>
            <v-container class="py-0">
              <v-row align-content-center>
                <v-col cols="12" md="4" >
                  <v-text-field color="black" label="Nombre" v-model= "nombre" readonly />
                </v-col> 

                <v-col cols="12" md="4">
                  <v-text-field color="black" label="Dedicación" v-model= "dedicacion" readonly />
                </v-col>

                <v-col align-content-space- cols="12" md="3">
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
                  <v-text-field color="black" label="Localidad" v-model= "localidad" readonly />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field color="black" label="Dirección" v-model= "direccion" readonly />
                </v-col>
                <v-col cols="6">
                  <v-text-field color="black" label="CP" v-model= "cp" readonly />
                </v-col>
                <v-col cols="6">
                  <v-text-field color="black" label="ID" v-model= "idempresa" readonly />
                </v-col>
                <v-col cols="12" class="text-right">
                </v-col>
              </v-row>
            </v-container>
          </v-form>
          </v-container>
        </v-card>
      </v-container>

      <!--DIÁLOGO DE REGISTRO DE UN USUARIO PARA UNA EMPRESA-->
      <v-dialog width="500" v-model="flagregistrausuario">
      <template>
         <v-tabs dark color="primary">
            <v-tab>Registrar trabajador</v-tab>
                <v-tab-item>
                <v-card>
                  <v-card-text>
                    <form>
                      <v-text-field v-model="nombretrabajador" name="user" label="Nombre" type="text" placeholder="Nombre" required></v-text-field>
                      <v-text-field v-model="apellidotrabajador" name="ape" label="Apellidos" type="text" placeholder="Apellidos" required></v-text-field>
                      <v-text-field v-model="correotrabajador" name="user" label="Correo electrónico" type="email" placeholder="Correo electrónico" required></v-text-field>
                      <v-radio-group v-model="rolregistro" required>
                          <v-radio label="TRABAJADOR" value="Trabajador"></v-radio>
                          <v-radio label="ADMINISTRADOR" value="Admin"></v-radio>
                      </v-radio-group>
                    <v-btn  @click="registraTrabajador" class="mt-4"  dark color="secondary" value="registerUsu">Register</v-btn>
                    </form>
                  </v-card-text>
                </v-card>
            </v-tab-item>
          </v-tabs>
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

      <!--DIÁLOGO DE CONFIRMACIÓN DE BAJA DE EMPRESA-->
      <v-dialog width="500" v-model="flagbajaempresa">
      <template>
          <v-card>
              <v-card-title class="justify-center">
                <v-text>¿Estás seguro?</v-text>
              </v-card-title>
              <v-card-text>
                <v-text>Se dará de baja la empresa</v-text>
              </v-card-text>
              <v-btn color="red darken-1" text @click="reseteaFlags">CANCELAR</v-btn>
              <v-btn color="green darken-1" text @click="darDeBajaEmpresa">ACEPTAR</v-btn>
          </v-card>
      </template>
      </v-dialog>

      <!--DIÁLOGO MENSAJE DE ÉXITO BAJA EMPRESA-->
      <v-dialog width="500" v-model="flagexitobajaempresa">
      <template>
          <v-card>
              <v-card-title class="justify-center">
                <v-text>HECHO</v-text>
              </v-card-title>
              <v-card-text>
                <v-text>Se dió de baja la empresa y a sus trabajadores</v-text>
              </v-card-text>
              <v-btn color="green darken-1" text @click="volverAEmpresas">ACEPTAR</v-btn>
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

    </v-card>
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
  import { getApp } from "firebase/app";
  import { getFunctions } from "firebase/functions"
  import { httpsCallable } from "firebase/functions";
  import { getDownloadURL, getStorage, ref } from '@firebase/storage';

//Esto es para poder llamar a las funciones del backend
const functions = getFunctions(firebaseApp);

  var rolUsr=1;
  console.log("Es--> " +rolUsr);
  
  /** Vista encargada de mostrar la información correspondiente a una empresá así como de proporcionar
  * diferentes acciones como dar de baja la empresa o acceder a los usuarios que están asociados a la misma
  * @public 
  */
  export default{
    data (){
      return{
        rol: this.$route.params.rol,
        idEmpresa: this.$route.params.idEmpresa,
        
        //Variables de la ficha
        cp: "",
        dedicacion: "",
        direccion: "",
        idempresa: "",
        localidad: "",
        nombre: "",
        imgurl: "",
        boolExistente:false,


         opciones:[
          {title: 'Nuevo trabajador'},
          {title: 'Trabajadores'},
          {title: 'Dar de baja'},
        ],

        flagregistrausuario:false,
        flagexito:false,
        flagexitobajaempresa:false,
        flagbajaempresa:false,

        //Variables de registro de usuarios
        apellidotrabajador: "",
        correotrabajador: "",
        nombretrabajador: "",
        rolregistro: "",

      }
      },
    components:{
      BarraLateralSuperUsu
    },
    methods:{
      /**Método encargado de recuperar la información correspondeinte a la empresa que se solicita
     * @public
     */
      async GetDatosEmpresa(){
        const firebaseDB= getFirestore(firebaseApp);

        //Buscamos el nombre, apellidos, email y empresas
        const consulta =  query(collection(firebaseDB, "Empresas"), where("IdEmpresa", "==", this.idEmpresa));
        const querySnapshot = await getDocs(consulta);
          querySnapshot.forEach((doc) => {
            this.nombre=doc.get("Nombre");
            this.dedicacion=doc.get("Dedicacion");
            this.localidad=doc.get("Localidad");
            this.direccion=doc.get("Direccion");
            this.cp=doc.get("CP");
            this.idempresa=doc.get("IdEmpresa");
            this.imgurl=doc.get("URLImage");
          });
      },
       /** Método encargado de comprobar cual ha sido la opción seleccionada a realizar con la empresa, 
         * estás opciones serán: Registra un usuario, consultar los trabajadores de la empresa o dar de baja la empresa.
        * @public
        * @param {Number} index Valor flag utilizado para seleccionar la acción en función de la opción seleccionada
        */
      itemSeleccionado(index){
        if(index==0){
          this.flagregistrausuario=true;
          console.log("Queremos registrar usuario")
        }else if(index==1){
          console.log("Queremos consultar los trabajadores de la empresa")
          this.$router.push('/verusuariosdeempresa/3/'+this.idEmpresa);
        }
        else if(index==2){
          this.flagbajaempresa=true;
        }
      },
       /** Método encargado de registrar un nuevo trabajador para la empresa, se llamará a la Cloud Function correspondiente
        * y posteriormente se añadirá la información necesaria a la base de datos de Firestore.
        * @public
        */
      registraTrabajador(){
         var password=generarPassword();
            console.log(password);
            const firebaseDB= getFirestore(firebaseApp);
            var imagesRef= '';
            if(this.nombretrabajador && this.apellidotrabajador && this.correotrabajador && password){
               this.error=''; //Limpiamos el mensaje de error

              
              const registrarTrabajador=httpsCallable(functions,"registrarTrabajador");
              registrarTrabajador({usuario: this.correotrabajador, pass: password}).then(async(resultado)=> {
                    if(resultado.data != "0"){
                     console.log("ELUIDDDD es "+resultado.data);
                     await sendPasswordResetEmail(getAuth(),this.correotrabajador);
                     //UNA VEZ EL USUARIO HA SIDO REGISTRADO LE ASIGNAMOS UN ROL Y LO AÑADIMOS A LA TABLA DE RolUser
                      try {
                        const docRef =  await addDoc(collection(firebaseDB, "RolUser"), {
                           ROL: this.rolregistro,
                           UID: resultado.data,
                           Correo:this.correotrabajador
                        });
                        console.log("Document written with ID: ", docRef.id);
                        } catch (e) {
                        console.error("Error adding document: ", e);
                        }
                    //AÑADIMOS EL NUEVO ADMIN A LA BASE DE DATOS DE TRABAJADORES
                      const storage=getStorage();
                      imagesRef= ref(storage,'porDefecto.png');

                      await getDownloadURL(imagesRef).then(async(url)=>{
                        try {
                            const docRef =  await addDoc(collection(firebaseDB, "Trabajadores"), {
                            Nombre: this.nombretrabajador,
                            Apellidos: this.apellidotrabajador,
                            Correo: this.correotrabajador,
                            IdEmpresa: this.idempresa,
                            ROL: this.rolregistro,
                            URLImage: url
                            });
                            console.log("Document written with ID: ", docRef.id);
                            this.flagexito=true;
                            
                        } catch (e) {
                            console.error("Error adding document: ", e);
                        }
                      });
                    }else{
                      this.boolExistente=true;
                    }
               });
              
            }
            else{
              this.error='Faltan datos por añadir al formulario'
            }
      },
       /** Método encargado de dar de baja una empresa del sistema, se eliminará la información de dicha empresa
        * de la base de datos de Firebase
        * @public
        */
      async darDeBajaEmpresa(){
        const firebaseDB= getFirestore(firebaseApp);
        const darDeBajaUsuario=httpsCallable(functions,"darDeBajaUsuario");
          
          
          //Después de dar de baja el usuario eliminamos todas sus referencias de la base de datos
            const consulta=query(collection(firebaseDB,"Trabajadores"),where("IdEmpresa", "==", this.idempresa));
            const querySnapshot = await getDocs(consulta);
      
            //Por cada documento que encontremos eliminaremos al usuario y borraremos de la DB
            querySnapshot.forEach(async(doc) => {
              darDeBajaUsuario({correo: doc.get("Correo")}).then(async(result) => {
                
                var consulta2=query(collection(firebaseDB, "RolUser"),where("Correo", "==",doc.get("Correo")))
                const querySnapshot2 = await getDocs(consulta2);
                querySnapshot2.forEach(async(doc2) => {
                  await deleteDoc(doc2.ref);
                });
                console.log("Usuario borrado: "+result.data);
              });

              await deleteDoc(doc.ref);
            });
          
            var consulta3=query(collection(firebaseDB, "Empresas"),where("IdEmpresa", "==",this.idempresa))
            const querySnapshot3 = await getDocs(consulta3);
            querySnapshot3.forEach(async(doc3) => {
              await deleteDoc(doc3.ref);
            });

            this.flagbajaempresa=false;
            this.flagexitobajaempresa=true;
      },
       /** Método encargado de restablecer los flags que se encargan de mostrar los diálogos utilizados para
        * las diferentes acciones
        * @public
        */
      reseteaFlags(){
        this.flagregistrausuario=false;
        this.flagexito=false;
        this.flagbajaempresa=false;
      },
       /** Método encargado de voler a la vista de las empresas tras la eliminación de la empresa
        * @public
        */
      volverAEmpresas(){
        this.$router.push('/empresas/3');
      }
    },
    mounted(){
      this.GetDatosEmpresa();
    }
  }

    /** Función encargada de generar una contraseña para el nuevo trabajador añadido a la empresa
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
</script>