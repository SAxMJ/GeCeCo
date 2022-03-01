<template>
   <v-container fluid fill-height>
      <v-layout align-center justify-center>
         <v-flex xs12 sm8 md4>
            <v-card elevation="24" shaped tile>
               <v-tabs dark color="primary">
                  <v-tab>Registrar usuario</v-tab>
                     <v-tab-item>
                     <v-card>
                        <v-card-text>
                           <form>
                              <v-text-field
                                    v-model="username"
                                    name="user"
                                    label="Nombre"
                                    type="text"
                                    placeholder="Nombre"
                                    required
                              ></v-text-field>
                              <v-text-field
                                 v-model="apellidos"
                                 name="ape"
                                 label="Apellidos"
                                 type="text"
                                 placeholder="Apellidos"
                                 required
                              ></v-text-field>

                              <v-text-field
                                 v-model="correo"
                                 name="user"
                                 label="Correo electrónico"
                                 type="email"
                                 placeholder="Correo electrónico"
                                 required
                              ></v-text-field>

                              <v-text-field
                                 v-model="password"
                                 name="psswd"
                                 label="Constraseña"
                                 type="password"
                                 placeholder="Constraseña"
                                 required
                              ></v-text-field>

                              <v-text-field
                                 v-model="password2"
                                 name="psswd2"
                                 label="Repite contraseña"
                                 type="password"
                                 placeholder="Repite contraseña"
                                 required
                              ></v-text-field>

                              <v-text-field
                                 v-model="codemp"
                                 name="idEmp"
                                 label="Código de empresa"
                                 type="text"
                                 placeholder="Código de empresa"
                                 required
                              ></v-text-field>
                           <v-btn type="submit" class="mt-4"  dark color="secondary" value="log in">Register</v-btn>
                           </form>
                        </v-card-text>
                     </v-card>
                     </v-tab-item>
                  <v-tab>Registrar empresa</v-tab>
                     <v-tab-item>
                        <v-card>
                           <v-card-text>
                              <form>
                                 <v-text-field
                                    v-model="nombre"
                                    name="nombEmp"
                                    label="Nombre"
                                    type="text"
                                    placeholder="Nombre de la empresa"
                                    required
                                 ></v-text-field>

                                 <v-text-field
                                    v-model="direccion"
                                    name="dirEmp"
                                    label="Dirección"
                                    type="text"
                                    placeholder="Dirección de la empresa"
                                    required
                                 ></v-text-field>

                                 <v-text-field
                                    v-model="localidad"
                                    name="locali"
                                    label="Localidad"
                                    type="text"
                                    placeholder="Localidad de la empresa"
                                    required
                                 ></v-text-field>

                                 <v-text-field
                                    v-model="cp"
                                    name="cp"
                                    label="CP"
                                    type="text"
                                    placeholder="CP de la empresa"
                                    required
                                 ></v-text-field>

                                 <v-text-field
                                    v-model="dedicacion"
                                    name="dedic"
                                    label="Dedicación"
                                    type="text"
                                    placeholder="Actividades de la empresa"
                                    required
                                 ></v-text-field>
                                 <v-btn type="submit" class="mt-4" color="primary" value="log in">Register</v-btn>
                              </form>
                           </v-card-text>
                        </v-card>
                     </v-tab-item>
               </v-tabs>
            </v-card>
         </v-flex>
      </v-layout>
   </v-container>
</template>

<script>

//Importamos las funciones que hemos creado para trabajar con firebase

//import { crearUsuario } from '@/main.js'


</script>
