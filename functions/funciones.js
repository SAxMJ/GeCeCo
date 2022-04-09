const functions = require("firebase-functions");
const admin=require('firebase-admin');
admin.initializeApp();
const nodemailer = require("nodemailer");


//FUNCIÓN PARA REGISTRAR USUARIOS COMO ADMINISTRADOR
exports.registrarTrabajador=functions.https.onCall(async(data, context) => {
  
  var elUID;
  await admin.auth().createUser({email: data.usuario, password: data.pass}).then(async(userRecord) => {
    elUID=userRecord.uid;
    console.log("ElUID1"+elUID);
  }).catch((error) => {
      console.log('Error al crear el nuevo usuario', error);
  });
  console.log("ELUID2"+elUID)
  return ""+elUID;
});





//Email de restablecimiento de contraseña
exports.mailEstablecerPassword=functions.https.onCall(async (data,context)=>{
  console.log("elmail: " +data.usuario);

  try{ //Se envía un mensaje de resauración de la contraseña al email
    await sendPasswordResetEmail(admin.auth(),data.usuario);
    console.log("SE ENVIO EL CORREO DE RESTABLECIMIENTO");
  }catch(e){
    console.log("EL ERRORRrRrR: "+e)
  }
});





//Función para dar de baja un usuario, incluyendo eliminarlo de las bases de datos
 exports.darDeBajaUsuario=functions.https.onCall(async(data,context)=>{
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
});




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
