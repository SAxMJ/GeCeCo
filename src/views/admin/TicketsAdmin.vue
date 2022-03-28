<template>
<div>
     <h1> Esto es tickets </h1>
    <BarraLateralAdmin v-if = "rol==2"></BarraLateralAdmin>
    <BarraLateralSuperUsu v-if = "rol==3"></BarraLateralSuperUsu>
  </div>
</template>

<script>
  
  import BarraLateralAdmin from '../../components/BarraLateralAdmin.vue'
  import BarraLateralSuperUsu from '../../components/BarraLateralSuperUsu.vue'

  var rolUsr=1;
  console.log("Es--> " +rolUsr);
  
  export default{
    data (){
      return{
        rol: this.$route.params.rol
      }
      },
    components:{
      BarraLateralAdmin,
      BarraLateralSuperUsu
    }
  }
</script>