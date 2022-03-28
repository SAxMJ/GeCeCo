import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import { getAuth,  onAuthStateChanged } from "firebase/auth";
import firebaseApp from '../scripts/firebase';
import { getFirestore,collection, query, where, getDocs, onSnapshot  } from "firebase/firestore";

Vue.use(VueRouter)

const routes = [
  //Para cualquier URL mal formada, redireccionaré al login
  {
    path: '*',
    redirect: '/'
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
    path: '/registersuperusu/:rol',
    name: 'registersuperusu',
    component: () => import( '../views/RegisterSuperUsu.vue')
  },
  {
    path: '/registeradmin/:rol',
    name: 'registeradmin',
    component: () => import( '../views/RegisterAdmin.vue')
  },
  {
    path: '/paginainicio/:rol',
    name: 'paginainicio',
    component: () => import('../views/trabajador/PaginaInicio.vue')
  },
  {
    path: '/cambiarpassword/:rol',
    name: 'cambiarpassword',
    component: () => import('../views/CambiarPassword.vue')
  },
  {
    path: '/ticketsusuario/:rol',
    name: 'ticketsusuario',
    component: () => import('../views/trabajador/TicketsUsuario.vue')
  },
  {
    path: '/miusuario/:rol',
    name: 'miusuario',
    component: () => import('../views/trabajador/MiUsuario.vue')
  },
  {
    path: '/alertas/:rol',
    name: 'alertas',
    component: () => import('../views/admin/Alertas.vue')
  },
  {
    path: '/equipos/:rol',
    name: 'equipos',
    component: () => import('../views/admin/Equipos.vue')
  },
  {
    path: '/ticketsadmin/:rol',
    name: 'ticketsadmin',
    component: () => import('../views/admin/TicketsAdmin.vue')
  },
  {
    path: '/usuarios/:rol',
    name: 'usuarios',
    component: () => import('../views/admin/Usuarios.vue')
  },
  {
    path: '/empresas/:rol',
    name: 'empresas',
    component: () => import('../views/superusuario/Empresas.vue')
  }

  
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to,from,next)=>{
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      //Si hay sesión de usurio lo que haremos será comprobar el rol que tiene el usuario y en función de eso le enviaremos con la informacion
      //de rol correspondiente
      if (user) {        
        getRol(to,next,user);
      }
      else if(to.path=='/'){
        next();
      }else if(to.path=='/login'){
        next();
      }
      else{
        next('/null');
      }
    });
  });

function getRol(to,next,user){
          var rol=1;
          //vuewait.start("Esperando");
          const firebaseDB= getFirestore(firebaseApp);  
          //Recordar que la , en mongo era como un and
          const consulta =  query(collection(firebaseDB, "RolUser"), where("UID", "==", user.uid), where("ROL", "==", "Admin"));
          onSnapshot(consulta, (querySnapshot) => {
            //Si se ha recuperado al menos un resultado quiere decir que el usuario con dicho UID es admin
            if(querySnapshot.size!==0){
              console.log("SoyAdmin");
              rol=2;
              ejecutaRuta(rol,to,next);
              console.log("rol es "+rol);
            }else{
              console.log("No soy admin")
            }
          });

          const consulta2 =  query(collection(firebaseDB, "RolUser"), where("UID", "==", user.uid), where("ROL", "==", "SuperUsu"));
          onSnapshot(consulta2, (querySnapshot) => {
          //Si se ha recuperado al menos un resultado quiere decir que el usuario con dicho UID es admin
          if(querySnapshot.size!==0){
            console.log("SuperUsu");
            rol=3;
            ejecutaRuta(rol,to,next);
          }else{
            console.log("No soy SuperUsu");
          }
        });

          const consulta3 =  query(collection(firebaseDB, "RolUser"), where("UID", "==", user.uid), where("ROL", "==", "Trabajador"));
          onSnapshot(consulta3, (querySnapshot) => {
          //Si se ha recuperado al menos un resultado quiere decir que el usuario con dicho UID es admin
          if(querySnapshot.size!==0){
            console.log("Trabajador");
            ejecutaRuta(rol,to,next);
          }else{
            console.log("No soy Trabajador")
          }
        });

  return 1;
}

