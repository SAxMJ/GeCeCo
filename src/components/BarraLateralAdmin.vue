<template>
      <v-navigation-drawer app  :mini-variant.sync="mini" permanent class="secondary">
        <v-list-item class="px-2" dark>
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
        </v-list-item-avatar>

        <v-list-item-title>NombreUsuario</v-list-item-title>
        <v-btn
          icon
          @click.stop="mini = !mini"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>

      <v-divider></v-divider>
      <v-list  dark>
        <v-list-item 
          v-for="item in items"
          :key="item.title"
          link
          :to="item.path"
        >
          <v-list-item-icon >
            <v-icon >{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class:>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      </v-navigation-drawer>
</template>

<script>
  export default {
    data () {
      return {
        drawer: true,
        items: [
          { title: 'Inicio', icon: 'mdi-home', path: '/paginainicio/2',},
          { title: 'Equipos', icon: 'mdi-chart-bar', path: '/equipos/2' },
          { title: 'Usuarios', icon: 'mdi-account-group', path: '/usuarios/2' },
          { title: 'Alertas', icon: 'mdi-alert', path: '/alertas/2'},
          { title: 'Tickets', icon: 'mdi-ticket', path: '/ticketsadmin/2'},
          { title: 'MiUsuario', icon: 'mdi-account', path: '/miusuario/2' },
        ],
        mini: true,
      }
    },
  }
</script>