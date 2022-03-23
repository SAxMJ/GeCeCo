const functions = require("firebase-functions");
const admin=require('firebase-admin');
const nodemailer = require("nodemailer");
const updatePassword = require("firebase/auth");
const init =require("./index");

admin.initializeApp();

//Asignar contraseña aleatoria y enviar correo electrónico de bienvenida
exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
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
      
      const caracteres = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      var cadena = "";
      var max = caracteres.length-1;

      for (var i = 0; i<10; i++) {
          cadena += caracteres[ Math.floor(Math.random() * (max+1)) ];
      }
      
      admin.auth().updateUser(user.uid, {
        email: user.email,
        password: cadena,                                   
      }).catch((error) => {
        console.log("ElErrorcito: "+error);
      });

       var opcionesMail = {
        from: 'agarciag71tic@gmail.com',
        to:  user.email,
        subject: 'Registro completo',
        text: 'Bienvenido a GeCeCo!! \n A contunación encontrarás tu contraseña temporal generada, debes cambiarla por seguridad\n'+ cadena
      };
        transporter.sendMail(opcionesMail, function(error, info){
          if (error) {
            console.log("Error de send email: "+error);
          } else {
            console.log('Email enviado: ' + info.response);
          }
        });   
  });

  //Función llamable que se ejecuta al cambiar de contraseña
  exports.cambiarPassword = functions.https.onCall((data, context) => {
    admin.auth().updateUser(user.uid, {
      email: data.usuario,
      password: data.pass,                                   
    }).catch((error) => {
      console.log("ElErrorcito: "+error);
    });
  });