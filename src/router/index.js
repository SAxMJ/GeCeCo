import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import { getAuth,  onAuthStateChanged } from "firebase/auth";

Vue.use(VueRouter)

const routes = [
  //Para cualquier URL mal formada, redireccionaré al login
  {
    path: '*',
    redirect: '/login'
  },
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: () => import( '../views/Login.vue')
  },
  {
    path: '/registersuperusu',
    name: 'registersuperusu',
    component: () => import( '../views/RegisterSuperUsu.vue')
  },
  {
    path: '/registeradmin',
    name: 'registeradmin',
    component: () => import( '../views/RegisterAdmin.vue')
  },
  {
    path: '/paginainicio',
    name: 'paginainicio',
    component: () => import('../views/PaginaInicio.vue')
    //meta:{
      //autentificado:true
    //}
  }
  
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});


//Comprobación de autenticación antes de acceder a una ruta protegida
router.beforeEach((to,from,next)=>{
  
  if(to.path!=='/'){
    
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      
      if (user) {
        //Si venimos de la pagina de login o vamos al login pero ya existe sesion, mostraremos la pagina de inicio
        if(from.path==='/login' || to.path==='/login'){
          next('paginainicio')
        }
      } else {
        next('login')
      }
    });
  }
  next();
});


export default router;
