<template>
<v-main>
  <v-container app>
    <v-card  class="grey lighten-4">
      <v-container>
      <v-container fluid pa-0>
            <v-img width="1740px" height="100px" small  gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" class="white--text align-center justify-center " src="../../images/adornoTerminal3.jpg">
              <v-row align="center" justify="center" 
                  style="height:100vh" dense>
                  <v-col cols="12" lg="2" md="2" class="transparent fill-height d-flex flex-column justify-center align-center">
                      <v-card flat tile>
                      </v-card>
                  </v-col>
                  <v-col cols="12" lg="6" md="6" class="transparent fill-height d-flex flex-column justify-center align-center">
                      <v-card class="transparent" flat tile>
                          <v-card-text  class="text-h5 font-weight-bold white--text">TICKETS DE LA EMPRESA</v-card-text>
                      </v-card>
                  </v-col>
                  <v-col cols="12" lg="1" md="1" class="transparent fill-height d-flex flex-column justify-center align-center">
                      <v-card class="transparent" flat tile>
                        <v-btn medium dark class="green" @click="comprobarSeleccionados(0)"><v-icon>mdi-check</v-icon></v-btn>
                      </v-card>
                  </v-col>

                  <v-col cols="12" lg="1" md="1" class="transparent fill-height d-flex flex-column justify-center align-center">
                      <v-card class="transparent" flat tile>
                        <v-btn medium dark class="red" @click="comprobarSeleccionados(1)"><v-icon>mdi-delete</v-icon></v-btn>
                      </v-card>
                  </v-col>
              </v-row>
            </v-img>
        </v-container>

        <v-data-table v-model="seleccionados" :headers="headers" :items="tickets" :single-select="singleSelect" item-key="Asunto" show-select class="elevation-1">
        </v-data-table>

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

/** Ventana donde se muestran los tickets creados por los usuarios normales de la empresa a la
 * que está asociada el administrador. Podrá tanto eliminar como marcar los tickets como resueltos
* @public
*/

  
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
    methods:{
      cerrarDialogo(){
        this.dialog=false;
      },
      /** Método encargado de recuperar los tickets de todos los empleados asociados a una empresa
      * @public
      * @param firebaseDB Instancia de la base de datos de Firestore que nos permite trabajar con ella
      * @param {string} IdEmp Id de la empresa de la que queremos recuperar todos los tickets creados
      */
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
      /** Método encargado de cambiar el estado de un ticket a resuelto, se actualizará su atributo de estado
       * dentro de la base de datos
      * @public
      */
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
      /** Método encargado de eliminar un ticket, se eliminará su registro dentro de la base de datos
      * @public
      */
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
      /** Método encargado de comprobar si existe al menos un ticket seleccionado antes de realizar cualquier tipo de acción, 
       * ya sea borrarlo o modificarlo
      * @public
      */
      comprobarSeleccionados(flag){
        if(this.seleccionados[0].Asunto && flag==0){
          this.boolConfirmacion=true;
        }
        if(this.seleccionados[0].Asunto && flag==1){
          this.boolConfirmaBorrar=true;
        }
      },
      /** Método encargado de recargar la página para que se muestren los cambios realizados
      * @public
      */
      recargarPagina(){
        location.reload();
      },
      /** Método encargado de recuperar el ID del administrador correspondiente
       * @public
       */
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
      }
    },
    mounted(){
      this.recuperaTicketsTrabajadores();
    }
  }
   
</script>