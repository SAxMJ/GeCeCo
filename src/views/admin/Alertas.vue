<template>
<v-main>
<div>
  <v-container>
    <v-card class="grey lighten-4">
      <v-container>

<v-container fluid pa-0>
            <v-img width="1740px" height="100px" small  gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" class="white--text align-center justify-center " src="../../images/adornoTerminal3.jpg">
              <v-row align="center" justify="center" 
                  style="height:100vh" dense>
                  <v-col cols="12" lg="3" md="3" class="transparent fill-height d-flex flex-column justify-center align-center">
                      <v-card flat tile>
                      </v-card>
                  </v-col>
                  <v-col cols="12" lg="5" md="5" class="transparent fill-height d-flex flex-column justify-center align-center">
                      <v-card class="transparent" flat tile>
                        <v-card-text  class="text-h5 font-weight-bold white--text">ALERTAS CREADAS</v-card-text>
                      </v-card>
                  </v-col>
                  <v-col cols="12" lg="1" md="1" class="transparent fill-height d-flex flex-column justify-center align-center">
                      <v-card class="transparent" flat tile>
                        <v-btn small dark class="green" @click="boolNuevaAlerta=true"><v-icon medium>mdi-alert-plus</v-icon></v-btn>
                      </v-card>
                  </v-col>
                  <v-col cols="12" lg="1" md="1" class="transparent fill-height d-flex flex-column justify-center align-center">
                    <v-btn small dark class="red" @click="compruebaAlertaSeleccionada(1)"><v-icon medium>mdi-alert-minus</v-icon></v-btn>
                  </v-col>
                  <v-col cols="12" lg="1" md="1" class="transparent fill-height d-flex flex-column justify-center align-center">
                    <v-btn small dark class="orange" @click="compruebaAlertaSeleccionada(2)"><v-icon medium>mdi-pencil</v-icon></v-btn>
                  </v-col>
              </v-row>
            </v-img>
        </v-container>

        <view-intro heading="Simple Tables" link="components/simple-tables"/>
        <v-data-table  v-model="alertaSeleccionada" :headers="cabeceras" :items="alertas" :single-select="true" item-key="IdAlerta" show-select class="elevation-1">
            <template v-slot:top>
            </template>
            </v-data-table>
            <div class="py-3" />
        <div class="py-3" />
      </v-container>
      

