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
    path: '/passwordolvidada',
    name: 'passwordolvidada',
    component: () => import( '../views/PasswordOlvidada.vue')
  },
  {
    path: '/registeradmin/:rol',
    name: 'registeradmin',
    component: () => import( '../views/admin/RegisterAdmin.vue')
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
  },
  {
    path: '/registersuperusu/:rol',
    name: 'registersuperusu',
    component: () => import('../views/superusuario/RegisterSuperUsu.vue')
  },
  {
    path: '/registerempresa/:rol',
    name: 'registerempresa',
    component: () => import('../views/superusuario/RegisterEmpresa.vue')
  },
  {
    path: '/superusuarios/:rol',
    name: 'superusuarios',
    component:() => import('../views/superusuario/SuperUsuarios.vue')
  },
  {
    path: '/verusuario/:rol/:correoUsuario',
    name: 'verusuario',
    component:() => import('../views/admin/VerUsuario.vue')
  },
  {
    path: '/fichaempresa/:rol/:idEmpresa',
    name: 'fichaEmpresa',
    component:() => import('../views/superusuario/FichaEmpresa.vue')
  },
  {
    path: '/verusuariosdeempresa/:rol/:idEmpresa',
    name: 'verusuariosdeempresa',
    component:() => import('../views/superusuario/VerUsuariosDeEmpresa.vue')
  },
  {
    path: '/verequipo/:rol/:idEquipo',
    name: 'verequipo',
    component:() => import('../views/admin/VerEquipo.vue')
  },

  
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
      }else if(to.path=='/passwordolvidada'){
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
          const consulta =  query(collection(firebaseDB, "RolUser"), where("Correo", "==", user.email), where("ROL", "==", "Admin"));
          onSnapshot(consulta, (querySnapshot) => {
            //Si se ha recuperado al menos un resultado quiere decir que el usuario con dicho UID es admin
            if(querySnapshot.size!==0){
              rol=2;
              ejecutaRuta(rol,to,next);
            }
          });

          const consulta2 =  query(collection(firebaseDB, "RolUser"), where("Correo", "==", user.email), where("ROL", "==", "SuperUsu"));
          onSnapshot(consulta2, (querySnapshot) => {
          //Si se ha recuperado al menos un resultado quiere decir que el usuario con dicho UID es admin
          if(querySnapshot.size!==0){
            rol=3;
            ejecutaRuta(rol,to,next);
          }
        });

          const consulta3 =  query(collection(firebaseDB, "RolUser"), where("Correo", "==", user.email), where("ROL", "==", "Trabajador"));
          onSnapshot(consulta3, (querySnapshot) => {
          //Si se ha recuperado al menos un resultado quiere decir que el usuario con dicho UID es admin
          if(querySnapshot.size!==0){
            ejecutaRuta(rol,to,next);
          }
        });

  return 1;
}

