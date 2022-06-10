<template>
<v-main>
  <v-container>
    <v-card class="grey lighten-2">
      <v-container>
        <v-card>TICKETS DE INCIDENCIAS</v-card>
      </v-container>

      <v-container>
        <v-card class="black">{{recuperaTickets}}
        <v-row>
        <v-col cols="5" md="8" >
        </v-col>
        <v-col cols="5" md="2" >
        </v-col>
        <v-col cols="5" md="1" >
        </v-col>
        <v-col cols="5" md="1" >
          <v-btn small class="green" dark @click="dialog=true">+<v-icon>mdi-ticket</v-icon></v-btn> 
        </v-col>
        <v-col cols="5" md="1" >
        </v-col>
        </v-row>
        </v-card>
      </v-container>

       <v-container>
      <v-data-table :headers="headers" :items="tickets" :single-select="true" item-key="Asunto"  class="elevation-1">
      <template v-slot:item.actions="{ item }">
          <v-icon medium class="mr-2" @click="modificarTicket(item)">mdi-pencil</v-icon>
        </template>
      </v-data-table>
      </v-container>
    </v-card>

   <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title class="justify-center">
          <span class="text-h5" >Nuevo ticket</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="asunto" label="Asunto" outlined required></v-text-field>
              </v-col>
              </v-row>
              <v-row>
                <v-textarea v-model="descripcion" label="Descripción de la incidencia" counter maxlength="300" full-width single-line 
                outlined required>
                </v-textarea>
            </v-row>
          </v-container>
          <small>* Indica campo requerido</small>
        </v-card-text>
        <v-card-text>
          <v-alert dense outlined type="error" v-if="error">
            {{error}}
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="cerrarDialogo">Cerrar</v-btn>
          <v-btn color="green darken-1" text @click="enviaTicket">Enviar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="boolEditarTicket" persistent max-width="600px">
      <v-card>
        <v-card-title class="justify-center">
          <span class="text-h5">Modificar ticket</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="asuntoEditar" label="Asunto" outlined required></v-text-field>
              </v-col>
              </v-row>
              <v-row>
                <v-textarea v-model="descripcionEditar" label="Descripción de la incidencia" counter maxlength="300" full-width single-line 
                outlined required>
                </v-textarea>
            </v-row>
          </v-container>
          <small>* Indica campo requerido</small>
        </v-card-text>
        <v-card-text>
          <v-alert dense outlined type="error" v-if="error">
            {{error}}
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="boolEditarTicket=false">Cerrar</v-btn>
          <v-btn color="green darken-1" text @click="actualizarTicket">Actualizar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>

  <!--DIÁLOGO MENSAJE DE ÉXITO-->
      <v-dialog width="500" v-model="flagExitoCrearTicket">
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
</v-container>

    <BarraLateral v-if = "rol==1"></BarraLateral>
    <BarraLateralAdmin v-if = "rol==2"></BarraLateralAdmin>
    <BarraLateralSuperUsu v-if = "rol==3"></BarraLateralSuperUsu>
  
  </v-main>
</template>

