<template>
<div>
     <v-main > 
       <!-- {{probarMonitorizacion()}}-->
        <!-- {{monitorizarPeriodico()}} -->
       {{monitorizarPeriodico()}}
      <v-container class="grey lighten-2">
      <v-row rows="6" md="6">
        <v-col cols="12" md="2">
        <v-card>One of three columns</v-card>
        </v-col>
    
      <v-col cols="12" md="4">
        <v-card width="400px" height="400px">
          <v-container width="20" height="20">
            <v-card>CPU</v-card>
                <v-progress-circular
                  :size="50"
                  color="primary"
                  indeterminate
                  v-show="boolcarga===true"
                ></v-progress-circular>
              <canvas v-show="boolcarga===false" id="laCPU" width="200" height="200"></canvas>
          </v-container>
        </v-card>
      </v-col>
       <v-col cols="12" md="4">
       <v-card width="400px" height="400px">
          <v-container width="20" height="20">
            <v-card>RAM</v-card>
            <v-progress-circular
            :width="3"
            color="red"
            indeterminate
            v-show="boolcarga===true"
            ></v-progress-circular>
            <canvas v-show="boolcarga===false" id="laRAM" width="200" height="200"></canvas>
          </v-container>
        </v-card>
      </v-col>
      <v-col cols="12" md="2">
        <v-card>One of three columns</v-card>
      </v-col>
    </v-row>

    <v-row rows="6" md="6">
       <v-col cols="12" md="4">
        <v-card width="400px" height="400px">
          <v-container width="20" height="20">
            <v-card>Disco</v-card>
            <v-progress-circular
            :size="70"
            :width="7"
            color="purple"
            indeterminate
            v-show="boolcarga===true"
            ></v-progress-circular>
            <canvas v-show="boolcarga===false" id="elDisco" width="200" height="200"></canvas>
          </v-container>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card width="400px" height="400px">
          <v-container width="20" height="20">
            <v-card>Info Sistema</v-card>
              <v-card-title align-content-center>{{distro}}</v-card-title>
              <v-card-text>{{platform}}</v-card-text>
              <v-card-text>{{arch}}</v-card-text>
              <v-card-text>{{hostname}}</v-card-text>
              <v-card-text>{{kernel}}</v-card-text>
              <v-progress-circular
              :width="3"
              color="green"
              indeterminate
              v-show="boolcarga===true"
              ></v-progress-circular>
          </v-container>
        </v-card>
      </v-col>
       <v-col cols="12" md="4">
        <v-card width="400px" height="400px">
          <v-container width="20" height="20" >
            <v-card>Red</v-card>
             <v-progress-circular
              :size="50"
              color="amber"
              indeterminate
              v-show="boolcarga===true"
              ></v-progress-circular>
            <canvas v-show="boolcarga===false" id="laRed" width="200" height="200"></canvas>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
      </v-main>

    <BarraLateral v-if = "rol==1"></BarraLateral>
    <BarraLateralAdmin v-if = "rol==2"></BarraLateralAdmin>
    <BarraLateralSuperUsu v-if = "rol==3"></BarraLateralSuperUsu>
  </div>
</template>

