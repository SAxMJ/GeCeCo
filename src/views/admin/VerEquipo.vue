<template>
<div>
    <v-main > 
        <v-card class="black">{{RecuperaInfoEquipo}}</v-card>
        <v-container class="grey lighten-2">
        <v-row rows="6" md="6">
            
            <v-col cols="12" md="2">
                <v-card>
                    <template>
                        <v-treeview :items="itemsPROCESOS">Procesos</v-treeview>
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
                <v-card>INFO SISTEMA</v-card>
                <v-card-title class="justify-center" >{{distro}}</v-card-title>
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
        </v-row>

        <v-row rows="6" md="6">
        </v-row>
    </v-container>
      </v-main>

    <BarraLateralAdmin v-if = "rol==2"></BarraLateralAdmin>
    <BarraLateralSuperUsu v-if = "rol==3"></BarraLateralSuperUsu>
  </div>
</template>

<script>
  import BarraLateralAdmin from '../../components/BarraLateralAdmin.vue'
  import BarraLateralSuperUsu from '../../components/BarraLateralSuperUsu.vue'
  import {getFirestore, collection, updateDoc,doc, deleteDoc, orderBy, limit} from "firebase/firestore"
  import firebaseApp from '../../scripts/firebase'
  import { getAuth} from "firebase/auth";
  import {query, where, getDocs,addDoc} from "firebase/firestore";
  import { getApp } from "firebase/app";
  import { getFunctions, connectFunctionsEmulator } from "firebase/functions"

//Esto es para poder llamar a las funciones del backend
    const functions = getFunctions(getApp());
    connectFunctionsEmulator(functions, "localhost", 5001);
    const firebaseDB= getFirestore(firebaseApp);

  export default{
    data (){
      return{

        rol: this.$route.params.rol,
        idEquipo: this.$route.params.idEquipo,

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

        platform:"",
        distro:"",
        arch:"",
        hostname:"",
        kernel: "",
        boolcarga: true,
      }
    },
    components:{
      BarraLateralAdmin,
      BarraLateralSuperUsu
    },
   computed:{ 
       async RecuperaInfoEquipo(){
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
                this.itemsRAM[0].children.push({id:4, name:"Usaa (GB): "+(infoMonit.get("RAM").used* (9.53*Math.pow(10, -10))).toFixed(2)})
                this.itemsRAM[0].children.push({id:5, name:"Activa (GB): "+(infoMonit.get("RAM").active* (9.53*Math.pow(10, -10))).toFixed(2)})
                this.itemsRAM[0].children.push({id:6, name:"Disponible (GB): "+(infoMonit.get("RAM").available* (9.53*Math.pow(10, -10))).toFixed(2)})

                this.itemsDISK[0].children.push({id:2, name:"Tamaño (GB): "+(infoMonit.get("DISK")[0].size * (9.31*Math.pow(10, -10))).toFixed(2)})
                this.itemsDISK[0].children.push({id:3, name:"Usado (GB): "+(infoMonit.get("DISK")[0].used * (9.31*Math.pow(10, -10))).toFixed(2)})
                this.itemsDISK[0].children.push({id:4, name:"Disponible (GB): "+((infoMonit.get("DISK")[0].size - infoMonit.get("DISK")[0].used) * (9.31*Math.pow(10, -10))).toFixed(2)})
                this.itemsDISK[0].children.push({id:5, name:"Usado (%): "+((infoMonit.get("DISK")[0].use*1)).toFixed(2)});

                this.distro=infoMonit.get("OSINFO").distro;
                this.platform="Plataforma: "+infoMonit.get("OSINFO").platform;
                this.arch="Arquitectura: "+infoMonit.get("OSINFO").arch;
                this.hostname="Nombre del host: "+infoMonit.get("OSINFO").hostname; 
                this.kernel="Kernel: "+infoMonit.get("OSINFO").kernel;

                this.itemsPROCESOS[0].children.push({id:2, name:"Total: "+infoMonit.get("PROCESOS")})

                this.boolcarga=false;
            });
       }
    },
    methods:{
      
    }
  }


</script>