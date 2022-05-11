
//MÓDULO QUE NOS PERMITIRÁ RECOGER LA INFORMACIÓN DE LA MÁQUINA DEL USUARIO
//exports.Monitorizador = async function () {
    
    //const si=require('systeminformation');
    console.log("Aqui si que entro, funcion estado maquina")

    const si = require('systeminformation');

    const cpu = await si.currentLoad();
    const ram = await si.mem();
    const disk= await si.fsSize()
    const connexion= await si.networkStats()
    const grafica= await si.graphics()
    const osinfo= await si.osInfo()
    const cpu2 = await si.cpu();
    const temp= await  si.cpuTemperature();

    /*
    var informacionSistema={
    laCpu:cpu,
    laRam:ram,
    elDisk:disk[0],
    laConexion:connexion,
    laGpu:grafica,
    laOsinfo:osinfo,
    laCpu2:cpu2
    }
*/
    console.log(osinfo);
    
    console.log("LLego al return");

    //return informacionSistema;
//}