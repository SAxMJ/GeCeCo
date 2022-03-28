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
          { title: 'Inicio', icon: 'mdi-home', path: '/paginainicio/1',},
          { title: 'Tickets', icon: 'mdi-ticket', path: '/ticketsusuario/1'},
          { title: 'Usuario', icon: 'mdi-account', path: '/miusuario/1' },
        ],
        mini: true,
      }
    },
  }
</script>