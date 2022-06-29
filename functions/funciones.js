const functions = require("firebase-functions");
const admin = require('firebase-admin');


const cors = require('cors')({
  origin: true
});

const firebaseConfig = {
  apiKey: "AIzaSyAZWJA8GkibUqjbRRMfFQ_OhYhjOV3NAQs",
  authDomain: "gececo-c0865.firebaseapp.com",
  projectId: "gececo-c0865",
  storageBucket: "gececo-c0865.appspot.com",
  messagingSenderId: "850837378930",
  appId: "1:850837378930:web:8c6aa4e4bd92284a9d2feb"
};

const app=admin.initializeApp(firebaseConfig);


//FUNCIÓN PARA REGISTRAR USUARIOS COMO ADMINISTRADOR
/**Cloud Function para registrar usuarios en el sistema como administrador 
 * @param {any} data - data.usuario Contendrá el email del usuario a registrar
 * @param {any} data - data.pass Contendrá la contraseña del usuario a registrar
*/
exports.registrarTrabajador=functions.https.onCall(async(data, context) => {
  
  var elUID="0";
  await admin.auth().createUser({email: data.usuario, password: data.pass}).then(async(userRecord) => {
    elUID=userRecord.uid;
    console.log("ElUID1"+elUID);
  }).catch((error) => {
      console.log('Error al crear el nuevo usuario', error);
      return "0";
  });

  if(elUID=="0"){
    return "0"
  }else{
    console.log("ELUID2"+elUID)
    return ""+elUID;
  }
});




//Email de restablecimiento de contraseña
/**Cloud Function para enviar un email de restablecimiento de contraseña como administrador 
 * @param {any} data - data.usuario Contendrá el email del usuario a restablecer la contraseña
*/
exports.mailEstablecerPassword=functions.https.onCall(async (data,context)=>{
  cors(data,context,async ()=>{
  console.log("elmail: " +data.usuario);

  try{ //Se envía un mensaje de resauración de la contraseña al email
    await sendPasswordResetEmail(admin.auth(),data.usuario);
    console.log("SE ENVIO EL CORREO DE RESTABLECIMIENTO");
  }catch(e){
    console.log("EL ERRORRrRrR: "+e)
  }
  })
});



//Función para dar de baja un usuario, incluyendo eliminarlo de las bases de datos
/**Cloud Function para dar de baja un usuario como administrador 
 * @param {any} data - data.correo Contendrá el email del usuario al que dar de baja
*/
 exports.darDeBajaUsuario=functions.https.onCall(async(data,context)=>{
   
   //cors(data,context,async ()=>{

    console.log("EL USUARIO EMAIL "+data.correo)
    var eluid
    await admin.auth().getUserByEmail(data.correo).then(async(userRecord)=>{
      console.log("Se recogió correctemente el usuario");
      
      await admin.auth().deleteUser(userRecord.uid).then(()=>{
        console.log("Se eliminó correctemente el usuario");
        eluid=userRecord.uid;
        console.log("ElUIdEs1"+eluid);
      }).catch((error)=>{
        console.log("ERROR al eliminar el usuario: "+error);

      });
    }).catch((error)=>{
        console.log("ERROR al tratar de obtener el usuario: "+error);
    });
    console.log("ElUIdEs2"+eluid);
    
    return ""+eluid;
  //})
});

/**Cloud Function para modificar el email de un usuario dentro del sistema como administrador 
 * @param {any} data - data.correo1 Contendrá el email antiguo del usuario al que se va a modifiar el email
 * @param {any} data - data.correo2 Contendrá el nuevo email del usuario al que se va a modificar el email
*/
exports.modificaCorreoUsuario=functions.https.onCall(async(data,context)=>{
  
  var newCorreo;
  await admin.auth().getUserByEmail(data.correo1).then(async(userRecord)=>{
    console.log("Se recogió correctemente el usuario");
    
     await admin.auth().updateUser(userRecord.uid,{
       email: data.correo2
     }).then((userRecord)=>{
       console.log("Se modificó el email del usuario correctamente: "+userRecord.email);
       newCorreo=userRecord.email;
     }).catch((error)=>{
       console.log("Error mientras se actualizaba el email del usuario: "+error);
     })
  }).catch((error)=>{
      console.log("ERROR al tratar de obtener el usuario: "+error);
  });
  
  return ""+newCorreo;
})

