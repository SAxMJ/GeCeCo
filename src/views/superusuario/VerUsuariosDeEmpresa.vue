<template>
<v-main>
<v-container app>
    <div>
    <v-card>USUARIOS DE LA EMPRESA</v-card>
    <v-card class="grey lighten-2"> 

      <v-container id="regular-tables-view" fluid tag="section">
         <v-card class="black">{{recuperaUsuariosPorIdEmpresa}}</v-card>
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
      <div class="py-3" />
      <v-container>
      <v-btn class="primary" @click="volverAEmpresas">Volver</v-btn> 
      </v-container>
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
        headerUsuarios:[
          {text: 'Nombre',value: "Nombre"},
          {text: 'Apellidos', value: "Apellidos"},
          {text: 'Correo', value: "Correo"},
          {text: 'Rol', value: "ROL"}
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
   computed:{  
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
    },
    methods:{
    
      reseteaFlags(){
        this.flagmodificauser=false;
        this.flagbajausuario=false;
        this.flagexito=false;
        this.flagbajaempresa=false;
        this.flagmodificapass=false;
      },

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
      volverAEmpresas(){
        this.$router.push('/fichaempresa/3/'+this.idEmpresa);
      }


    }
  }
</script>