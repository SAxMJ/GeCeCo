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

      <v-container id="regular-tables-view" fluid tag="section">
        <view-intro heading="Simple Tables" link="components/simple-tables"/>
        <material-card icon="mdi-clipboard-text" icon-small title="Simple Table" color="accent" >
          <v-simple-table>
            <thead> <!--ESTA ESTA LA CABECERA DE LA TABLA-->
              <tr>
                <th class="text-left">
                  Asunto
                </th>
                <th class="text-left">
                  Descripción
                </th>
                <th class="text-left">
                  Estado
                </th>
                 <th class="text-left">
                  Fecha
                </th>
              </tr>
            </thead>

            <tbody> <!--ESTE ES EL CUERPO DE LA TABLA-->
            <tr
            v-for="ticket in tickets"
            :key="ticket.name"
            >
          <td class="text-left">{{ ticket.Asunto }}</td>
          <td class="text-left">{{ ticket.Descripcion }}</td>
          <td class="text-left">{{ ticket.Estado }}</td>
          <td class="text-left">{{ ticket.Fecha }}</td>
          </tr>
      </tbody>
          </v-simple-table>
        </material-card>
        <div class="py-3" />
      </v-container>
    </v-card>

   <v-row justify="center">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
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
          <v-btn
            color="red darken-1"
            text
            @click="cerrarDialogo"
          >
            Cerrar
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="enviaTicket"
          >
            Enviar
          </v-btn>
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
                <v-text>Se creó el ticket con éxito</v-text>
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
  import {getFirestore, collection, addDoc} from "firebase/firestore"
  import firebaseApp from '../../scripts/firebase'
  import { getAuth } from "firebase/auth";
  import {query, where, getDocs, serverTimestamp  } from "firebase/firestore";

  var rolUsr=1;
  console.log("Es--> " +rolUsr);
  
  export default{
    data (){
      return{
        dialog: false,
        rol: this.$route.params.rol,
        asunto:'',
        descripcion:'',
        fechas:[],
        tickets:[],
        error: '',
        flagExitoCrearTicket:false,
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
          ticket.Fecha += ' / '+ await fechita.getDay();
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
      cerrarDialogo(){
        this.dialog=false;
      },
      recargaPagina(){
        location.reload();
      }
    }
  }

</script>