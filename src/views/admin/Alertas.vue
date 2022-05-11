<template>
<v-main>
<div>
  <v-container>
    
    <v-card>
      <v-card class="black">{{recuperaAlertas}}
        <v-row>
        <v-col cols="20" md="8" >
        </v-col>
        <v-col cols="20" md="9" >
        </v-col>
        <v-col cols="20" md="1" >
          <v-btn small class="green" @click="boolNuevaAlerta=true"><v-icon medium>mdi-alert-plus</v-icon></v-btn>
        </v-col>
         <v-col cols="20" md="1" >
          <v-btn small class="red" @click="compruebaAlertaSeleccionada(1)"><v-icon medium>mdi-alert-minus</v-icon></v-btn>
        </v-col>
        <v-col cols="20" md="1" >
          <v-btn small class="orange" @click="compruebaAlertaSeleccionada(2)"><v-icon medium>mdi-pencil</v-icon></v-btn>
        </v-col>
        <v-col cols="20" md="1" >
         </v-col>  
        </v-row>

      </v-card>
      <v-container id="regular-tables-view" fluid tag="section">
        <view-intro heading="Simple Tables" link="components/simple-tables"/>
        <material-card icon="mdi-clipboard-text" icon-small title="Simple Table" color="accent" >
        <v-data-table  v-model="alertaSeleccionada" :headers="cabeceras" :items="alertas" :single-select="true" item-key="IdAlerta" show-select class="elevation-1">
            <template v-slot:top>
            </template>
            </v-data-table>
            <div class="py-3" />
        </material-card>
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
          <v-select v-model="tipo" :items="tipoAlerta" :error-messages="errors" label="Tipo" data-vv-name="select" required></v-select>
        </v-card-text>
        <v-card-text>
          <v-select v-if="tipo==='CPU'" v-model="tipoElemento" :items="tiposCPU" :error-messages="errors" label="Seleccionar" data-vv-name="select" required></v-select>
          <v-select v-if="tipo==='RAM'" v-model="tipoElemento" :items="tiposRAM" :error-messages="errors" label="Seleccionar" data-vv-name="select" required></v-select>
          <v-select v-if="tipo==='DISCO'" v-model="tipoElemento" :items="tiposDISCO" :error-messages="errors" label="Seleccionar" data-vv-name="select" required></v-select>
        </v-card-text>
        <v-card-text>
          <v-select v-model="limite" :items="Limites" :error-messages="errors" label="Limite" data-vv-name="select" required></v-select>
        </v-card-text>
         <v-card-text>
          <v-slider v-model="valor" label= "% "></v-slider>
        </v-card-text>
        <v-card-text>
          <v-text-field v-model="descripcion" label="Descripción" outlined required></v-text-field>
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
          <v-select v-model="tipoModifica" :items="tipoAlerta" :error-messages="errors" label="Tipo" data-vv-name="select" required></v-select>
        </v-card-text>
        <v-card-text>
          <v-select v-if="tipo==='CPU'" v-model="tipoElementoModifica" :items="tiposCPU" :error-messages="errors" label="Seleccionar" data-vv-name="select" required></v-select>
        </v-card-text>
        <v-card-text>
          <v-select v-model="limiteModifica" :items="Limites" :error-messages="errors" label="Limite" data-vv-name="select" required></v-select>
        </v-card-text>
         <v-card-text>
          <v-slider v-model="valorModifica" label= "% "></v-slider>
        </v-card-text>
        <v-card-text>
          <v-text-field v-model="descripcionModifica" label="Descripción" outlined required></v-text-field>
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
  import {getFirestore, collection, addDoc, updateDoc, deleteDoc} from "firebase/firestore"
  import firebaseApp from '../../scripts/firebase'
  import { getAuth } from "firebase/auth";
  import {query, where, getDocs, serverTimestamp  } from "firebase/firestore";

  var rolUsr=1;
  console.log("Es--> " +rolUsr);
  
  export default{
    data (){
      return{
        boolNuevaAlerta: false,
        boolConfirmacionBorrarAlerta:false,
        boolConfirmacionModificarAlerta:false,
        flagExitoCrearAlerta:false,
        flagExitoEliminarAlerta: false,
        flagModificaAlerta:false,
        flagExitoModificarAlerta:false,
        rol: this.$route.params.rol,
        descripcion:'',
        alertas:[],
        alertaSeleccionada:[],
        error: '',
        tipo: '',
        tipoElemento:'',
        valor: '',
        limite: '', 

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
        ],
        tipoAlerta: [
          'CPU',
          'RAM',
          'RED',
          'DISCO',
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
        ],
        tiposDISCO:[
          'Usado',
          'Disponible',
        ],
      }
      },
    components:{
      BarraLateralAdmin,
      BarraLateralSuperUsu
    },
   computed:{ //Cada vez que inicializamos la paginarecogemos los datos
      async recuperaAlertas(){
        const firebaseDB= getFirestore(firebaseApp);
        const auth = getAuth();
        const consulta =  query(collection(firebaseDB, "Alertas"), where("IdAdmin", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(consulta);
        
        querySnapshot.forEach((doc) => {
          this.alertas.push(doc.data());
        });
      },
    },
    methods:{
      async almacenaAlerta(){

        this.error='';
        const firebaseDB= getFirestore(firebaseApp);
        const auth = getAuth();
        if(this.descripcion && this.tipo && this.valor && this.limite && this.tipoElemento){ //Almacenamos en la base de datos la nueva alerta
          
          try {
            const docRef = await addDoc(collection(firebaseDB, "Alertas"), {
              Descripcion: this.descripcion,
              IdAdmin: auth.currentUser.uid,
              Valor: this.valor,
              Limite: this.limite,
              Tipo: this.tipo,
              TipoElemento: this.tipoElemento,
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

        }else{
          console.log("Hay campos vacíos");
          this.error="Hay campos vacíos";
        }
      },
      compruebaAlertaSeleccionada(opcion){
        if(this.alertaSeleccionada[0]){
          if(opcion===1){ //Si la opcion es 1 entonces queremos borrar la alreta
            this.boolConfirmacionBorrarAlerta=true;
          }else if(opcion===2){ //Si la opcion es 2 entonces queremos modificar la alerta
          this.descripcionModifica=this.alertaSeleccionada[0].Descripcion;
          this.tipoModifica=this.alertaSeleccionada[0].Tipo
          this.tipoElementoModifica=this.alertaSeleccionada[0].TipoElemento
          this.valorModifica=this.alertaSeleccionada[0].Valor;
          this.limiteModifica=this.alertaSeleccionada[0].Limite;
          
          this.flagModificaAlerta=true;
          }
        }
      },
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
      async actualizaAlerta(){
        const firebaseDB= getFirestore(firebaseApp);
        const consulta=query(collection(firebaseDB, "Alertas"),where("IdAlerta", "==",this.alertaSeleccionada[0].IdAlerta));
        const querySnapshot = await getDocs(consulta);

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
      },
      recargaPagina(){
         location.reload();
      }
    }
  }
</script>