<v-container>
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
                          <v-card-text  class="text-h5 font-weight-bold white--text">AVISOS DE ALERTAS</v-card-text>
                      </v-card>
                  </v-col>
                  <v-col cols="12" lg="1" md="1" class="transparent fill-height d-flex flex-column justify-center align-center">
                      <v-card class="transparent" flat tile>
                          <v-btn medium dark class="green" @click="comprobarSeleccionados"><v-icon>mdi-check</v-icon></v-btn> 
                      </v-card>
                  </v-col>
                  <v-col cols="12" lg="1" md="1" class="transparent fill-height d-flex flex-column justify-center align-center">
                  </v-col>
              </v-row>
            </v-img>
        </v-container>
          <view-intro heading="Simple Tables" link="components/simple-tables"/>
          <v-data-table  v-model="avisoSeleccionados" :headers="cabecerasAvisos" :items="avisos" :single-select="true" item-key="IdAviso" show-select class="elevation-1">
              <template v-slot:top>
              </template>
              </v-data-table>
              <div class="py-3" />
          <div class="py-3" />
        </v-container>
    </v-card>

   <v-row justify="center">
    <v-dialog v-model="boolNuevaAlerta" persistent max-width="600px">
      <v-card>
        <v-card-title class="justify-center">
          <span class="text-h5" >Nueva alerta</span>
        </v-card-title>
        <v-container>
        <v-card-text>
          <v-select  v-model="tipo" :items="tipoAlerta" :error-messages="errors" label="Tipo" data-vv-name="select" required></v-select>
        </v-card-text>
        <v-card-text>
          <v-select v-if="tipo==='CPU'" v-model="tipoElemento" :items="tiposCPU" :error-messages="errors" label="Seleccionar" data-vv-name="select" required></v-select>
          <v-select v-if="tipo==='RAM'" v-model="tipoElemento" :items="tiposRAM" :error-messages="errors" label="Seleccionar" data-vv-name="select" required></v-select>
          <v-select v-if="tipo==='DISCO'" v-model="tipoElemento" :items="tiposDISCO" :error-messages="errors" label="Seleccionar" data-vv-name="select" required></v-select>

        </v-card-text>
        <v-card-text>
          <v-select v-if="tipo!=='PROCESOS' && tipo!=='SERVICIOS'" v-model="limite" :items="Limites" :error-messages="errors" label="Limite" data-vv-name="select" required></v-select>
        </v-card-text>

         <v-card-text v-if="tipo!=='PROCESOS' && tipo!=='SERVICIOS'">
           <div>VALOR (%)</div>
           <v-text-field type="number" step="any" min="0" ref="input" :rules="[numberRule]" v-model.valor="valor"></v-text-field>
        </v-card-text>
        <v-card-text v-if="tipo==='PROCESOS'">
           <div>NUM PROCESOS</div>
           <v-text-field type="number" step="any" min="0" ref="input" :rules="[numberRule]" v-model.valor="valor"></v-text-field>
        </v-card-text>
         <v-card-text v-if="tipo==='SERVICIOS'">
           <div>CONTROLAR CAÍDA DE UN SERVICIO</div>
           <v-btn color="blue darken-20" text @click="recuperarServiciosParaMonitorizar">Ver servicios</v-btn>
        </v-card-text>
       
        <v-card-text>
          <v-text-field v-if="tipo!=='SERVICIOS'"  v-model="descripcion" label="Descripción" outlined required></v-text-field>
        </v-card-text>

        <v-card-text>
          <v-text-field v-if="tipo==='SERVICIOS'" disabled v-model="descripcion" label="Servicio seleccionado" outlined required></v-text-field>
        </v-card-text>

        <v-card-text>
          <v-alert dense outlined type="error" v-if="error">
            {{error}}
          </v-alert>
        </v-card-text>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click='boolNuevaAlerta=false'>Cerrar</v-btn>
          <v-btn color="green darken-1" text @click="almacenaAlerta">Añadir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>



    <!---PARA MODIFICAR LA ALERTA CORRESPONDIENTE-->
    <v-dialog v-model="flagModificaAlerta" persistent max-width="600px">
      <v-card>
        <v-card-title class="justify-center">
          <span class="text-h5" >Modifica alerta</span>
        </v-card-title>
        <v-container>
        <v-card-text>
          <v-select v-model="tipoModifica" disabled="true" :items="tipoAlerta" :error-messages="errors" label="Tipo" data-vv-name="select" required></v-select>
        </v-card-text>
        <v-card-text>
          <v-select v-if="tipoModifica==='CPU'" v-model="tipoElementoModifica" :items="tiposCPU" :error-messages="errors" label="Seleccionar" data-vv-name="select" required></v-select>
          <v-select v-if="tipoModifica==='RAM'" v-model="tipoElementoModifica" :items="tiposRAM" :error-messages="errors" label="Seleccionar" data-vv-name="select" required></v-select>
          <v-select v-if="tipoModifica==='DISCO'" v-model="tipoElementoModifica" :items="tiposDISCO" :error-messages="errors" label="Seleccionar" data-vv-name="select" required></v-select>
        </v-card-text>
        <v-card-text>
          <v-select v-if="tipoModifica!=='PROCESOS' && tipoModifica!=='SERVICIOS'" v-model="limiteModifica" :items="Limites" :error-messages="errors" label="Limite" data-vv-name="select" required></v-select>
        </v-card-text>
         <v-card-text v-if="tipoModifica!=='PROCESOS' && tipoModifica!=='SERVICIOS'">
           <div>VALOR (%)</div>
           <v-text-field type="number" step="any" min="0" ref="input" :rules="[numberRule]" v-model.valorModifica="valorModifica"></v-text-field>
        </v-card-text>
        <v-card-text v-if="tipoModifica==='PROCESOS' ">
           <div>NUM PROCESOS</div>
           <v-text-field type="number" step="any" min="0" ref="input" :rules="[numberRule]" v-model.valorModifica="valorModifica"></v-text-field>
           </v-card-text>
        <v-card-text>
          <v-text-field v-if="tipoModifica!=='SERVICIOS'" v-model="descripcionModifica" label="Descripción" outlined required></v-text-field>
        </v-card-text>

        <v-card-text>
          <v-text-field v-if="tipoModifica==='SERVICIOS'" disabled v-model="descripcionModifica" label="Servicio seleccionado" outlined required></v-text-field>
        </v-card-text>
        
        <v-card-text>
           <v-alert dense outlined type="info" v-if="tipoModifica==='SERVICIOS'">
            Las alertas de servicio no pueden ser modificadas
          </v-alert>
        
        </v-card-text>

        <v-card-text>
          <v-alert dense outlined type="error" v-if="error">
            {{error}}
          </v-alert>
        </v-card-text>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click='flagModificaAlerta=false'>Cerrar</v-btn>
          <v-btn color="green darken-1" text @click="actualizaAlerta">Modificar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>



    <!--VER SERVICIOS-->
      <v-dialog width="1000" v-model="boolVerServicios">
        <v-container class="grey lighten-2" id="regular-tables-view" fluid tag="section">
            <v-card>SERVICIOS</v-card>
            <view-intro heading="Simple Tables" link="components/simple-tables"/>
            <v-data-table v-model="servicioParaMonitorizarSeleccionado"  :headers="cabecerasServiciosParaMonitorizar" :items="serviciosParaMonitorizar" :single-select="true" item-key="Nombre" show-select   class="elevation-1">
                <template v-slot:top>
                </template>
                </v-data-table>
                <div class="py-3" />
            <v-btn color="red darken-1" text @click="boolVerServicios=false">CERRAR</v-btn>
            <v-btn color="green darken-1" text @click="comprobarServiciosSeleccionados">ACEPTAR</v-btn>
            </v-container>
      </v-dialog>




     <!--DIÁLOGO MENSAJE DE ÉXITO-->
      <v-dialog width="500" v-model="flagExitoCrearAlerta">
      <template>
          <v-card>
              <v-card-title class="justify-center">
                <v-text>HECHO</v-text>
              </v-card-title>
              <v-card-text>
                <v-text>Se creó la alerta con éxito</v-text>
              </v-card-text>
              <v-btn color="green darken-1" text @click="recargaPagina">ACEPTAR</v-btn>
          </v-card>
      </template>
      </v-dialog>

      <!--DIÁLOGO MENSAJE DE ÉXITO-->
      <v-dialog width="500" v-model="flagExitoEliminarAlerta">
      <template>
          <v-card>
              <v-card-title class="justify-center">
                <v-text>HECHO</v-text>
              </v-card-title>
              <v-card-text>
                <v-text>Se eliminó la alerta con éxito</v-text>
              </v-card-text>
              <v-btn color="green darken-1" text @click="recargaPagina">ACEPTAR</v-btn>
          </v-card>
      </template>
      </v-dialog>

       <!--DIÁLOGO MENSAJE DE ÉXITO-->
      <v-dialog width="500" v-model="flagExitoModificarAlerta">
      <template>
          <v-card>
              <v-card-title class="justify-center">
                <v-text>HECHO</v-text>
              </v-card-title>
              <v-card-text>
                <v-text>Se modificó la alerta con éxito</v-text>
              </v-card-text>
              <v-btn color="green darken-1" text @click="recargaPagina">ACEPTAR</v-btn>
          </v-card>
      </template>
      </v-dialog>

      <v-dialog width="500" v-model="boolConfirmacionBorrarAlerta">
      <template>
            <v-card>
              <v-card-title class="justify-center">
                <v-text>CONFIRMACIÓN</v-text>
              </v-card-title>
              <v-card-text>
                <v-text>¿Estás seguro de que quieres borrar esta alerta?</v-text>
              </v-card-text>
              <v-btn color="red darken-1" text @click="boolConfirmacionBorrarAlerta=false">CANCELAR</v-btn>
              <v-btn color="green darken-1" text @click="borrarLaAlerta">ACEPTAR</v-btn>
            </v-card>
      </template>
      </v-dialog> 

       <v-dialog width="500" v-model="boolConfirmacionAviso">
      <template>
          <v-card>
              <v-card-title class="justify-center">
                <v-text>¿Estás seguro que se atendió el aviso?</v-text>
              </v-card-title>
              <v-card-text>
                <v-text>Se marcará el aviso como resuelto</v-text>
              </v-card-text>
              <v-btn color="red darken-1" text @click="boolConfirmacion=false">CANCELAR</v-btn>
              <v-btn color="green darken-1" text @click="marcarAvisoResuelto">ACEPTAR</v-btn>
          </v-card>
      </template>
      </v-dialog>

      <v-dialog width="500" v-model="boolExito">
        <template>
          <v-card>
              <v-card-title class="justify-center">
                <v-text>HECHO</v-text>
              </v-card-title>
              <v-card-text>
                <v-text>Se actualizó el estado del aviso</v-text>
              </v-card-text>
              <v-btn color="green darken-1" text @click="recargaPagina">ACEPTAR</v-btn>
          </v-card>
        </template>
        </v-dialog> 
      
  </v-row>

    <BarraLateralAdmin v-if = "rol==2"></BarraLateralAdmin>
    <BarraLateralSuperUsu v-if = "rol==3"></BarraLateralSuperUsu>
  </v-container>
  </div>
  </v-main>
