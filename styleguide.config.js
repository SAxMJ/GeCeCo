module.exports = {
    sections: [
      {
        name: 'Barras laterales',
        content: '../Documentacion/gececoStyleGuide/vistas.md',
        components: 'src/components/[A-Z]*.vue',
        description: 'Elemento que nos permite navegar por dentro de la aplicación'
      },
      {
        name: 'Vistas de administrador',
        content: '../Documentacion/gececoStyleGuide/vistas.md',
        components: 'src/views/admin/[A-Z]*.vue',
        description: 'Todas las vistas que maneja un usuario con el rol de administrador'
      },
      {
        name: 'Vistas de usuario normal',
        content: '../Documentacion/gececoStyleGuide/vistas.md',
        components: 'src/views/trabajador/[A-Z]*.vue',
        description: 'Todas las vistas que maneja un usuario con el rol de trabajador'
      },
      {
        name: 'Vistas de super usuario',
        content: '../Documentacion/gececoStyleGuide/vistas.md',
        components: 'src/views/superusuario/[A-Z]*.vue',
        description: 'Todas las vistas que maneja un usuario con el rol de superusuario'
      },
      {
        name: 'Vistas de generales',
        content: '../Documentacion/gececoStyleGuide/vistas.md',
        components: 'src/views/[A-Z]*.vue',
        description: 'Vistas que maneja un usuario con cualquier rol'
      }
    ]
  }

  //module.exports = {
  //  content: 'docs/vistas.md',
    //components: 'src/**/[A-Z]*.vue'
  //}

  