<script>
  
  import BarraLateral from '../../components/BarraLateralNormal.vue'
  import BarraLateralAdmin from '../../components/BarraLateralAdmin.vue'
  import BarraLateralSuperUsu from '../../components/BarraLateralSuperUsu.vue'
  import {getFirestore, collection, addDoc, updateDoc} from "firebase/firestore"
  import firebaseApp from '../../scripts/firebase'
  import { getAuth } from "firebase/auth";
  import {query, where, getDocs, serverTimestamp  } from "firebase/firestore";

  var rolUsr=1;
  console.log("Es--> " +rolUsr);
  
  export default{
    data (){
      return{
        asuntoEditar:"",
        descripcionEditar:"",
        asuntoAnterior:"",
        boolEditarTicket:false,
        dialog: false,
        rol: this.$route.params.rol,
        asunto:'',
        descripcion:'',
        fechas:[],
        tickets:[],
        error: '',
        flagExitoCrearTicket:false,
        headers:[
          {text: 'Asunto',value: "Asunto"},
          {text: 'Descripción', value: "Descripcion"},
          {text: 'Estado', value: "Estado"},
          {text: 'Hora / Fecha', value: "Fecha"},
          {text: 'Modificar', value: "actions"}
        ]
      }
      },
    components:{
      BarraLateral,
      BarraLateralAdmin,
      BarraLateralSuperUsu
    },
   computed:{ //Cada vez que inicializamos la paginarecogemos los datos
      async recuperaTickets(){
        const firebaseDB= getFirestore(firebaseApp);
        const auth = getAuth();
        const consulta =  query(collection(firebaseDB, "Tickets"), where("IdEmpleado", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(consulta);
        
        querySnapshot.forEach((doc) => {
          this.tickets.push(doc.data());
          //this.fechas.push(doc.data('Fecha'));
        });

        this.tickets.forEach(async function(ticket){
          var fechita=await (ticket.Fecha).toDate()
          ticket.Fecha = ''+ await fechita.getHours();
          ticket.Fecha += ':'+ await fechita.getMinutes();
          ticket.Fecha += ' / '+ await fechita.getDate();
          ticket.Fecha += '-'+ await fechita.getMonth();
          ticket.Fecha += '-' + await fechita.getFullYear();
        });
      }
    },
    methods:{
     async enviaTicket(){
        this.error='';
        const firebaseDB= getFirestore(firebaseApp);
        const auth = getAuth();
        if(this.descripcion && this.asunto){
          //UNA VEZ EL TICKET SE HA ENVIADO VAMOS A ALMACENARLO EN LA BASE DE DATOS
          var IdEmp;
          const consulta =  query(collection(firebaseDB, "Trabajadores"), where("Correo", "==", auth.currentUser.email));
          const querySnapshot = await getDocs(consulta);
          querySnapshot.forEach(async (doc) => {
          IdEmp=doc.get("IdEmpresa")

          try {
            console.log("El id empresa es "+IdEmp)
            const docRef =  await addDoc(collection(firebaseDB, "Tickets"), {
              Asunto: this.asunto,
              Descripcion: this.descripcion,
              Fecha: serverTimestamp(),
              IdEmpleado: auth.currentUser.uid,
              IdEmpresa: IdEmp,
              Estado: "No resuelta"
          });

          this.flagExitoCrearTicket=true;
          console.log("Document written with ID: ", docRef.id);

          //SE ENVIA EL CORREO ELECTRÓNICO QUE SE HARÁ CON LAS FUNCTIONS DE FIREBASE
          //enviaMail(1,this.correo,password);
          } catch (e) {
            console.error("Error adding document: ", e);
          }
          });

        }else{
          console.log("Hay campos vacíos");
          this.error="Hay campos vacíos";
        }
      },
      async actualizarTicket(){
        this.error='';
        const firebaseDB= getFirestore(firebaseApp);

        if(this.descripcionEditar && this.asuntoEditar){
         
          const consulta =  query(collection(firebaseDB, "Tickets"), where("Asunto", "==", this.asuntoAnterior));
          const querySnapshot = await getDocs(consulta);
          querySnapshot.forEach(async(doc) => {
            await updateDoc(doc.ref, {
            Estado:"No resuelta",
            Asunto: this.asuntoEditar,
            Descripcion: this.descripcionEditar,
            Fecha: serverTimestamp(),
            });
          });

        }else{
          console.log("Hay campos vacíos");
          this.error="Hay campos vacíos";
        }

        this.boolEditarTicket=false;
        this.flagExitoCrearTicket=true;
      },
      modificarTicket(item){
        this.asuntoEditar=item.Asunto;
        this.descripcionEditar=item.Descripcion;
        this.asuntoAnterior=item.Asunto;
        this.boolEditarTicket=true;
      },
      cerrarDialogo(){
        this.dialog=false;
      },
      recargaPagina(){
        location.reload();
      }
    }
  }

</script>