</template>

<script>
  
  import BarraLateralAdmin from '../../components/BarraLateralAdmin.vue'
  import BarraLateralSuperUsu from '../../components/BarraLateralSuperUsu.vue'
  import {getFirestore, collection, addDoc, updateDoc, deleteDoc, orderBy, doc} from "firebase/firestore"
  import firebaseApp from '../../scripts/firebase'
  import { getAuth } from "firebase/auth";
  import {query, where, getDocs, serverTimestamp  } from "firebase/firestore";

  var rolUsr=1;
  console.log("Es--> " +rolUsr);
  
  /** Ventana de la aplicación encargada de mostrar las diferentes alertas creadas por el administrador
   * así como los avisos generados en base a estas alertas.
   * También se podrán crear, eliminar y modificar alertas, así como marcar avisos de alertas como ya atendidos
   * @public
   */
  
  export default{
    data (){
      return{
        errors:"",
        boolConfirmacionAviso:false,
        boolNuevaAlerta: false,
        boolConfirmacionBorrarAlerta:false,
        boolConfirmacionModificarAlerta:false,
        boolVerServicios:false,
        boolExito:false,
        flagExitoCrearAlerta:false,
        flagExitoEliminarAlerta: false,
        flagModificaAlerta:false,
        flagExitoModificarAlerta:false,
        rol: this.$route.params.rol,
        descripcion:'',
        alertas:[],
        avisos:[],
        serviciosParaMonitorizar:[],
        alertaSeleccionada:[],
        avisoSeleccionados:[],
        servicioParaMonitorizarSeleccionado:[],
        error: '',
        tipo: '',
        tipoElemento:'',
        valor: 0,
        limite: '', 
        sistemaServicio:'',

        descripcionModifica:'',
        tipoModifica: '',
        tipoElementoModifica:'',
        valorModifica:'',
        limiteModifica:'',
        cabeceras:[
          {text: 'Tipo',value: "Tipo"},
          {text: 'TipoElemento', value: "TipoElemento"},
          {text: 'Descripcion', value: "Descripcion"},
          {text: 'Limite', value: "Limite"},
          {text: 'Valor', value: "Valor"},
          {value: "IdAviso"}
        ],
        cabecerasAvisos:[
          {text: 'Nombre equipo',value: "NombreEquipo"},
          {text: 'Tipo', value: "Tipo"},
          {text: 'TipoElemento', value: "TipoElemento"},
          {text: 'Limite', value: "Limite"},
          {text: 'Valor limite', value: "ValorLimite"},
          {text: 'Valor registrado', value: "ValorObtenido"},
          {text: 'Fecha / Hora', value: "Fecha"},
          {text: 'Estado', value: "Estado"},
        ],
        cabecerasServiciosParaMonitorizar:[
          {text: 'Nombre', value: "Nombre"},
          {text: 'Descripcón',value: "Descripcion"},
          {text: 'Sistema',value: "SO"},
          ],
        tipoAlerta: [
          'CPU',
          'RAM',
          'PROCESOS',
          'DISCO',
          'SERVICIOS'
        ],
        Limites: [
          'Supera',
          'Menor',
        ],
        tiposCPU:[
          'Carga',
          'Carga de usuarios',
          'Carga de sistema',
        ],
        tiposRAM:[
          'Libre',
          'Usada'
        ],
        tiposDISCO:[
          'Usado',
          'Disponible',
        ],

      number: 0,
      numberRule: val => {
        if(val < 0) return 'El numero debe ser positivo'
      return true
    }
      }
      },
    components:{
      BarraLateralAdmin,
      BarraLateralSuperUsu
    },
   computed:{
      
    },
    methods:{
      /** Método encargado de la creación de una alerta, se recogerán los diferentes parámetros establecidos y se
       * almacenarán en base de datos de Firestore
       * @public
       */
      async almacenaAlerta(){

        var idEmpresa="";
        this.error='';
        const firebaseDB= getFirestore(firebaseApp);
        const auth = getAuth();

        const consulta =  query(collection(firebaseDB, "Trabajadores"), where("Correo", "==", auth.currentUser.email));
        const querySnapshot = await getDocs(consulta);
        
        querySnapshot.forEach(async (doc) => {
           idEmpresa=doc.get("IdEmpresa");
        });

        if(this.descripcion && this.tipo && this.valor && this.limite && this.tipoElemento){ //Almacenamos en la base de datos la nueva alerta
          
          try {
            const docRef = await addDoc(collection(firebaseDB, "Alertas"), {
              Descripcion: this.descripcion,
              IdAdmin: auth.currentUser.uid,
              Valor: this.valor,
              Limite: this.limite,
              Tipo: this.tipo,
              TipoElemento: this.tipoElemento,
              IdEmpresa:idEmpresa,
            });

          console.log("Se registró la alerta: ", docRef.id);

          await updateDoc(docRef, {
            IdAlerta: docRef.id
          });

          this.boolNuevaAlerta=false;
          this.flagExitoCrearAlerta=true;
          } catch (e) {
            console.error("Error adding document: ", e);
          }

        }
        else if(this.tipo=="PROCESOS" && this.descripcion){

          try {
            const docRef = await addDoc(collection(firebaseDB, "Alertas"), {
              Descripcion: this.descripcion,
              IdAdmin: auth.currentUser.uid,
              Valor: this.valor,
              Limite:"Supera",
              Tipo: this.tipo,
              IdEmpresa:idEmpresa,
              TipoElemento:"-"
            });

          console.log("Se registró la alerta: ", docRef.id);

          await updateDoc(docRef, {
            IdAlerta: docRef.id
          });

          this.boolNuevaAlerta=false;
          this.flagExitoCrearAlerta=true;
          } catch (e) {
            console.error("Error adding document: ", e);
          }

        }else if(this.tipo=="SERVICIOS" && this.descripcion){

          try {
            const docRef = await addDoc(collection(firebaseDB, "Alertas"), {
              Descripcion: this.servicioParaMonitorizarSeleccionado[0].Descripcion,
              IdAdmin: auth.currentUser.uid,
              Valor: "false",
              Tipo: this.tipo,
              TipoElemento:this.descripcion,
              IdEmpresa:idEmpresa,
              Sistema: this.sistemaServicio,
              Limite: "-",
            });

          console.log("Se registró la alerta: ", docRef.id);

          await updateDoc(docRef, {
            IdAlerta: docRef.id
          });

          this.boolNuevaAlerta=false;
          this.flagExitoCrearAlerta=true;
          } catch (e) {
            console.error("Error adding document: ", e);
          }

        }
        else{
          console.log("Hay campos vacíos");
          this.error="Hay campos vacíos";
        }
      },
      /** Método encargado de controlar la acción que buscamos llevar a cabo con una alerta seleccionada, ya sea 
       * eliminarla o modificarla
       * @param {Number} opcion Valor utilizado como flag en función del botón pulsado
       * @public
       */
      compruebaAlertaSeleccionada(opcion){
        if(this.alertaSeleccionada[0]){
          if(opcion===1){ //Si la opcion es 1 entonces queremos borrar la alreta
            this.boolConfirmacionBorrarAlerta=true;
          }else if(opcion===2){ //Si la opcion es 2 entonces queremos modificar la alerta
            if(this.alertaSeleccionada[0].Tipo!="SERVICIOS"){
              this.descripcionModifica=this.alertaSeleccionada[0].Descripcion;
              this.tipoModifica=this.alertaSeleccionada[0].Tipo
              this.tipoElementoModifica=this.alertaSeleccionada[0].TipoElemento
              this.valorModifica=this.alertaSeleccionada[0].Valor;
              this.limiteModifica=this.alertaSeleccionada[0].Limite;
            }else{ //Representación de alerta de servicios al modificar
              this.descripcionModifica=this.alertaSeleccionada[0].TipoElemento;
              this.tipoModifica=this.alertaSeleccionada[0].Tipo
            }        
            this.flagModificaAlerta=true;
          }
        }
      },

      /** Método encargado de la eliminación de la propia alerta seleccionada, se eliminará su registro de la
       * base de datos de Firestore
       * @public
       */
      async borrarLaAlerta(){

        const firebaseDB= getFirestore(firebaseApp);
        var consulta=query(collection(firebaseDB, "Alertas"),where("IdAlerta", "==",this.alertaSeleccionada[0].IdAlerta))
        const querySnapshot = await getDocs(consulta);
        querySnapshot.forEach(async(doc) => {
          await deleteDoc(doc.ref);
        });
        console.log("Alerta eliminada: ");
        this.flagExitoEliminarAlerta=true;
      },
      /** Método encargado de la modificación de la propia alerta seleccionada, se modificarán y actualizarán sus
       * parámetros en la base de datos de Firestore
       * @public
       */
      async actualizaAlerta(){
        const firebaseDB= getFirestore(firebaseApp);
        const consulta=query(collection(firebaseDB, "Alertas"),where("IdAlerta", "==",this.alertaSeleccionada[0].IdAlerta));
        const querySnapshot = await getDocs(consulta);

        


        if(this.descripcionModifica && this.tipoModifica && this.valorModifica && this.limiteModifica && this.tipoElementoModifica){ //Almacenamos en la base de datos la nueva alerta
          
          querySnapshot.forEach(async(doc) => {
          await updateDoc(doc.ref, {
            Descripcion: this.descripcionModifica,
            Valor: this.valorModifica,
            Limite: this.limiteModifica,
            Tipo: this.tipoModifica,
            TipoElemento: this.tipoElementoModifica,
          });
        });

        this.flagExitoModificarAlerta=true;

        }
        else if(this.tipoModifica=="PROCESOS" && this.descripcionModifica){
           querySnapshot.forEach(async(doc) => {
          await updateDoc(doc.ref, {
            Descripcion: this.descripcionModifica,
            Valor: this.valorModifica,
            Limite: "Supera",
            Tipo: this.tipoModifica,
          });
        });

        this.flagExitoModificarAlerta=true;

        }else{
          console.log("Hay campos vacíos");
          this.error="Hay campos vacíos";
        }

      },
      /** Método encargado de recargar la página tras la modificación de avisos o alertas para que se muestren los cambios
       * @public
       */
      recargaPagina(){
         location.reload();
      },
      /** Método encargado de comprobar si existe algún aviso seleccionado antes de permitir realizar cualquier
       * acción
       * @public
       */
      comprobarSeleccionados(){
        if(this.avisoSeleccionados[0].IdAviso){
          this.boolConfirmacionAviso=true;
        }
      },
      /** Método encargado de marcar un aviso como atendido, se modificará su estado en el registro de la base de datos
       * @public
       */
      async marcarAvisoResuelto(){

        const firebaseDB= getFirestore(firebaseApp);
        
          var docRef=doc(firebaseDB, "AvisosDeAlerta", this.avisoSeleccionados[0].IdAviso)
          //querySnapshot.forEach(async(doc) => {
            await updateDoc(docRef, {
              Estado:"Atendido"
          });
        //});

        this.boolConfirmacionAviso=false;
        this.boolExito=true;
      },

      /** Método encargado de recuperar y mostrar tanto las alertas como los avisos de alerta correspondientes
       * al administrador que está accediendo a la ventana de alertas
       * @public
       */
      async recuperaAlertas(){
        const firebaseDB= getFirestore(firebaseApp);
        const auth = getAuth();
        const consulta =  query(collection(firebaseDB, "Alertas"), where("IdAdmin", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(consulta);
        
        querySnapshot.forEach((doc) => {
          this.alertas.push(doc.data());
        });


        const avisosRef = collection(firebaseDB, 'AvisosDeAlerta');
        console.log(auth.currentUser.uid)
        const consulta2 =  query(avisosRef, where("IdAdmin", "==", auth.currentUser.uid), orderBy("Fecha","desc"));
        const querySnapshot2 = await getDocs(consulta2);
        
        var i=0;
        querySnapshot2.forEach((doc) => {
          this.avisos.push(doc.data());
          this.avisos[i].IdAviso=doc.id;
          i++;
        });

        console.log(this.avisos[0].IdAviso);

        //Casteamos la fecha de cada ticket para darle un formato en el que mostrarlo
        this.avisos.forEach(async function(aviso){
          var fechita=await (aviso.Fecha).toDate()
          aviso.Fecha = ''+ await fechita.getHours();
          aviso.Fecha += ':'+ await fechita.getMinutes();
          aviso.Fecha += ' / '+ await fechita.getDate();
          aviso.Fecha += '-'+ await fechita.getMonth();
          aviso.Fecha += '-' + await fechita.getFullYear();
        });
      },

      async recuperarServiciosParaMonitorizar(){
        
        this.serviciosParaMonitorizar=[];
        const firebaseDB= getFirestore(firebaseApp);
        const consulta =  query(collection(firebaseDB, "ServiciosSO"));
        const querySnapshot = await getDocs(consulta);
        
        querySnapshot.forEach((doc) => {
          this.serviciosParaMonitorizar.push(doc.data());
        });
        
        
        
        this.boolVerServicios=true
      },
      /** Método encargado de controlar la acción que buscamos llevar a cabo con una alerta seleccionada, ya sea 
       * eliminarla o modificarla
       * @param {Number} opcion Valor utilizado como flag en función del botón pulsado
       * @public
       */
      comprobarServiciosSeleccionados(){
        this.boolVerServicios=false;
        if(this.servicioParaMonitorizarSeleccionado[0]){
          this.descripcion=this.servicioParaMonitorizarSeleccionado[0].Nombre;
        }
      },
    },
    mounted(){
      this.recuperaAlertas();
    }
  }
</script>