<script>
  
  import BarraLateral from '../../components/BarraLateralNormal.vue'
  import BarraLateralAdmin from '../../components/BarraLateralAdmin.vue'
  import BarraLateralSuperUsu from '../../components/BarraLateralSuperUsu.vue'
  import { httpsCallable } from "firebase/functions";
  import { getApp } from "firebase/app";
  import { getAuth } from "firebase/auth";
  import { getFunctions, connectFunctionsEmulator } from "firebase/functions"
   import firebaseApp from '../../scripts/firebase'
  import {getFirestore, updateDoc, query, getDocs, collection, where} from "firebase/firestore"
  import Chart from 'chart.js/auto';
  
  
  const functions = getFunctions(getApp());
  connectFunctionsEmulator(functions, "localhost", 5001);
  const firebaseDB= getFirestore(firebaseApp);

  var rolUsr=1;
  console.log("Es--> " +rolUsr);
  var lacpu='';
  var lamemoria='';

  var inicializaGraficas=1;

  //Las gráficas
  var laCPU;
  var laRAM;
  var laGPU;
  var laRED;
  var elDISCO;

  export default{
    data (){
      
      return{
        rol: this.$route.params.rol,
        cosas:[],
        itemsMonitorizacion:[],

        platform:"",
        distro:"",
        arch:"",
        hostname:"",
        kernel: "",
        boolcarga: true,
      }

    },
    components:{
      BarraLateral,
      BarraLateralAdmin,
      BarraLateralSuperUsu
    },
    methods:{
      monitorizarPeriodico(){
        setInterval(this.monitorizaYAlmacena, 10000);  
      },
      async monitorizaYAlmacena(){
          
          //Script con el módulo que nos devuelve la informción de la monitorización
          //var monitor = require('../../../functions/monitorizador');
          console.log("AQUI SI SI");
          const auth=getAuth();


          //const estadoDeLaMaquina=httpsCallable(functions,"estadoDeLaMaquina");
          //console.log("AQUI TAMBIEN");
          //estadoDeLaMaquina().then(async(infoMonit) => {
            //monitor.Monitorizador().then(async(infoMonit) => {
            console.log("Aqui llego");
            const consulta = query(collection(firebaseDB, "Equipos"), where("IdUsuario", "==", auth.currentUser.uid));
            const querySnapshot = await getDocs(consulta);
              console.log("Aqui llego2");
              querySnapshot.forEach(async(doc) => {
                await updateDoc(doc.ref, {
                  CPU:infoMonit.data.laCpu,
                  CPU2:infoMonit.data.laCpu2,
                  DISK: infoMonit.data.elDisk,
                  RAM: infoMonit.data.laRam,
                  GPU: infoMonit.data.laGpu,
                  CONNEXION: infoMonit.data.laConexion,
              });
            });
            this.descargaYMuestraMonitorizacion(infoMonit)
          //});

        }, //En este método vamos a obtener los datos de monitorización y a actualizar las gráficas
        descargaYMuestraMonitorizacion(infoMonit){

          console.log("Aqui llego3");
          var ctxcpu = document.getElementById("laCPU").getContext("2d");
          var ctxram = document.getElementById("laRAM").getContext("2d");
          var ctxred = document.getElementById("laRed").getContext("2d");
          var ctxdisco = document.getElementById("elDisco").getContext("2d");

          if(inicializaGraficas==0){
  
            //Actualizamos las gráficas
            laCPU.data.datasets[0].data[0]=infoMonit.data.laCpu.currentload;
            laCPU.data.datasets[0].data[1]=infoMonit.data.laCpu.currentload_idle;
            laCPU.data.datasets[0].data[2]=infoMonit.data.laCpu.currentload_system;
            laCPU.data.datasets[0].data[3]=infoMonit.data.laCpu.currentload_user;
            laCPU.update();

            laRAM.data.datasets[0].data[0]=infoMonit.data.laRam.total* (9.53*Math.pow(10, -10));
            laRAM.data.datasets[0].data[1]=infoMonit.data.laRam.free* (9.53*Math.pow(10, -10));
            laRAM.data.datasets[0].data[2]=infoMonit.data.laRam.used* (9.53*Math.pow(10, -10)); 
            laRAM.data.datasets[0].data[3]=infoMonit.data.laRam.active* (9.53*Math.pow(10, -10));
            laRAM.data.datasets[0].data[4]=infoMonit.data.laRam.available* (9.53*Math.pow(10, -10));
            laRAM.update();

            elDISCO.data.datasets[0].data[0]=infoMonit.data.elDisk.used * (9.31*Math.pow(10, -10));
            elDISCO.data.datasets[0].data[1]=infoMonit.data.elDisk.size * (9.31*Math.pow(10, -10)),
            elDISCO.data.datasets[0].data[2]=(infoMonit.data.elDisk.size - infoMonit.data.elDisk.used) * (9.31*Math.pow(10, -10));
            elDISCO.data.datasets[0].data[3]=infoMonit.data.elDisk.use;
            elDISCO.update();

            laRED.data.datasets[0].data[0]=infoMonit.data.laConexion[0].ms/100;
            laRED.data.datasets[0].data[1]=infoMonit.data.laConexion[0].rx_bytes * (9.53*Math.pow(10, -7));
            laRED.data.datasets[0].data[2]=infoMonit.data.laConexion[0].rx_dropped; 
            laRED.data.datasets[0].data[3]=infoMonit.data.laConexion[0].rx_errors;
            laRED.data.datasets[0].data[4]=infoMonit.data.laConexion[0].rx_sec* 0.000977;
            laRED.update();
          }
          
          //GráficaCPU
          if(inicializaGraficas!=0){
            laCPU = new Chart(ctxcpu, {
              type: 'doughnut',
              data: {
                  labels: ['Carga', 'Libre', 'Carga sistema', 'Carga usuario'],
                  datasets: [{
                      label: '# of Votes',
                      data: [ 
                      infoMonit.data.laCpu.currentload, 
                      infoMonit.data.laCpu.currentload_idle, 
                      infoMonit.data.laCpu.currentload_system, 
                      infoMonit.data.laCpu.currentload_user, 
                      ],
                      backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)'],
                      borderColor: ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)'],
                      borderWidth: 1
                  }]
              },
              options: {
                  scales: {
                      y: {
                          beginAtZero: true
                      }
                  }
              }
          });
            
          //GráficaRAM
            laRAM = new Chart(ctxram, {
              type: 'doughnut',
              data: {
                  labels: ['Total', 'Libre', 'En Uso', 'Activa', 'Disponible'],
                  datasets: [{
                      label: '# of Votes',
                      data: [ 
                      infoMonit.data.laRam.total* (9.53*Math.pow(10, -10)), 
                      infoMonit.data.laRam.free* (9.53*Math.pow(10, -10)), 
                      infoMonit.data.laRam.used* (9.53*Math.pow(10, -10)), 
                      infoMonit.data.laRam.active* (9.53*Math.pow(10, -10)),
                      infoMonit.data.laRam.available* (9.53*Math.pow(10, -10)), 
                      ],
                      backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(75, 0, 192, 0.2)'],
                      borderColor: ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(75, 0, 192, 1)'],
                      borderWidth: 1
                  }]
              },
              options: {
                  scales: {
                      y: {
                          beginAtZero: true
                      }
                  }
              }
          });

          //GráficaDISCO
            elDISCO = new Chart(ctxdisco, {
              type: 'doughnut',
              data: {
                  labels: ['Usado (GB)','Tamaño (GB)', 'Disponible (GB)' ,'USO %',],
                  datasets: [{
                      label: '# of Votes',
                      data: [ 
                      infoMonit.data.elDisk.used * (9.31*Math.pow(10, -10)),
                      infoMonit.data.elDisk.size * (9.31*Math.pow(10, -10)), 
                      (infoMonit.data.elDisk.size - infoMonit.data.elDisk.used) * (9.31*Math.pow(10, -10)), 
                      infoMonit.data.elDisk.use, 
                      ],
                      backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)',],
                      borderColor: ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)',],
                      borderWidth: 1
                  }]
              },
              options: {
                  scales: {
                      y: {
                          beginAtZero: true
                      }
                  }
              }
          });

          //GráficaRED
            laRED = new Chart(ctxred, {
              type: 'doughnut',
              data: {
                  labels: ['MS/100', 'MBytes Recibidos', 'Bytes Perdidos' ,'Errores recibidos', 'KBytes Recibidos/seg',],
                  datasets: [{
                      label: '# of Votes',
                      data: [ 
                      infoMonit.data.laConexion[0].ms/100, 
                      infoMonit.data.laConexion[0].rx_bytes * (9.53*Math.pow(10, -7)),
                      infoMonit.data.laConexion[0].rx_dropped, 
                      infoMonit.data.laConexion[0].rx_errors, 
                      infoMonit.data.laConexion[0].rx_sec* 0.000977, 
                      ],
                      backgroundColor: ['rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(75, 0, 192, 0.2)'],
                      borderColor: ['rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(75, 0, 192, 1)'],
                      borderWidth: 1
                  }]
              },
              options: {
                  scales: {
                      y: {
                          beginAtZero: true
                      }
                  }
              }
        });
          }
          //INFOR DEL SISTEMA
          this.distro=infoMonit.data.laOsinfo.distro;
          this.platform="Plataforma: "+infoMonit.data.laOsinfo.platform;
          this.arch="Arquitectura: "+infoMonit.data.laOsinfo.arch;
          this.hostname="Nombre del host: "+infoMonit.data.laOsinfo.hostname; 
          this.kernel="Kernel: "+infoMonit.data.laOsinfo.kernel;

          if(this.boolcarga==true)
            this.boolcarga=false;

            inicializaGraficas=0;
        }

        }
    }
 

</script>