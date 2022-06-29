<template>
<v-main > 
    <div>
        <v-container class="grey lighten-4">
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
                    <v-card-text  class="text-h5 font-weight-bold white--text">VER EQUIPO</v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" lg="1" md="1" class="transparent fill-height d-flex flex-column justify-center align-center">
                <v-card class="transparent" flat tile>
                </v-card>
            </v-col>
            <v-col cols="12" lg="1" md="1" class="transparent fill-height d-flex flex-column justify-center align-center">
            </v-col>
        </v-row>
      </v-img>
  </v-container>
        
        <v-container>
        <v-row rows="12" md="6">
            
            <v-col cols="12" md="2">
                <v-card>
                    <template>
                        <v-treeview :items="itemsPROCESOS">Procesos</v-treeview>
                        <v-btn icon color="blue" @click="boolVerServicios=true"><v-icon>mdi-table-eye</v-icon></v-btn>
                    </template>
                </v-card>
            </v-col>
        
            <v-col cols="12" md="2">
                <v-card>
                    <template>
                        <v-treeview :items="itemsCPU">CPU</v-treeview>
                    </template>
                </v-card>
            </v-col>

            <v-col cols="12" md="4">
                <v-card width="600px" height="400px">
                <v-container width="20" height="20">
                    <v-card class="blue lighten-4">{{nombreEquipoMuestra}}</v-card>
                    <v-card-title class="justify-center" >{{distro}}</v-card-title>
                    <v-card-text>{{platform}}</v-card-text>
                    <v-card-text>{{arch}}</v-card-text>
                    <v-card-text>{{hostname}}</v-card-text>
                    <v-card-text>{{kernel}}</v-card-text>
                    <v-card-text></v-card-text>
                    <v-btn v-if="boolcarga===false" icon color="red" @click="boolConfirmaEliminacion=true"><v-icon>mdi-delete</v-icon> Borrar</v-btn>
                    <v-progress-circular
                    :width="3"
                    color="green"
                    indeterminate
                    v-show="boolcarga===true"
                    ></v-progress-circular>
                </v-container>
                </v-card>
            </v-col>

            <v-col cols="12" md="2">
                <v-card>
                    <template>
                        <v-treeview :items="itemsRAM">RAM</v-treeview>
                    </template>
                </v-card>
            </v-col>
            <v-col cols="12" md="2">
            <v-card>
                <template>
                    <v-treeview :items="itemsDISK">Disco</v-treeview>
                </template>
            </v-card>
            </v-col>
            <v-col cols="12" md="5">
            <v-card>
                <template>
                    <v-treeview :items="itemsUSB">USB</v-treeview>
                </template>
            </v-card>
            </v-col>
            <v-col cols="12" md="2">
            <v-card>
                <template>
                    <v-treeview v-if="boolMuestraBateria==true" :items="itemsBATERIA">BATERÍA</v-treeview>
                </template>
            </v-card>
            </v-col>
            <v-col cols="12" md="5">
            <v-card>
                <template>
                    <v-treeview :items="itemsRED">USB</v-treeview>
                </template>
            </v-card>
            </v-col>
        </v-row>

        <v-row rows="12" md="4">
        </v-row>

        <v-row rows="12" md="2">
            <v-container id="regular-tables-view" fluid tag="section">
            <v-card class="blue lighten-4">ALERTAS GENERADAS POR EL EQUIPO</v-card>
            <view-intro heading="Simple Tables" link="components/simple-tables"/>
            <v-data-table  :headers="cabecerasAvisos" :items="avisos" :single-select="true" item-key="IdAlerta"  class="elevation-1">
                <template v-slot:top>
                </template>
                </v-data-table>
                <div class="py-3" />
            <div class="py-3" />
            </v-container>
        </v-row>

         <v-row rows="12" md="2">
            <v-container id="regular-tables-view" fluid tag="section">
            <v-card class="blue lighten-4">HISTORIAL DE LECTURAS</v-card>
            <view-intro heading="Simple Tables" link="components/simple-tables"/>
            <v-data-table  :headers="cabecerasHistorico" :items="historicoMonit" :single-select="true" item-key="IdAlerta"  class="elevation-1">
                <template v-slot:top>
                </template>
                </v-data-table>
                <div class="py-3" />
            <div class="py-3" />
            </v-container>
        </v-row>

      <!--DIÁLOGO DE MODIFICAR EL USUARIO-->
      <v-dialog width="500" v-model="boolConfirmaEliminacion">
      <template>
          <v-card>
              <v-card-title class="justify-center">
                <v-text>¿Estás seguro?</v-text>
              </v-card-title>
              <v-card-text>
                <v-text>Se eliminará el equipo del sistema</v-text>
              </v-card-text>
              <v-btn color="red darken-1" text @click="boolConfirmaEliminacion=false">CANCELAR</v-btn>
              <v-btn color="green darken-1" text @click="eliminarEquipoDelSistema">ACEPTAR</v-btn>
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
                <v-text>Se eliminó el equipo con éxito</v-text>
              </v-card-text>
              <v-btn color="green darken-1" text @click="volverAEquipos">ACEPTAR</v-btn>
          </v-card>
        </template>
        </v-dialog> 

      <!--VER SERVICIOS-->
      <v-dialog width="1000" v-model="boolVerServicios">
        <v-container class="grey lighten-2" id="regular-tables-view" fluid tag="section">
            <v-card>SERVICIOS Y PROCESOS</v-card>
            <view-intro heading="Simple Tables" link="components/simple-tables"/>
            <v-data-table  :headers="cabecerasServicios" :items="serviciosyprocesos" :single-select="true"   class="elevation-1">
                <template v-slot:top>
                </template>
                </v-data-table>
                <div class="py-3" />
            <v-btn color="red darken-1" text @click="boolVerServicios=false">CERRAR</v-btn>
            </v-container>
      </v-dialog>

    </v-container>
    
    </v-container>

    <BarraLateralAdmin v-if = "rol==2"></BarraLateralAdmin>
    <BarraLateralSuperUsu v-if = "rol==3"></BarraLateralSuperUsu>
  </div>
  </v-main>
