<template>
    <div>
        <div class="center">
            <vs-avatar color="#FFFFFF" style="margin-top: 3px;" @click="activarNotificacion" badge-color="danger"
                badge-position="top-right">
                <span class="material-icons-outlined" style="color:#36568c;" >
                    notifications
                </span>
                <template #badge>
                    {{ notificaciones_activas }}
                </template>
            </vs-avatar>
            <div style="position: fixed; top: 0; left: 0; z-index: 20000;" v-if="$store.state.notificacionActiva">
                <Notificaciones />
            </div>

        </div>
    </div>
</template>
<script>
import { NotiBus } from '../main.js';
import API from '@/api';
import CalificarChofer from './CalificarChofer.vue';
import Notificaciones from './Notificaciones.vue';
export default {
    components: {
        CalificarChofer,
        Notificaciones
    },
    data: () => ({
        active: false,

        persona: {
            mensaje: ''
        },
        mensajes: [],
        estadonoti: false,
        descrip: -1,
        boton: [],
        notificaciones_activas: 0,
        idUsuario: null,
        isLoading: false,
    }),
    methods: {
        activarNotificacion() {
            console.log("muestra")
            this.$store.state.notificacionActiva = true
        },
        async obtenerSocketNotificaciones() {
            this.$store.state.socket.on("mensaje:recibido", async (data) => {
                if (data.receptor == JSON.parse(localStorage.getItem("carpooltoken"))._id) {
                    // Envio a un usuario en especifico
                    this.notificaciones_activas++;
                    this.openNotification(data.tipo);
                    this.mensajes.push(data);
                }
            });
        },
        async enviarNot(tipo) {
            if (tipo == "Solicitud unirse viaje") {
                console.log("Enviando notificacion");
                const now = new Date(Date.now());
                const day = now.getDate();
                const monthIndex = now.getMonth();
                const hours = now.getHours();
                const minutes = now.getMinutes();
                const monthNames = [
                    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                ];
                const month = monthNames[monthIndex];

                let data = {
                    emisor: JSON.parse(localStorage.getItem("carpooltoken"))._id,
                    receptor: this.$store.state.vistaViaje.choferid,
                    tipo: tipo,
                    estado: null,
                    idviaje: this.$store.state.vistaViaje._id,
                    origen: this.$store.state.vistaViaje.origen.nombre,
                    destino: this.$store.state.vistaViaje.destino.nombre,
                    nombrepasajero: JSON.parse(localStorage.getItem("carpooltoken")).nombre,
                    parada: [this.$store.state.posicionseleccionada.lng, this.$store.state.posicionseleccionada.lat],// añadir el objeto del punto(lo de pablek)
                    fecha: day + " de " + month + " a las " + hours + ":" + minutes,
                    visto: false
                }
                this.mensajes.push(data);
                this.openNotification(tipo);
                await API.addNotificacion(data);
                this.$store.state.idchoferseleccionado = null
                this.$store.state.idviaje = null
                this.$store.state.socket.emit("mensaje:enviado", data);

                // SOLO LO MOSTRAMOS PARA DEMOSTRAR Q EL USUARIO QUE ENVIO EL MENSAJE, es solo para testear
                this.notificaciones_activas++;
            } else if (tipo == "Resultado solicitud unirse viaje") {
                // SE NECESITA QUE LOS BOTONES FUNCIONEN (--EN DESARROLLO--)

            } else if (tipo == "Viaje Finalizado") {
                // Cuando se finaliza el viaje
                const now = new Date(Date.now());
                const day = now.getDate();
                const monthIndex = now.getMonth();
                const hours = now.getHours();
                const minutes = now.getMinutes();
                const monthNames = [
                    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                ];
                const month = monthNames[monthIndex];
                console.log("Enviando notificacion |||||||||||| ", this.$store.state.historialviajeseleccionado);
                for (var i = 0; i < this.$store.state.enviarPajaseros.length; i++) {
                    let data = {
                        emisor: null,
                        receptor: this.$store.state.enviarPajaseros[i],
                        tipo: tipo,
                        estado: null,
                        idviaje: this.$store.state.historialviajeseleccionado,
                        origen: null,
                        destino: null,
                        nombrepasajero: JSON.parse(localStorage.getItem("carpooltoken")).nombre,
                        parada: null,// añadir el objeto del punto(lo de pablek)
                        fecha: day + " de " + month + " a las " + hours + ":" + minutes,
                        visto: false
                    }
                    console.log("|", data, "|")
                    this.mensajes.push(data);
                    this.openNotification(tipo);
                    await API.addNotificacion(data);
                    this.$store.state.idchoferseleccionado = null
                    this.$store.state.idviaje = null
                    this.$store.state.socket.emit("mensaje:enviado", data);
                }
            } else {
                // OTRA COSA

            }
        },
        async leerTodo() {
            // Leemos todos las notificaciones
            this.mensajes = await API.getallnotificaciones();
            this.mensajes.forEach(element => {
                const data_visto={
                    notificacionId:element._id,
                    visto:true
                }
                API.updateVisto(data_visto);
            });
            this.notificaciones_activas = 0;
            this.obtenerNotificaciones();
            console.log("Leer todo")
        },
        activarNoti(index) {
            this.boton[index] = !this.boton[index]
            if (this.descrip == index) {
                this.descrip = -1
            }
            else {
                this.descrip = index
            }
        },
        openNotification(titulo) {
            // Envia una notificacion (es de vuesax)
            this.$vs.notification({
                duration: 2000,
                title: titulo,
                text: ''
            })
        },
        async obtenerNotificaciones() {
            this.mensajes = []
            this.mensajes = await API.getallnotificaciones();
            console.log(this.mensajes)
            this.mensajes.forEach(element => {
                if (element.visto == false) {
                    this.notificaciones_activas++
                }
            });
        },
        async accionVotar(notificacion, voto) {
            console.log("notificacion --> ", notificacion)
            const loading = this.$vs.loading({
                type: 'default'
            })
            let data = {
                notificacionId: notificacion._id,
                tipo: "",
                estado: voto
            }
            if (voto) {
                data.tipo = "Solicitud unirse viaje aceptada"
            } else {
                data.tipo = "Resultado solicitud unirse viaje rechazada"
            }
            console.log("ENVIANDO...", data)
            console.log(data)
            const resp = await API.actualizarEstadoNotificacion(data)
            console.log("RECIBIDO, ", resp)

            if (voto) {
                var dataPasajero = {
                    idviaje: notificacion.idviaje,
                    pasajeroAgregar: notificacion.emisor,
                    parada: notificacion.parada
                }
                console.log * ("dataPasajero", dataPasajero)
                await API.addpasajeroviaje(dataPasajero)
            }
            await this.obtenerNotificaciones()
            loading.close()
        },
    },
    created() {
        // Creamos el evento para que se ejecute la funcion cuando se llame
        NotiBus.$on('enviarNotificacion', this.enviarNot);
        NotiBus.$on('leerNotificacion', this.leerTodo);
        
        this.idUsuario = JSON.parse(localStorage.getItem("carpooltoken"))._id
    },
    mounted() {
        this.obtenerNotificaciones()
        this.obtenerSocketNotificaciones()
    },
}
</script>
<style scoped>
.vs-button span {
    margin-left: 0px;
    color: rgb(255, 255, 255);
}

.noti {
    display: block;
    width: 60%;
    height: auto;
}

.datos_mensaje span {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    text-align: center;
    margin: auto;
    font-size: .5rem;
}

.vs-dialog__content {
    height: 500px;
    overflow: auto;
}
</style>