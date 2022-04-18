<template>
  <v-container>
    <v-card>TICKETS DE LA EMPRESA</v-card>
    <v-card>
      <v-card class="black">{{recuperaTicketsTrabajadores}}</v-card>
      <v-container
        id="regular-tables-view"
        fluid
        tag="section"
      >
          <v-data-table
            v-model="seleccionados"
            :headers="headers"
            :items="tickets"
            :single-select="singleSelect"
            item-key="Asunto"
            show-select
            class="elevation-1"
          >

           <template v-slot:top>
      <v-switch
        v-model="singleSelect"
        label="Single select"
        class="pa-3"
      ></v-switch>
    </template>
  </v-data-table>

        <div class="py-3" />
      </v-container>

       <v-btn color="primary" dark  @click="marcarResuelto">Resuelto</v-btn>
    </v-card>
    
    <BarraLateralAdmin v-if = "rol==2"></BarraLateralAdmin>
    <BarraLateralSuperUsu v-if = "rol==3"></BarraLateralSuperUsu>
  </v-container>
</template>

<script>
  import BarraLateralAdmin from '../../components/BarraLateralAdmin.vue'
  import BarraLateralSuperUsu from '../../components/BarraLateralSuperUsu.vue'
  import {getFirestore, collection, updateDoc,doc} from "firebase/firestore"
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
        ]
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
          ticket.Fecha += ' / '+ await fechita.getDay();
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

          querySnapshot.forEach((doc) => {
            updateDoc(doc.ref, {
            Estado:"Resuelta"
          });
        });
        }
      }

    }
  }
   
</script>