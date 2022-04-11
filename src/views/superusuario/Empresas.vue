<template>
<v-container app>

<div v-if="flagMostrarTrabajadores===false">
<v-card>EMPRESAS</v-card>
    <v-card class="grey lighten-2">
      <v-card class="black">{{recuperaEmpresas}}</v-card>
      <v-container id="regular-tables-view" fluid tag="section">
          <v-data-table  v-model="seleccionados" :headers="headers" :items="empresas" :single-select="true" item-key="IdEmpresa"   show-select class="elevation-1">
          <template v-slot:top>
          </template>
          </v-data-table>
        <div class="py-3" />
        <router-link to="/registerempresa/3">
          <v-btn class="primary">Añadir empresa</v-btn>
        </router-link>  
      </v-container>

      <v-container v-if="seleccionados.IdEmpresa!==null"> 
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
                  <v-text-field color="black" label="Dedicación" v-model= "dedicacion" readonly />
                </v-col>

                <v-col align-content-space- cols="12" md="4">
                  <v-img align-center max-height="100" max-width="100" :src="imgurl"></v-img>
                  <v-menu v-if="unoseleccionado===true" offset-y>
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
        </v-card>
      </v-col>
      </v-row>
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
    </v-card>
    </div>



































    <div v-if="flagMostrarTrabajadores===true">
      
    <v-card>USUARIOS DE LA EMPRESA</v-card>
    <v-card class="grey lighten-2">
     <v-card class="black"></v-card>
      <v-container id="regular-tables-view" fluid tag="section">
          <v-data-table  v-model="usuariosSeleccionados" :headers="headerUsuarios" :items="usuarios" :single-select="true" item-key="Correo"   show-select class="elevation-1">
          <template v-slot:top>
          </template>
          </v-data-table>
        <div class="py-3" />
      </v-container>

      <v-container v-if="usuariosSeleccionados.Correo!==null"> 
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
                  <v-menu v-if="usuarioSeleccionado===true" offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon color="black" dark v-bind="attrs" v-on="on"><v-icon dark>mdi-cog</v-icon></v-btn>
                  </template>
                  <v-list dark>
                    <v-list-item
                      v-for="(opcionesUsuarios, index) in opcionesUsuarios"
                      :key="index"
                      @click="itemSeleccionadoUsuarios(index)"
                    >
                      <v-list-item-title>{{ opcionesUsuarios.title }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field color="black" label="Email" v-model= "emailUsuario" readonly />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field color="black" label="Empresa" v-model= "nombre" readonly />
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
</template>

<script>
  import BarraLateralSuperUsu from '../../components/BarraLateralSuperUsu.vue'
  import {getFirestore, collection, updateDoc,doc, deleteDoc, addDoc} from "firebase/firestore"
  import firebaseApp from '../../scripts/firebase'
  import { getAuth,sendPasswordResetEmail } from "firebase/auth";
  import {query, where, getDocs} from "firebase/firestore";
  import { getApp } from "firebase/app";
  import { getFunctions, connectFunctionsEmulator } from "firebase/functions"
  import { httpsCallable } from "firebase/functions";
import { getDownloadURL, getStorage, ref } from '@firebase/storage';

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
        empresas:[],
        headers:[
          {text: 'Nombre',value: "Nombre"},
          {text: 'Dedicación', value: "Dedicacion"},
          {text: 'Localidad', value: "Localidad"},
          {text: 'Dirección', value: "Direccion"},
          {text: 'CP', value: "CP"},
          {text: 'Id', value: "IdEmpresa"}
        ],
         opciones:[
          {title: 'Nuevo trabajador'},
          {title: 'Trabajadores'},
          {title: 'Dar de baja'},
        ],

        //Variables de las tablas
        cp: "",
        dedicacion: "",
        direccion: "",
        idempresa: "",
        localidad: "",
        nombre: "",
        imgurl: "",
        
        //Flas de control de los mensajes
        flagmodificapass:false,
        flaginicio: false,
        flagregistrausuario:false,
        flagmodificauser:false,
        flagbajausuario: false,
        flagexito:false,

        //Variables de registro de usuarios
        apellidotrabajador: "",
        correotrabajador: "",
        nombretrabajador: "",
        rolregistro: "",




        //ESTAS SON LAS VARIABLES QUE SE ENCARGAN DE LOS USUARIOS
        flagMostrarTrabajadores:false,
        usuariosSeleccionados: [],
        usuarios:[],
        headerUsuarios:[
          {text: 'Nombre',value: "Nombre"},
          {text: 'Apellidos', value: "Apellidos"},
          {text: 'Correo', value: "Correo"},
          {text: 'Rol', value: "ROL"}
        ],
        nombreUsuario: "",
        apellidosUsuario: "",
        emailUsuario: "",
        rolUserUsuario: "",
        empresaUsuario: "",
        imgurlUsuario: "",
         opcionesUsuarios:[
          {title: 'Restablecer contraseña'},
          {title: 'Modificar'},
          {title: 'Dar de baja'},
        ],
        usuarioSeleccionado:false,
      }
      },
    components:{
      BarraLateralSuperUsu
    },
   computed:{  
      async recuperaEmpresas(){
        const firebaseDB= getFirestore(firebaseApp);
        const consulta =  query(collection(firebaseDB, "Empresas"));
        const querySnapshot = await getDocs(consulta);
          querySnapshot.forEach((doc) => {
            this.empresas.push(doc.data());
          });
      },
    },
    methods:{
      comprueba(){
        console.log("Entro comprueba");
        
        if(this.seleccionados[0]){
          //console.log("Tiene algo");
          this.unoseleccionado=true;
          this.GetDatosEmpresa();
        }
        else{
        //console.log("Esta vacio");
        this.unoseleccionado=false;
        this.cp="";
        this.dedicacion="";
        this.direccion="";
        this.idempresa="";
        this.localidad="";
        this.nombre="";
        this.imgurl="";
        }
      },





      async GetDatosEmpresa(){
          //var auth = getAuth();
        const firebaseDB= getFirestore(firebaseApp);

        //Buscamos el nombre, apellidos, email y empresas
        const consulta =  query(collection(firebaseDB, "Empresas"), where("IdEmpresa", "==", this.seleccionados[0].IdEmpresa));
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





      itemSeleccionado(index){
        if(index==0){
          this.flagregistrausuario=true;
          console.log("Queremos restablecer la contraseña")
        }else if(index==1){
          console.log("Queremos consultar los trabajadores de la empresa")
          this.flagMostrarTrabajadores=true;
          this.recuperaUsuariosPorIdEmpresa();
        }
        else if(index==2){
          console.log("Queremos dar de baja el usuario")
          this.flagbajausuario=true;
          this.flagmodificapasshecho=true;
        }
      },





      registraTrabajador(){
         var password=generarPassword();
            console.log(password);
            const firebaseDB= getFirestore(firebaseApp);
            var imagesRef= '';
            if(this.nombretrabajador && this.apellidotrabajador && this.correotrabajador && password){
               this.error=''; //Limpiamos el mensaje de error

               const registrarTrabajador=httpsCallable(functions,"registrarTrabajador");
               registrarTrabajador({usuario: this.correotrabajador, pass: password}).then(async(resultado)=> {
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
               });
            }
            else{
              this.error='Faltan datos por añadir al formulario'
            }
      },




      reseteaFlags(){
        this.flagregistrausuario=false;
        this.flagmodificauser=false;
        this.flagbajausuario=false;
        this.flagexito=false;
      },


      //A PARTIR DE AQUÍ SE ENCUENTRAN LOS MÉTODOS ENCARGADOS DE LA GESTIÓN DE USUARIOS DE CADA EMPRESA
      async recuperaUsuariosPorIdEmpresa(){
        const firebaseDB= getFirestore(firebaseApp);
        const consulta =  query(collection(firebaseDB, "Trabajadores"), where("IdEmpresa", "==", this.seleccionados[0].IdEmpresa));
        const querySnapshot = await getDocs(consulta);
        
        querySnapshot.forEach((doc) => {
          this.usuarios.push(doc.data());
        });
      },

      itemSeleccionadoUsuarios(index){
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
        }
      },

      compruebaUsuarios(){
        console.log("Entro comprueba");
        
        if(this.usuariosSeleccionados[0]){
          //console.log("Tiene algo");
          this.usuarioSeleccionado=true;
          this.GetDatosUsuario();
        }
        else{
          //console.log("Esta vacio");
          this.usuarioSeleccionado=false;
        }
      },

      async GetDatosUsuario(){
          this.nombreUsuario=this.usuariosSeleccionados[0].Nombre;
          this.apellidosUsuario=this.usuariosSeleccionados[0].Apellidos;
          this.emailUsuario=this.usuariosSeleccionados[0].Correo;
          this.imgurlUsuario=this.usuariosSeleccionados[0].URLImage;
          this.rolUserUsuario=this.usuariosSeleccionados[0].ROL;
          this.empresaUsuario=this.nombre;
      },

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

      async restablecerPassUsuario(){
        console.log("PUMBA! SE ENVIÓ EL CORREO")
        await sendPasswordResetEmail(getAuth(),this.usuariosSeleccionados[0].Correo);
        this.flagmodificapass=false;
        this.flagexito=true;
      },

      async modificarUsuario(){

      }
































    }
  }

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