function ejecutaRuta(rol,to,next){

    //Cualquier rol puede acceder a estas URL
    if(rol==1){
      if(to.path==='/login'){
        console.log(to.path);
        next('paginainicio/'+rol)
      }
      else if(to.path==='/paginainicio/1' && to.path!=='paginainicio/2' && to.path!=='paginainicio/3'){
        console.log(to.path);
        next()
      }
      else if(to.path==='/ticketsusuario/1' && to.path!=='ticketsusuario/2' && to.path!=='ticketsusuario/3'){
        console.log(to.path);
        next()
      }
      else if(to.path==='/miusuario/1' && to.path!=='miusuario/2' && to.path!=='miusuario/3'){ 
        console.log(to.path);
        next()
      }else if(to.path==='/'){
        next();
        return 1;
      }
      else{
        console.log(to.path);
        next('/null');
      }
    }


    //Admin y superusuario pueden acceder a estas URL
    if(rol==2){
      console.log("EL ROL ES");

      if(to.path==='/login'){
        console.log(to.path);
        next('paginainicio/'+rol)
      }
      else if(to.path==='/paginainicio/2' && to.path!=='paginainicio/1' && to.path!=='paginainicio/3'){
        console.log(to.path);
        next()
      }
      else if(to.path==='/ticketsusuario/2' && to.path!=='ticketsusuario/1' && to.path!=='ticketsusuario/3'){
        console.log(to.path);
        next()
      }
      else if(to.path==='/miusuario/2' && to.path!=='miusuario/1' && to.path!=='miusuario/3'){ 
        console.log(to.path);
        next()
      }
      else if(to.path==='/equipos/2'  && to.path!=='equipos/1' && to.path!=='equipos/3'){
        console.log(to.path);
        next()
      }
      else if(to.path==='/alertas/2' && to.path!=='alertas/1' && to.path!=='alertas/3'){ //Controlaremos que solo si es un admin pueda acceder
        console.log(to.path);
        next()
      }
      else if(to.path==='/usuarios/2'  && to.path!=='usuarios/1' && to.path!=='usuarios/3'){ //Controlaremos que solo si es un admin pueda acceder
        console.log(to.path);
        next()
      }
      else if(to.path==='/ticketsadmin/2'  && to.path!=='ticketsadmin/1' && to.path!=='ticketsadmin/3'){ //Controlaremos que solo si es un admin pueda acceder
        console.log(to.path+"hahaha");
        next()
      }
      else if(to.path==='/'){
          next();
      }
      else{
        console.log(to.path);
        next('/null');
      }
}
    //Super usuario puede acceder a estas url
    if(rol>=3){
      if(to.path==='/login'){
        console.log(to.path);
        next('paginainicio/'+rol)
      }
      else if(to.path==='/paginainicio/3' && to.path!=='paginainicio/1' && to.path!=='paginainicio/2'){
        console.log(to.path);
        next()
      }
      else if(to.path==='/ticketsusuario/3' && to.path!=='ticketsusuario/1' && to.path!=='ticketsusuario/2'){
        console.log(to.path);
        next()
      }
      else if(to.path==='/miusuario/3' && to.path!=='miusuario/1' && to.path!=='miusuario/2'){ 
        console.log(to.path);
        next()
      }
      else if(to.path==='/equipos/3'  && to.path!=='equipos/1' && to.path!=='equipos/2'){
        console.log(to.path);
        next()
      }
      else if(to.path==='/alertas/3' && to.path!=='alertas/1' && to.path!=='alertas/2'){ //Controlaremos que solo si es un admin pueda acceder
        console.log(to.path);
        next()
      }
      else if(to.path==='/usuarios/3'  && to.path!=='usuarios/1' && to.path!=='usuarios/2'){ //Controlaremos que solo si es un admin pueda acceder
        console.log(to.path);
        next()
      }
      else if(to.path==='/ticketsadmin/3'  && to.path!=='ticketsadmin/1' && to.path!=='ticketsadmin/2'){ //Controlaremos que solo si es un admin pueda acceder
        console.log(to.path+"hahaha");
        next()
      }
      else if(to.path==='/empresas/3'  && to.path!=='empresas/1' && to.path!=='empresas/2'){ //Controlaremos que solo si es un admin pueda acceder
        console.log(to.path);
        next()
      }
      else if(to.path==='/'){
          next();
      }
      else{
        console.log(to.path);
        next('/null');
      }
    }
}

export default router;
