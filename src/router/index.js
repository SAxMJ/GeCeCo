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
  },
  {
    path: '/cambiarpassword',
    name: 'cambiarpassword',
    component: () => import('../views/CambiarPassword.vue')
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
    console.log(to.path);

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      
      if (user) {
        //Si venimos de la pagina de login o vamos al login pero ya existe sesion, mostraremos la pagina de inicio
        console.log(user);
        if(to.path==='/login'){
          console.log("entro");
          next('paginainicio')
        }
        else if(to.path==='/registeradmin'){ //Controlaremos que solo si es un admin pueda acceder
          
          const firebaseDB= getFirestore(firebaseApp);                   //Recordar que la , en mongo era como un and
          const consulta = query(collection(firebaseDB, "RolUser"), where("UID", "==", user.uid), where("ROL", "==", "Admin"));
          onSnapshot(consulta, (querySnapshot) => {
            
            //Si se ha recuperado al menos un resultado quiere decir que el usuario con dicho UID es admin
            if(querySnapshot.size!==0){
              console.log("Soy Admin puedo registrar usuarios");
              next();
            }else{
              console.log("No soy admin no puedo registrar usuarios")
              next('login');
            }
        });
        }
        else if(to.path==='/registersuperusu'){ //Controlaremos que solo si es un superusuario pueda acceder
          const firebaseDB= getFirestore(firebaseApp);                   //Recordar que la , en mongo era como un and
          const consulta = query(collection(firebaseDB, "RolUser"), where("UID", "==", user.uid), where("ROL", "==", "Super"));
          onSnapshot(consulta, (querySnapshot) => {
            console.log(querySnapshot.size!==0)
            //Si se ha recuperado al menos un resultado quiere decir que el usuario con dicho UID es admin
            if(querySnapshot.size!==0){
              console.log("Soy super usuario puedo registrar usuarios");
              next();
            }else{
              console.log("No soy admin no puedo registrar usuarios")
              next('login');
            }
        });

        }
      } else {
          if(to.path!=='/login'){
            console.log("no hay user")
            next('login')
          }else{
            next();
          }
      }
    });
  }
    next();
});


export default router;
