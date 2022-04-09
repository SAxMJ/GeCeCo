<template>
  <v-container>
    <v-card>
      {{recuperaTickets}}
      <v-container
        id="regular-tables-view"
        fluid
        tag="section"
      >
        <view-intro
          heading="Simple Tables"
          link="components/simple-tables"
        />

        <material-card
          icon="mdi-clipboard-text"
          icon-small
          title="Simple Table"
          color="accent"
        >
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
          </tr>
          <tr
            v-for="fecha in fechas"
            :key="fecha"
            >
        <td class="text-left">{{fecha }}</td>
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
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
        >
          Nuevo ticket
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Nuevo ticket</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="4"
              >
                <v-text-field
                  v-model="asunto"
                  label="Asunto"
                  outlined
                  required
                ></v-text-field>
              </v-col>
              </v-row>
              <v-row>
              <v-textarea
              v-model="descripcion"
              label="Descripción de la incidencia"
              counter
              maxlength="300"
              full-width
              single-line
              outlined
              required
              ></v-textarea>
            </v-row>
          </v-container>
          <small>* Indica campo requerido</small>
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

    <BarraLateral v-if = "rol==1"></BarraLateral>
    <BarraLateralAdmin v-if = "rol==2"></BarraLateralAdmin>
    <BarraLateralSuperUsu v-if = "rol==3"></BarraLateralSuperUsu>
  </v-container>
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
        tickets:[]
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

      }
    },
    methods:{
      enviaTicket(){

        const firebaseDB= getFirestore(firebaseApp);
        const auth = getAuth();
        if(this.descripcion && this.asunto){
          //PRIMERO SE HARÁ LA PARTE DE ENVIAR EL TICKET


          //UNA VEZ EL TICKET SE HA ENVIADO VAMOS A ALMACENARLO EN LA BASE DE DATOS
          obtieneIdEmpresa(auth,firebaseDB,this.asunto,this.descripcion);
          this.descripcion='';
          this.asunto='';

        }else{
          console.log("Hay campos vacíos");
        }
      },
      cerrarDialogo(){
        this.dialog=false;
      }
    }
  }

  async function obtieneIdEmpresa(auth,firebaseDB,asunto,descripcion){
    //Buscamos el nombre, apellidos, email y empresas
    var IdEmp;
    const consulta =  query(collection(firebaseDB, "Trabajadores"), where("Correo", "==", auth.currentUser.email));
    const querySnapshot = await getDocs(consulta);
      querySnapshot.forEach((doc) => {
        IdEmp=doc.get("IdEmpresa")

        almacenaEnBaseDeDatos(auth,firebaseDB,asunto,descripcion,IdEmp);
      });
  }

  function almacenaEnBaseDeDatos(auth,firebaseDB,asunto,descripcion,IdEmp){
    try {
      console.log("El id empresa es "+IdEmp)
      const docRef =  addDoc(collection(firebaseDB, "Tickets"), {
        Asunto: asunto,
        Descripcion: descripcion,
        Fecha: serverTimestamp(),
        IdEmpleado: auth.currentUser.uid,
        IdEmpresa: IdEmp,
        Estado: "No resuelta"
      });
      console.log("Document written with ID: ", docRef.id);

      //SE ENVIA EL CORREO ELECTRÓNICO QUE SE HARÁ CON LAS FUNCTIONS DE FIREBASE
      //enviaMail(1,this.correo,password);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
  }
</script>