//import nodemailer from "nodemailer"

function enviaMail(typeMail,email,tmpass){
  var nodemailer = require("nodemailer");

    //Inicializamos todo lo correspondiente para poder enviar correos electrónicos
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      secure:true,
          auth: {
              user: 'agarciag71tic@gmail.com',
              pass: 'siffbxxbvepogjns'
          }
      });
    
    //Seleccionamos el tipo de email que tiene que enviarse
    switch (typeMail) {
        case 1: //Registro
          tempPasswordMail(transporter,email,tmpass);
          break;
        case 2: //Cambio de contraseña
          
          break;
    }

}

  function tempPasswordMail(transporter,email,tmpass){
    
   var opcionesMail = {
      from: 'agarciag71tic@gmail.com',
      to: 'agarciag71tic@usal.es',
      subject: 'Registro completo',
      text: 'Bienvenido a GeCeCo!! \n A contunación encontrarás tu contraseña temporal generada, debes cambiarla por seguridad\n'+ tmpass
    };
      
      transporter.sendMail(opcionesMail, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email enviado: ' + info.response);
        }
      });
  }

  export {enviaMail};