function ejecutaRuta(rol,to,next){
    
  //Dividiremos las cadenas parapoder recuperar los diferentes argumentos que pasamos como parámetros, como puede ser un idUsuario
    var tempCadena=to.path;
    var x=tempCadena.split("/"); //nos interesa el tercer elemento x[2]

    //Cualquier rol puede acceder a estas URL
    if(rol==1){
      if(to.path==='/login'){
        next('paginainicio/'+rol)
      }
      else if(to.path==='/paginainicio/1' && to.path!=='paginainicio/2' && to.path!=='paginainicio/3'){
        next()
      }
      else if(to.path==='/ticketsusuario/1' && to.path!=='ticketsusuario/2' && to.path!=='ticketsusuario/3'){
        next()
      }
      else if(to.path==='/miusuario/1' && to.path!=='miusuario/2' && to.path!=='miusuario/3'){ 
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
    console.log("To path: "+to.path+ " X3 "+x[3])
    //Admin y superusuario pueden acceder a estas URL
    if(rol==2){
      console.log("EL ROL ES");

      if(to.path==='/login'){
        next('paginainicio/'+rol)
      }
      else if(to.path==='/paginainicio/2' && to.path!=='paginainicio/1' && to.path!=='paginainicio/3'){
        next()
      }
      else if(to.path==='/ticketsusuario/2' && to.path!=='ticketsusuario/1' && to.path!=='ticketsusuario/3'){
        next()
      }
      else if(to.path==='/miusuario/2' && to.path!=='miusuario/1' && to.path!=='miusuario/3'){ 
        next()
      }
      else if(to.path==='/equipos/2'  && to.path!=='equipos/1' && to.path!=='equipos/3'){
        next()
      }
      else if(to.path==='/alertas/2' && to.path!=='alertas/1' && to.path!=='alertas/3'){ //Controlaremos que solo si es un admin pueda acceder
        next()
      }
      else if(to.path==='/usuarios/2'  && to.path!=='usuarios/1' && to.path!=='usuarios/3'){ //Controlaremos que solo si es un admin pueda acceder
        next()
      }
      else if(to.path==='/ticketsadmin/2'  && to.path!=='ticketsadmin/1' && to.path!=='ticketsadmin/3'){ //Controlaremos que solo si es un admin pueda acceder
        next()
      }
      else if(to.path==='/registeradmin/2' && to.path!=='registeradmin/1' && to.path!=='registeradmin/3'){ //Controlaremos que solo si es un admin pueda acceder
        next()
      }
      else if(to.path==='/verusuario/2/'+x[3] && to.path!=='registeradmin/1' && to.path!=='registeradmin/3'){ //Controlaremos que solo si es un admin pueda acceder
        next()
      }
      else if(to.path==='/'){
          next();
      }
      else if(to.path==='/cambiarpassword/2'  && to.path!=='cambiarpassword/3' && to.path!=='cambiarpassword/1'){ //Controlaremos que solo si es un admin pueda acceder
        console.log(to.path);
        next()
      }
      else if(to.path==='/verequipo/2/'+x[3]  && to.path!=='verequipo/3' && to.path!=='verequipo/1'){ //Controlaremos que solo si es un admin pueda acceder
        console.log(to.path);
        next()
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
        next()
      }
      else if(to.path==='/ticketsusuario/3' && to.path!=='ticketsusuario/1' && to.path!=='ticketsusuario/2'){
        next()
      }
      else if(to.path==='/miusuario/3' && to.path!=='miusuario/1' && to.path!=='miusuario/2'){ 
        next()
      }
      else if(to.path==='/equipos/3'  && to.path!=='equipos/1' && to.path!=='equipos/2'){
        next()
      }
      else if(to.path==='/alertas/3' && to.path!=='alertas/1' && to.path!=='alertas/2'){ //Controlaremos que solo si es un admin pueda acceder
        next()
      }
      else if(to.path==='/usuarios/3'  && to.path!=='usuarios/1' && to.path!=='usuarios/2'){ //Controlaremos que solo si es un admin pueda acceder
        next()
      }
      else if(to.path==='/ticketsadmin/3'  && to.path!=='ticketsadmin/1' && to.path!=='ticketsadmin/2'){ //Controlaremos que solo si es un admin pueda acceder
        next()
      }
      else if(to.path==='/empresas/3'  && to.path!=='empresas/1' && to.path!=='empresas/2'){ //Controlaremos que solo si es un admin pueda acceder
        console.log(to.path);
        next()
      }
      else if(to.path==='/cambiarpassword/3'  && to.path!=='cambiarpassword/1' && to.path!=='cambiarpassword/2'){ //Controlaremos que solo si es un admin pueda acceder
        console.log(to.path);
        next()
      }
      else if(to.path==='/registersuperusu/3'  && to.path!=='registersuperusu/1' && to.path!=='registersuperusu/2'){ //Controlaremos que solo si es un admin pueda acceder
        console.log(to.path);
        next()
      }
      else if(to.path==='/registerempresa/3'  && to.path!=='registerempresa/1' && to.path!=='registerempresa/2'){ //Controlaremos que solo si es un admin pueda acceder
        console.log(to.path);
        next()
      }
      else if(to.path==='/superusuarios/3'  && to.path!=='superusuarios/1' && to.path!=='superusuarios/2'){ //Controlaremos que solo si es un admin pueda acceder
        console.log(to.path);
        next()
      }
      else if(to.path==='/fichaempresa/3/'+x[3]  && to.path!=='fichaempresa/1' && to.path!=='fichaempresa/2'){ //Controlaremos que solo si es un admin pueda acceder
        console.log(to.path);
        next()
      }
      else if(to.path==='/verusuariosdeempresa/3/'+x[3]  && to.path!=='verusuariosdeempresa/1' && to.path!=='verusuariosdeempresa/2'){ //Controlaremos que solo si es un admin pueda acceder
        console.log(to.path);
        next()
      }
      else if(to.path!=='/verusuario/2/'+x[3] && to.path!=='registeradmin/1' && to.path==='/verusuario/3/'+x[3]){ //Controlaremos que solo si es un admin pueda acceder
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