/**Cloud Function que funciona como un disparador cuando un se añade una nueva monitorización a la base de datos, comprobará la información
 * almacenada y la comprobará con las alertas creadas correspondientes por si tuviese que generar un aviso
 * @param {QueryDocumentSnapshot} snap - Contiene toda la información recientemente almacenada en la base de datos correspondiente
 */
exports.newMonitor = functions.firestore.document('Equipos/{idEmpresaUsuario}/Monitorizacion/{idMonit}').onCreate(async (snap, context) => {
    
    var rutaArchivo=snap.ref.path.split("/");
    var limite="";
    var tipoElemento="";
    var valor="";
    var tipo="";
    var idAdmin="";
    //Obtenemos el id de la empresa donde se ha producido la nueva monitorizacion
    var idEmpresa = (await admin.firestore().collection("Equipos").doc(rutaArchivo[1]).get()).data().IdEmpresa;
    var IdUsuario = (await admin.firestore().collection("Equipos").doc(rutaArchivo[1]).get()).data().IdUsuario;
    var nombreEquipo = (await admin.firestore().collection("Equipos").doc(rutaArchivo[1]).get()).data().NombreEquipo;
    var IdEquipo = idEmpresa+""+IdUsuario;

    //Ahora vamos a recuperar la colección de alarmas del dicha empresa
    admin.firestore().collection('Alertas').where("IdEmpresa", "==", idEmpresa).get().then((snapshot) => {

      //Ahora por cada una de las alertas creadas comprobaremos el valor segun la alerta recuperada
      snapshot.forEach(async (doc) => { 
        console.log(doc.data())
        limite=doc.data().Limite;
        tipoElemento=doc.data().TipoElemento;
        valor=doc.data().Valor;
        tipo=doc.data().Tipo;
        idAdmin=doc.data().IdAdmin;
  
        if(tipo=="CPU"){

          if(tipoElemento=="Carga"){
            if(limite=="Supera"){
              if(snap.data().CPU.currentLoad > valor){
               console.log("SuperaCarga")
               await admin.firestore().collection("AvisosDeAlerta").doc(idAdmin+""+IdEquipo+""+tipo+"").set({
                 IdAdmin: idAdmin,
                 IdEquipo: IdEquipo,
                 Limite: limite,
                 Tipo: tipo,
                 TipoElemento: tipoElemento,
                 ValorLimite: valor,
                 ValorObtenido: (snap.data().CPU.currentLoad*1).toFixed(2),
                 Fecha: admin.firestore.FieldValue.serverTimestamp(),
                 Estado: "No resuelta",
                 NombreEquipo:nombreEquipo
               })
              }
            }
            else if(limite=="Menor"){
              if(snap.data().CPU.currentLoad < valor){
                await admin.firestore().collection("AvisosDeAlerta").doc(idAdmin+""+IdEquipo+""+tipo+"").set({
                  IdAdmin: idAdmin,
                  IdEquipo: IdEquipo,
                  Limite: limite,
                  Tipo: tipo,
                  TipoElemento: tipoElemento,
                  ValorLimite: valor,
                  ValorObtenido: (snap.data().CPU.currentLoad*1).toFixed(2),
                  Fecha: admin.firestore.FieldValue.serverTimestamp(),
                  Estado: "No resuelta",
                  NombreEquipo:nombreEquipo
                })
              }
            }
          }

          else if(tipoElemento=="Carga de usuarios"){
            if(limite=="Supera"){
              if(snap.data().CPU.currentLoadUser > valor){
                console.log("SuperaCargaUsuarios")
                await admin.firestore().collection("AvisosDeAlerta").doc(idAdmin+""+IdEquipo+""+tipo+"").set({
                  IdAdmin: idAdmin,
                  IdEquipo: IdEquipo,
                  Limite: limite,
                  Tipo: tipo,
                  TipoElemento: tipoElemento,
                  ValorLimite: valor,
                  ValorObtenido: (snap.data().CPU.currentLoad*1).toFixed(2),
                  Fecha: admin.firestore.FieldValue.serverTimestamp(),
                  Estado: "No resuelta",
                  NombreEquipo:nombreEquipo
                })
              }
            }
            else if(limite=="Menor"){
              if(snap.data().CPU.currentLoadUser < valor){
                await admin.firestore().collection("AvisosDeAlerta").doc(idAdmin+""+IdEquipo+""+tipo+"").set({
                  IdAdmin: idAdmin,
                  IdEquipo: IdEquipo,
                  Limite: limite,
                  Tipo: tipo,
                  TipoElemento: tipoElemento,
                  ValorLimite: valor,
                  ValorObtenido: (snap.data().CPU.currentLoad*1).toFixed(2),
                  Fecha: admin.firestore.FieldValue.serverTimestamp(),
                  Estado: "No resuelta",
                  NombreEquipo:nombreEquipo
                })
              }
            }
          }

          else if(tipoElemento=="Carga de sistema"){
            if(limite=="Supera"){
              if(snap.data().CPU.currentLoadSystem > valor){
                console.log("SuperaCargaUsuarios")
                await admin.firestore().collection("AvisosDeAlerta").doc(idAdmin+""+IdEquipo+""+tipo+"").set({
                  IdAdmin: idAdmin,
                  IdEquipo: IdEquipo,
                  Limite: limite,
                  Tipo: tipo,
                  TipoElemento: tipoElemento,
                  ValorLimite: valor,
                  ValorObtenido: (snap.data().CPU.currentLoad*1).toFixed(2),
                  Fecha: admin.firestore.FieldValue.serverTimestamp(),
                  Estado: "No resuelta",
                  NombreEquipo:nombreEquipo
                })
              }
            }
            else if(limite=="Menor"){
              if(snap.data().CPU.currentLoadSystem < valor){
                await admin.firestore().collection("AvisosDeAlerta").doc(idAdmin+""+IdEquipo+""+tipo+"").set({
                  IdAdmin: idAdmin,
                  IdEquipo: IdEquipo,
                  Limite: limite,
                  Tipo: tipo,
                  TipoElemento: tipoElemento,
                  ValorLimite: valor,
                  ValorObtenido: (snap.data().CPU.currentLoad*1).toFixed(2),
                  Fecha: admin.firestore.FieldValue.serverTimestamp(),
                  Estado: "No resuelta",
                  NombreEquipo:nombreEquipo
                })
              }
            }
          }
        }

        if(tipo=="DISCO"){

          if(tipoElemento=="Usado"){
            if(limite=="Supera"){
              if(snap.data().DISK[0].use>valor){
                console.log("Se supera el límite de disco ocupado")
                await admin.firestore().collection("AvisosDeAlerta").doc(idAdmin+""+IdEquipo+""+tipo+"").set({
                  IdAdmin: idAdmin,
                  IdEquipo: IdEquipo,
                  Limite: limite,
                  Tipo: tipo,
                  TipoElemento: tipoElemento,
                  ValorLimite: valor,
                  ValorObtenido: (snap.data().DISK[0].use*1).toFixed(2),
                  Fecha: admin.firestore.FieldValue.serverTimestamp(),
                  Estado: "No resuelta",
                  NombreEquipo:nombreEquipo
                })
              }
            }
          }

          if(tipoElemento=="Disponible"){
            if(limite=="Menor"){
              var tDisco=snap.data().DISK[0].size * (9.31*Math.pow(10, -10));
              var dUsado=snap.data().DISK[0].used * (9.31*Math.pow(10, -10));
              var porcDisp=(dUsado*100)/tDisco;
              porcDisp=100-porcDisp;

              if(porcDisp<valor){
                console.log("El porentaje disponible es menor que el límite establecido ")
                await admin.firestore().collection("AvisosDeAlerta").doc(idAdmin+""+IdEquipo+""+tipo+"").set({
                  IdAdmin: idAdmin,
                  IdEquipo: IdEquipo,
                  Limite: limite,
                  Tipo: tipo,
                  TipoElemento: tipoElemento,
                  ValorLimite: valor,
                  ValorObtenido: (porcDisp*1).toFixed(2),
                  Fecha: admin.firestore.FieldValue.serverTimestamp(),
                  Estado: "No resuelta",
                  NombreEquipo:nombreEquipo
                })
              }
            }
          }
        }

        if(tipo=="RAM"){

          if(tipoElemento=="Libre"){
            if(limite=="Menor"){
              var ramtotal=snap.data().RAM.total;
              var ramlibre=snap.data().RAM.free;
              var porcRamLibre=(ramlibre*100)/ramtotal;

              if(porcRamLibre<valor){
                console.log("El porcentaje de la ram libre es menor que el tope")
                await admin.firestore().collection("AvisosDeAlerta").doc(idAdmin+""+IdEquipo+""+tipo+"").set({
                  IdAdmin: idAdmin,
                  IdEquipo: IdEquipo,
                  Limite: limite,
                  Tipo: tipo,
                  TipoElemento: tipoElemento,
                  ValorLimite: valor,
                  ValorObtenido: (porcRamLibre*1).toFixed(2),
                  Fecha: admin.firestore.FieldValue.serverTimestamp(),
                  Estado: "No resuelta",
                  NombreEquipo:nombreEquipo
                })
              }
            }
          }

          if(tipoElemento=="Usada"){
            if(limite=="Supera"){
              var ramtotal=snap.data().RAM.total;
              var ramusada=snap.data().RAM.used;
              var porcRamUsada=(ramusada*100)/ramtotal;

              if(porcRamUsada>valor){
                console.log("El porcentaje de la ram usadaa es mayor que el tope")
                await admin.firestore().collection("AvisosDeAlerta").doc(idAdmin+""+IdEquipo+""+tipo+"").set({
                  IdAdmin: idAdmin,
                  IdEquipo: IdEquipo,
                  Limite: limite,
                  Tipo: tipo,
                  TipoElemento: tipoElemento,
                  ValorLimite: valor,
                  ValorObtenido: (porcRamUsada*1).toFixed(2),
                  Fecha: admin.firestore.FieldValue.serverTimestamp(),
                  Estado: "No resuelta",
                  NombreEquipo:nombreEquipo
                })
              }
            }
          }
        }
        
        
        if(tipo=="PROCESOS"){
          if(snap.data().PROCESOS>valor){
            console.log("Se ha superado el número de procesos: ")
           await admin.firestore().collection("AvisosDeAlerta").doc(idAdmin+""+IdEquipo+""+tipo+"").set({
              IdAdmin: idAdmin,
              IdEquipo: IdEquipo,
              Tipo: tipo,
              ValorLimite: valor,
              ValorObtenido: snap.data().PROCESOS,
              Fecha: admin.firestore.FieldValue.serverTimestamp(),
              Estado: "No resuelta",
              NombreEquipo:nombreEquipo
            })
          }
        }
        if(tipo=="SERVICIOS"){
          for(var seleccionado in snap.data().SERVICIOS){
            //Si el tipo de servicio de  lo que monitoriza la alerta es ese servicio y ese servicio viene apagado, se genera el aviso
            if(snap.data().SERVICIOS[seleccionado].name==tipoElemento && snap.data().SERVICIOS[seleccionado].running==false){
              await admin.firestore().collection("AvisosDeAlerta").doc(idAdmin+""+IdEquipo+""+tipo+"").set({
                IdAdmin: idAdmin,
                IdEquipo: IdEquipo,
                Tipo: tipo,
                TipoElemento: tipoElemento,
                ValorLimite: "false",
                ValorObtenido: "false",
                Fecha: admin.firestore.FieldValue.serverTimestamp(),
                Estado: "No resuelta",
                NombreEquipo:nombreEquipo,
                Limite:"-"
              })
            } 
        }
        }

      });
    }).catch((err) => {
      console.log('Error getting documents', err);
    });


    console.log(idEmpresa);
    //console.log(IdUsuario);
});
/*
function mailRestablecimiento(email,link){

  const config = require("./autenticadorMail");

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure:true,
        auth: {
            user: config.user,
            pass: config.pass
        }
    });

    var opcionesMail = {
      from: 'GeCeCo',
      to:  email,
      subject: 'Restablece tu contraseña',
      text: 'Bienvenido a GeCeCo!! \n Accede al siguiente link para establecer una contraseña\n'+ link
    };
      transporter.sendMail(opcionesMail, function(error, info){
        if (error) {
          console.log("Error de send email: "+error);
        } else {
          console.log('Email enviado: ' + info.response);
        }
      });   
};
*/