</template>

<script>
  import BarraLateralAdmin from '../../components/BarraLateralAdmin.vue'
  import BarraLateralSuperUsu from '../../components/BarraLateralSuperUsu.vue'
  import {getFirestore, collection, updateDoc,doc, deleteDoc, orderBy, limit, getDoc} from "firebase/firestore"
  import firebaseApp from '../../scripts/firebase'
  import {query, where, getDocs,addDoc} from "firebase/firestore";
   
  const firebaseDB= getFirestore(firebaseApp);

  /** Ventana donde se muestra la información completa sobre un equipo, como los avisos que generó, la información de su última
   * lectura de monitorización y un histórico con todas sus monitorizaciónes ordenadas cronológicamente.
   * Además se proporcionará la posibilidad de dar de baja el equipo del sistema.
   * @public
   */
  export default{
    data (){
      return{

        rol: this.$route.params.rol,
        idEquipo: this.$route.params.idEquipo,
        avisos:[],
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
        historicoMonit:[],
        cabecerasHistorico:[
            {text: 'CPU Carga', value: "CPU.currentLoad"},
            {text: 'CPU Usr', value: "CPU.currentLoadUser"},
            {text: 'CPU Sys', value: "CPU.currentLoadUser"},
            {text: 'RAM Tot', value: "RAM.total"},
            {text: 'RAM Lib', value: "RAM.free"},
            {text: 'RAM Usd', value: "RAM.used"},
            {text: 'PROCESOS', value: "PROCESOS"},
            {text: 'DISCO Tam', value: "DISK[0].size"},
            {text: 'DISCO Usd', value: "DISK[0].used"},
            {text: 'IFACE Conex', value: "CONNEXION[0].iface"},
            {text: 'ESTADO Iface', value: "CONNEXION[0].operstate"},
            {text: 'Fecha / Hora', value: "Fecha"},
        ],
        serviciosyprocesos:[],
        cabecerasServicios:[
            {text: 'Servicio', value: "name"},
            {text: 'Estado activo', value: "running"},
            {text: 'PIDs', value: "pids"},
            {text: 'Arranque', value: "startmode"},
        ],

        itemsCPU:[{
            id: 1,
            name: 'CPU:',
            children:[]
        }],

        itemsRAM:[{
            id: 1,
            name: 'RAM:',
            children:[]
        }],

        itemsDISK:[{
            id: 1,
            name: 'Disco:',
            children:[]
        }],

        itemsPROCESOS:[{
            id: 1,
            name: 'Procesos:',
            children:[]
        }],

        itemsUSB:[{
            id: 1,
            name: 'DISPOSITIVOS',
            children:[],
        }],

        itemsRED:[{
            id: 1,
            name: 'RED',
            children:[],
        }],

         itemsBATERIA:[{
            id: 1,
            name: 'BATERÍA',
            children:[],
        }],

        platform:"",
        distro:"",
        arch:"",
        hostname:"",
        kernel: "",
        boolcarga: true,
        boolConfirmaEliminacion:false,
        boolExito:false,
        boolMuestraBateria:true,
        boolVerServicios:false,
        nombreEquipoMuestra:"",
      }
    },
    components:{
      BarraLateralAdmin,
      BarraLateralSuperUsu
    },
    methods:{

    /** Método encargado de eliminar el equipo 
     * @public
    */
        async eliminarEquipoDelSistema(){

            const docRef = doc(firebaseDB, "Equipos", this.idEquipo);
            await deleteDoc(docRef);

            this.boolExito=true;
        },
        
        /** Método encargado de volver a la ventana de equipos tras la eliminación de un equipo 
        * @public
        */
        volverAEquipos(){
            this.$router.push('/equipos/2');
        },

        /** Método encargado de recuperar y tratar la información correspondiente a la lectura de información de un equipo
         * para que pueda ser mostrada de forma más legible
         */
       async RecuperaInfoEquipo(){

            const docRef=doc(firebaseDB, "Equipos", this.idEquipo);
            const docSnap = await getDoc(docRef);
            this.nombreEquipoMuestra=docSnap.get("NombreEquipo")

            const consulta2 = query(collection(firebaseDB,"Equipos/"+this.idEquipo+"/Monitorizacion"),orderBy("Fecha","desc"),limit(1));
            const querySnapshot2=await getDocs(consulta2);
            querySnapshot2.forEach(async (infoMonit) => { 

                this.itemsCPU[0].children.push({id:2, name:"Carga (%): "+(infoMonit.get("CPU").currentLoad*1).toFixed(2)})
                this.itemsCPU[0].children.push({id:3, name:"Carga Usuario (%): "+(infoMonit.get("CPU").currentLoadUser*1).toFixed(2)})
                this.itemsCPU[0].children.push({id:4, name:"Carga Sistema (%): "+(infoMonit.get("CPU").currentLoadSystem*1).toFixed(2)})
                this.itemsCPU[0].children.push({id:5, name:"Carga Reposo (%): "+(infoMonit.get("CPU").currentLoadIdle*1).toFixed(2)})
                this.itemsCPU[0].children.push({id:6, name:"Carga media: "+(infoMonit.get("CPU").avgLoad*1).toFixed(2)})
                
                this.itemsRAM[0].children.push({id:2, name:"Total (GB): "+(infoMonit.get("RAM").total* (9.53*Math.pow(10, -10))).toFixed(2)})
                this.itemsRAM[0].children.push({id:3, name:"Libre (GB): "+(infoMonit.get("RAM").free* (9.53*Math.pow(10, -10))).toFixed(2)})
                this.itemsRAM[0].children.push({id:4, name:"Usada (GB): "+(infoMonit.get("RAM").used* (9.53*Math.pow(10, -10))).toFixed(2)})
                this.itemsRAM[0].children.push({id:5, name:"Activa (GB): "+(infoMonit.get("RAM").active* (9.53*Math.pow(10, -10))).toFixed(2)})
                this.itemsRAM[0].children.push({id:6, name:"Disponible (GB): "+(infoMonit.get("RAM").available* (9.53*Math.pow(10, -10))).toFixed(2)})

                this.itemsDISK[0].children.push({id:2, name:"Tamaño (GB): "+(infoMonit.get("DISK")[0].size * (9.31*Math.pow(10, -10))).toFixed(2)})
                this.itemsDISK[0].children.push({id:3, name:"Usado (GB): "+(infoMonit.get("DISK")[0].used * (9.31*Math.pow(10, -10))).toFixed(2)})
                this.itemsDISK[0].children.push({id:4, name:"Disponible (GB): "+((infoMonit.get("DISK")[0].size - infoMonit.get("DISK")[0].used) * (9.31*Math.pow(10, -10))).toFixed(2)})
                this.itemsDISK[0].children.push({id:5, name:"Usado (%): "+((infoMonit.get("DISK")[0].use*1)).toFixed(2)});

                var dispConectados=infoMonit.get("USB")
                var i=0;
                var j=2;

                for(var seleccionado in dispConectados){
                    
                    this.itemsUSB[0].children.push({id: j, name: 'USB '+i, children:[],})

                    this.itemsUSB[0].children[i].children.push({id:j, name:"ID: "+ dispConectados[seleccionado].id})
                    j++;
                    this.itemsUSB[0].children[i].children.push({id:j, name:"Nombre: "+ dispConectados[seleccionado].name})
                    j++
                    this.itemsUSB[0].children[i].children.push({id:j, name:"Tipo: "+ dispConectados[seleccionado].type})
                    j++
                    i++ 
                }

                var dispositivosDeRed=infoMonit.get("CONNEXION")
                i=0;
                j=2;
                console.log(dispConectados)
                for(var seleccionado in dispositivosDeRed){
                    
                    this.itemsRED[0].children.push({id: j, name: 'Interfaz '+i, children:[],})

                    this.itemsRED[0].children[i].children.push({id:j, name:"Tipo interfaz: "+ dispositivosDeRed[seleccionado].iface})
                    j++;
                    this.itemsRED[0].children[i].children.push({id:j, name:"Estado: "+ dispositivosDeRed[seleccionado].operstate})
                    j++
                    this.itemsRED[0].children[i].children.push({id:j, name:"Bytes recibidos: "+ dispositivosDeRed[seleccionado].rx_bytes})
                    j++
                    this.itemsRED[0].children[i].children.push({id:j, name:"Errores recibidos: "+ dispositivosDeRed[seleccionado].rx_errors})
                    j++
                    i++ 
                }

                this.itemsBATERIA[0].children.push({id:2, name:"Batería: "+(infoMonit.get("BATTERY").hasBattery)})
                this.itemsBATERIA[0].children.push({id:3, name:"En carga: "+(infoMonit.get("BATTERY").isCharging)})
                this.itemsBATERIA[0].children.push({id:4, name:"Cap Desig: "+(infoMonit.get("BATTERY").designedCapacity)})
                this.itemsBATERIA[0].children.push({id:5, name:"Cap Max: "+(infoMonit.get("BATTERY").maxCapacity)})
                this.itemsBATERIA[0].children.push({id:6, name:"Cap Act: "+(infoMonit.get("BATTERY").currentCapacity)})
                this.itemsBATERIA[0].children.push({id:7, name:"Voltaje: "+(infoMonit.get("BATTERY").voltage)})
                this.itemsBATERIA[0].children.push({id:8, name:"Carga(%): "+(infoMonit.get("BATTERY").percent)})


                this.distro=infoMonit.get("OSINFO").distro;
                this.platform="Plataforma: "+infoMonit.get("OSINFO").platform;
                this.arch="Arquitectura: "+infoMonit.get("OSINFO").arch;
                this.hostname="Nombre del host: "+infoMonit.get("OSINFO").hostname; 
                this.kernel="Kernel: "+infoMonit.get("OSINFO").kernel;

                this.itemsPROCESOS[0].children.push({id:2, name:"Total: "+infoMonit.get("PROCESOS")})
                
                if(infoMonit.get("OSINFO").platform=="Windows"){
                    this.boolMuestraBateria=false;
                }

                this.boolcarga=false;

                var todosLosServicios=infoMonit.get("SERVICIOS");
                
                for(var seleccionado in todosLosServicios){
                    this.serviciosyprocesos.push(todosLosServicios[seleccionado])
                }

            });

            const avisosRef = collection(firebaseDB, 'AvisosDeAlerta');

            const consulta =  query(avisosRef, where("IdEquipo", "==", this.idEquipo), orderBy("Fecha","desc"));
            const querySnapshot = await getDocs(consulta);
            
            querySnapshot.forEach((doc) => {
                this.avisos.push(doc.data());
            });

            //Casteamos la fecha de cada ticket para darle un formato en el que mostrarlo
            this.avisos.forEach(async function(aviso){
            var fechita=await (aviso.Fecha).toDate()
            aviso.Fecha = ''+ await fechita.getHours();
            aviso.Fecha += ':'+ await fechita.getMinutes();
            aviso.Fecha += ' / '+ await fechita.getDate();
            aviso.Fecha += '-'+ await fechita.getMonth();
            aviso.Fecha += '-' + await fechita.getFullYear();
            });


            //Ahora recuperamos el historial de lecturas
            const monitorizacionRef = collection(firebaseDB, 'Equipos',this.idEquipo,'Monitorizacion');

            const consulta3 =  query(monitorizacionRef, orderBy("Fecha","desc"));
            const querySnapshot3 = await getDocs(consulta3);
            var i=0;

            querySnapshot3.forEach(async (doc) => {
               await this.historicoMonit.push(doc.data());
                this.historicoMonit[i].CPU.currentLoad=(this.historicoMonit[i].CPU.currentLoad*1).toFixed(2);
                this.historicoMonit[i].CPU.currentLoadUser=(this.historicoMonit[i].CPU.currentLoadUser*1).toFixed(2);
                this.historicoMonit[i].CPU.currentLoadSystem=(this.historicoMonit[i].CPU.currentLoadSystem*1).toFixed(2);

                this.historicoMonit[i].RAM.total=((this.historicoMonit[i].RAM.total)* (9.53*Math.pow(10, -10))).toFixed(2)
                this.historicoMonit[i].RAM.free=((this.historicoMonit[i].RAM.free)* (9.53*Math.pow(10, -10))).toFixed(2)
                this.historicoMonit[i].RAM.used=((this.historicoMonit[i].RAM.used)* (9.53*Math.pow(10, -10))).toFixed(2)

                this.historicoMonit[i].DISK[0].size=(this.historicoMonit[i].DISK[0].size * (9.31*Math.pow(10, -10))).toFixed(2)
                this.historicoMonit[i].DISK[0].used=(this.historicoMonit[i].DISK[0].used * (9.31*Math.pow(10, -10))).toFixed(2)
               ++i;
            });

            this.historicoMonit.forEach(async function(historicoMonito){
            var fechita=await (historicoMonito.Fecha).toDate()
            historicoMonito.Fecha = ''+ await fechita.getHours();
            historicoMonito.Fecha += ':'+ await fechita.getMinutes();
            historicoMonito.Fecha += ' / '+ await fechita.getDate();
            historicoMonito.Fecha += '-'+ await fechita.getUTCMonth();
            historicoMonito.Fecha += '-' + await fechita.getFullYear();
            });

           
       }
    },
    mounted(){
        this.RecuperaInfoEquipo();
    }
  }


</script>