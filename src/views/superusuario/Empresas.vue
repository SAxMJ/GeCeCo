<template>
<div>
     <h1> Esto es empresas </h1>
    <BarraLateralSuperUsu v-if = "rol==3"></BarraLateralSuperUsu>
  </div>
</template>

<script>
  
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
      BarraLateralSuperUsu
    }
  }
</script>