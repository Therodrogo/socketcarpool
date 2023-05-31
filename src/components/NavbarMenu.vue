<template>
    <div>
       
            <vs-navbar shadow square center-collapsed v-model="active">
                <template #left>
                    <span @click="activeSidebar = !activeSidebar" class="material-icons-outlined" style="color:#36568c;">
                        menu
                    </span>
                </template>
                <img src="https://i.ibb.co/kM1Tm5S/otroauto.png" />

                <template #right>
                    <NotificacionBotonVue />
                </template>
            </vs-navbar>
       
            <vs-sidebar absolute v-model="active" :open.sync="activeSidebar">
                <template #logo>
                    <vs-avatar>
                        <img :src="fotoperfil" alt="">
                    </vs-avatar>
                    <div class="cajanombre">
                        <p>{{ nombreUser }}</p>
                    </div>
                </template>
                <vs-sidebar-item id="perfil">
                    <template #icon>
                        <span class="material-icons-outlined">
                            account_circle
                        </span>
                    </template>
                    Mi Perfil
                </vs-sidebar-item>
                <vs-sidebar-item id="viajar">
                    <template #icon>
                        <span class="material-icons-outlined">
                            directions_car_filled
                        </span>
                    </template>
                    Viajar
                </vs-sidebar-item>

                <vs-sidebar-item v-if="eschofer" id="crear">
                    <template #icon>
                        <span class="material-icons-outlined">
                            add_circle
                        </span>
                    </template>
                    Crear Viaje
                </vs-sidebar-item>
                <vs-sidebar-item id="historialviajes">
                    <template #icon>
                        <span class="material-icons-outlined">
                            description
                        </span>
                    </template>
                    Historial de Viajes
                </vs-sidebar-item>
                <vs-sidebar-item @click="cerrarSesion" to="/" id="salir">
                    <template #icon>
                        <span class="material-icons-outlined">
                            logout
                        </span>
                    </template>
                    Cerrar Sesion
                </vs-sidebar-item>
            </vs-sidebar>
            <div class="contenedorMenu">
                <div v-if="active === 'viajar'">
                    <ListaVehiculosMovil @mostrarviaje="cambiarviaje" />

                </div>
                <div v-if="active === 'misviajes'">
                    <MisViajes />

                </div>
                <div v-if="active === 'crear' && eschofer">
                    <CrearViaje @viajecreado="creado" />

                </div>

                <div v-if="active === 'perfil'">
                    <PerfilUsuario @cambiarfoto="cambiofoto" />
                </div>
                <div v-if="active == 'historialviajes'">
                    <HistorialViajes />
                </div>



            </div>
      

           
        




    </div>
</template>
<script>
import CrearViaje from './CrearViaje.vue';
import ListaVehiculosMovil from './ListaVehiculosMovil.vue'
import MisViajes from './MisViajes.vue';
import PerfilUsuario from './PerfilUsuario.vue';
import HistorialViajes from './HistorialViajes.vue';
import NotificacionBotonVue from './NotificacionBoton.vue';

import { NotiBus } from '../main.js';


export default {
    data: () => ({
        nombreUser: '',
        active: 'viajar',
        activeSidebar: false,
        eschofer: true,
        fotoperfil: "",
        GPS: null,
        active2: true

    }),

    async mounted() {

        
        this.usuario()
    },


    methods: {
        sinPermisos(){
            this.GPS = "denegado"
            this.active2 = false
        },

        async activarGPS() {

            this.GPS = await this.$store.dispatch("solicitudGPS")
            this.active2 = false

        },
        cerrarSesion() {
            localStorage.removeItem('carpooltoken');
            console.log("se borro")
        },
        usuario() {
            const token = JSON.parse(localStorage.getItem("carpooltoken"))
            this.nombreUser = token.nombre
            this.eschofer = token.eschofer
            this.fotoperfil = token.imagenperfil
            console.log(this.eschofer)
        },
        cambiarviaje() {
            this.active = "elegirviaje"
        },
        volverlista() {
            this.active = "viajar"
        },
        openNotification(titulo, duration, text, color, position) {
            // Envia una notificacion (es de vuesax)
            this.$vs.notification({
                position,
                color: color,
                duration: duration,
                title: titulo,
                text: text
            })
        }, creado() {
            this.active = "historialviajes"
        }, async cambiofoto() {

            this.fotoperfil = this.$store.state.urlperfil
        }

    },
    components: {
        ListaVehiculosMovil,
        CrearViaje,
        MisViajes,
        PerfilUsuario,
        NotificacionBotonVue,
        HistorialViajes
    }
}
</script>

<style scoped>
.contenedorMenu {
    display: flex;
    position: relative;
    top: 6%;
    width: 100vw;
    height: 94.5vh;
}

img {
    position: absolute;

    height: 35px;
    z-index: 5000;
}

.material-icons-outlined {
    margin-left: 0;
}

.cajanombre {
    display: flex;
    width: 50%;
}

.button-container {
    position: absolute;
    top: 0px;
    left: 0;
    margin: 10px;
    display: flex;
    align-items: center;

}

.back-button,
.forward-button {
    margin-right: 10px;
    height: 40px;
}

.back-button .material-icons,
.forward-button .material-icons {
    font-size: 20px;
    margin-right: 5px;
    color: white;
}

.elemento {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
}

.boton {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 5%;
}
</style>