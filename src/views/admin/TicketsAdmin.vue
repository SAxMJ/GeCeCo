<template>
<v-main>
  <v-container>
    <v-card  class="grey lighten-2">
      
      <v-container>
        <v-card>TICKETS DE LA EMPRESA</v-card>
      </v-container>
      
      <v-container>
      <v-container id="regular-tables-view" fluid tag="section">
      <v-card class="black">{{recuperaTicketsTrabajadores}}
        <v-row>
        <v-col cols="5" md="8" >
        </v-col>
        <v-col cols="5" md="2" >
        </v-col>
        <v-col cols="5" md="1" >
          <v-btn small dark class="green" @click="comprobarSeleccionados(0)"><v-icon>mdi-check</v-icon></v-btn>
        </v-col>
        <v-col cols="5" md="1" >
           <v-btn small dark class="red" @click="comprobarSeleccionados(1)"><v-icon>mdi-delete</v-icon></v-btn>
        </v-col>
        <v-col cols="5" md="1" >
        </v-col>
        </v-row>
      </v-card>
      </v-container>
      
      <v-container>
      <v-data-table v-model="seleccionados" :headers="headers" :items="tickets" :single-select="singleSelect" item-key="Asunto" show-select class="elevation-1">
      <template v-slot:top>
        <v-switch
          v-model="singleSelect"
          label="Single select"
          class="pa-3"
        ></v-switch>
      </template>
      </v-data-table>
      </v-container>
    <div class="py-3" />
    </v-container>
    </v-card>
    
    <v-dialog width="500" v-model="boolConfirmacion">
      <template>
          <v-card>
              <v-card-title class="justify-center">
                <v-text>¿Estás seguro?</v-text>
              </v-card-title>
              <v-card-text>
                <v-text>Se marcarán el/los ticket(s) como resueltos</v-text>
              </v-card-text>
              <v-btn color="red darken-1" text @click="boolConfirmacion=false">CANCELAR</v-btn>
              <v-btn color="green darken-1" text @click="marcarResuelto">ACEPTAR</v-btn>
          </v-card>
      </template>
      </v-dialog>

       <v-dialog width="500" v-model="boolConfirmaBorrar">
      <template>
          <v-card>
              <v-card-title class="justify-center">
                <v-text>¿Estás seguro?</v-text>
              </v-card-title>
              <v-card-text>
                <v-text>Se eliminarán el/los ticket(s) y no podrás recuperarlos</v-text>
              </v-card-text>
              <v-btn color="red darken-1" text @click="boolConfirmaBorrar=false">CANCELAR</v-btn>
              <v-btn color="green darken-1" text @click="borrarTicket">ACEPTAR</v-btn>
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
                <v-text>Se actualizaron correctamente los tickets</v-text>
              </v-card-text>
              <v-btn color="green darken-1" text @click="recargarPagina">ACEPTAR</v-btn>
          </v-card>
        </template>
        </v-dialog> 


    <BarraLateralAdmin v-if = "rol==2"></BarraLateralAdmin>
    <BarraLateralSuperUsu v-if = "rol==3"></BarraLateralSuperUsu>
  </v-container>
  </v-main>
</template>

<script>
  import BarraLateralAdmin from '../../components/BarraLateralAdmin.vue'
  import BarraLateralSuperUsu from '../../components/BarraLateralSuperUsu.vue'
  import {getFirestore, collection, updateDoc,doc,deleteDoc} from "firebase/firestore"
  import firebaseApp from '../../scripts/firebase'
  import { getAuth } from "firebase/auth";
  import {query, where, getDocs} from "firebase/firestore";

  var rolUsr=1;
  console.log("Es--> " +rolUsr);
  
  export default{
    data (){
      return{
        seleccionados: [],
        singleSelect: false,
        rol: this.$route.params.rol,
        fechas:[],
        tickets:[],
        headers:[
          {text: 'Asunto',value: "Asunto"},
          {text: 'Descripción', value: "Descripcion"},
          {text: 'Estado', value: "Estado"},
          {text: 'Hora / Fecha', value: "Fecha"}
        ],
        boolConfirmaBorrar:false,
        boolConfirmacion:false,
        boolExito:false,
      }
      },
    components:{
      BarraLateralAdmin,
      BarraLateralSuperUsu
    },
   computed:{ //Cada vez que inicializamos la paginarecogemos los datos
      //Para el administrador los tickets recuperados serán todos aquellos que coincidan con su código de empresa 
      async recuperaTicketsTrabajadores(){
      //Buscamos IdEmpresa de este administrador
      const firebaseDB= getFirestore(firebaseApp);
      const auth = getAuth();
      const consulta =  query(collection(firebaseDB, "Trabajadores"), where("Correo", "==", auth.currentUser.email));
      const querySnapshot = await getDocs(consulta);
        querySnapshot.forEach((doc) => {
          var IdEmp=doc.get("IdEmpresa")
          console.log("la ID EMPRESA ES "+IdEmp);
          this.recuperaTickets(firebaseDB,IdEmp)
        });
    },
    },
    methods:{
      cerrarDialogo(){
        this.dialog=false;
      },
      async recuperaTickets(firebaseDB,IdEmp){
        const consulta =  query(collection(firebaseDB, "Tickets"), where("IdEmpresa", "==", IdEmp));
        const querySnapshot = await getDocs(consulta);
        
        querySnapshot.forEach(async(doc) => {
          await this.tickets.push(doc.data());
        });

        //Casteamos la fecha de cada ticket para darle un formato en el que mostrarlo
        this.tickets.forEach(async function(ticket){
          var fechita=await (ticket.Fecha).toDate()
          ticket.Fecha = ''+ await fechita.getHours();
          ticket.Fecha += ':'+ await fechita.getMinutes();
          ticket.Fecha += ' / '+ await fechita.getDate();
          ticket.Fecha += '-'+ await fechita.getMonth();
          ticket.Fecha += '-' + await fechita.getFullYear();
        });
      },
      async marcarResuelto(){

        const firebaseDB= getFirestore(firebaseApp);
        
        for(var seleccionado in this.seleccionados){
          console.log(this.seleccionados[seleccionado].Asunto)
          const consulta =  query(collection(firebaseDB, "Tickets"), where("Asunto", "==", this.seleccionados[seleccionado].Asunto));
          const querySnapshot = await getDocs(consulta);

          querySnapshot.forEach(async(doc) => {
            await updateDoc(doc.ref, {
            Estado:"Resuelta"
            });
          });
        }

        this.boolExito=true;
      },
      async borrarTicket(){
       
        this.boolConfirmaBorrar=false;
        const firebaseDB= getFirestore(firebaseApp);
        
        for(var seleccionado in this.seleccionados){
        
        const consulta =  query(collection(firebaseDB, "Tickets"), where("Asunto", "==", this.seleccionados[seleccionado].Asunto));
        const querySnapshot = await getDocs(consulta);

        querySnapshot.forEach(async(doc) => {
          await deleteDoc(doc.ref)
        });

        this.boolExito=true;
        }
      },
      comprobarSeleccionados(flag){
        if(this.seleccionados[0].Asunto && flag==0){
          this.boolConfirmacion=true;
        }
        if(this.seleccionados[0].Asunto && flag==1){
          this.boolConfirmaBorrar=true;
        }
      },
      recargarPagina(){
        location.reload();
      }

    }
  }
   
</script>