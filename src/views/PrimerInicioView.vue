<template>
    <div class="contenedor">
        <!-- Cambiar contraseña, se oculta cuando mostrarTutorial = true -->
        <div v-if="!mostrarTutorial">
            <vs-alert gradient success class="titulo pagina">
                Actualiza tu contraseña
            </vs-alert>

            <div class="formulario CambiarContra" >

                <p class="tituloformulario"><br>Ingresa tu nueva contraseña:</p>
                <div class="input password">
                    <vs-input type="password" v-model="valor_contraseña_input1" label="Nueva contraseña"
                        :progress="barra_progreso" :visiblePassword="contraseñaVisible_input1" icon-after
                        @click-icon="contraseñaVisible_input1 = !contraseñaVisible_input1">
                        <template #icon>
                            <span v-if="!contraseñaVisible_input1" class="material-icons-outlined">
                                visibility
                            </span>
                            <span v-else class="material-icons-outlined">
                                visibility_off
                            </span>

                        </template>
                        <template v-if="barra_progreso >= 100" #message-success>
                            Contraseña segura
                        </template>

                    </vs-input>
                </div>
                <div class="input password">
                    <vs-input type="password" v-model="valor_contraseña_input2" label="Reingrese la contraseña"
                        :visiblePassword="contraseñaVisible_input2" icon-after
                        @click-icon="contraseñaVisible_input2 = !contraseñaVisible_input2">
                        <template #icon>
                            <span v-if="!contraseñaVisible_input2" class="material-icons-outlined">
                                visibility
                            </span>
                            <span v-else class="material-icons-outlined">
                                visibility_off
                            </span>

                        </template>

                    </vs-input>
                </div>


                <div class="btncontinuar" @click="actualizarContraseña()">
                    <vs-button class="botoncontinuar" color="#f79034">
                        Continuar
                        <template #animate>
                            <span class="material-icons-outlined flecha">
                                arrow_forward
                            </span>
                        </template>
                    </vs-button>

                </div>



            </div>
        </div>
        <!-- Tutorial, aparece cuando mostrarTutorial = true -->
        <div class="formulario Tutorial" v-if="mostrarTutorial">
            <!-- imagen que aparece siempre durante el tuto -->
            <img src="https://i.imgur.com/qEeSPoY.png" class="responsive">

            <div class="btntutorial">
                <!-- Boton retroceder pagina -->
                <div class="izquierda ">
                    <vs-button v-if="pagina != 0" circle icon success flat @click="pagina = pagina + - 1">
                        <span class="material-icons-outlined " style="color: white;">
                            arrow_back
                        </span>
                    </vs-button>

                </div>
                <div class="centro ">
                    <h1 v-if="pagina == 0">Revisa la lista de viajes</h1>
                    <h1 v-if="pagina == 1">Verifica la información de los choferes</h1>
                    <h1 v-if="pagina == 2">Selecciona el viaje que más te convenga</h1>
                    <h1 v-if="pagina == 3">Selecciona tu punto de parada con el marker azul y haz click en Unirse</h1>
                    <h1 v-if="pagina == 4">Espera que el conductor acepte tu solicitud... Recibirás una notificación</h1>
                    <h1 v-if="pagina == 5">Puedes hablar con los otros participantes en el chat</h1>
                    <h1 v-if="pagina == 6">En caso de emergencia, no dudes en usar el botón de pánico o grabar el audio de
                        tu viaje</h1>
                    <h1 v-if="pagina == 7">Viaje tranquilamente y una vez finalice, no olvides calificar a tu chofer</h1>
                </div>
                <!-- boton avanzar pagina -->
                <div class="derecho">
                    <!-- fin tutorial termina el tutorial si llegamos a pagiona = 8, hay que cambiarlo a mano -->
                    <vs-button circle icon success flat @click="pagina = pagina + 1; fin_tutorial() ">
                        <span class="material-icons-outlined forward" style="color: white;">
                            arrow_forward
                        </span>
                    </vs-button>
                </div>
            </div>


            <div class="pagina" v-if=" pagina == 0 ">
                <CardViaje :viaje-seleccionado=" item "
                    v-for="(          item, index          ) in           viajesHardcoded          " :key=" index "
                    id="card_no_events" />
            </div>

            <div class="pagina" v-if=" pagina == 1 ">

                <CardViaje :viaje-seleccionado=" viajesHardcoded[1] " id="card_no_events"
                    estilo_btnChofer="material-icons-outlined downward kreep" />

            </div>
            <div class="pagina" v-if=" pagina == 2 ">

                <CardViaje :viaje-seleccionado=" viajesHardcoded[1] " id="card_no_events"
                    estilo_btnViajar="material-icons-outlined downward kreep" />




            </div>
            <div v-if=" pagina == 3 ">
                <div style="display: flex;">
                    <PuntosdeSubidaTutorial texto_btn="UNIRSE" estilo_btnUnirse="material-icons-outlined downward kreep"
                        mostrar_BtnInfoChofer="no_mostrar" mostrar_BtnChat="no_mostrar" />

                </div>



            </div>
            <div v-if=" pagina == 4 ">
                <div>
                    <vs-navbar shadow square center-collapsed>
                        <template #left>
                            <span class="material-icons-outlined" style="color:#36568c;">
                                menu
                            </span>
                        </template>
                        <img class="imgNavbar" src="https://i.ibb.co/kM1Tm5S/otroauto.png" />

                        <template #right>
                            <div>
                                <div class="center">
                                    <vs-avatar class="material-icons-outlined kreep" color="#FFFFFF" style="margin-top: 3px;" badge-color="danger"
                                        badge-position="top-right">
                                        <span class="material-icons-outlined" style="color:#36568c;">
                                            notifications
                                        </span>
                                        <template #badge>
                                            1
                                        </template>
                                    </vs-avatar>

                                </div>
                            </div>
                        </template>
                    </vs-navbar>
                </div>



            </div>
            <div v-if=" pagina == 5 ">
                <div style="display: flex;">
                    <PuntosdeSubidaTutorial texto_btn="EN CURSO" mostrar_BtnChat="material-icons-outlined downward kreep" />
                </div>



            </div>
        </div>
    </div>
</template>
<script>
import API from '../api';
import CardViaje from '../components/CardViaje.vue';
import PuntosdeSubidaTutorial from '../components/PuntosdeSubidaTutorial.vue';
import NotificacionBoton from '../components/NotificacionBoton.vue';

export default {
    data() {
        return {
            valor_contraseña_input1: '',
            valor_contraseña_input2: '',
            contraseñaVisible_input1: false,
            contraseñaVisible_input2: false,
            mostrarTutorial: false,
            btn_continuar: 0,
            pagina: 0,
            viajesHardcoded:
                [{
                    haciautalca: true,
                    destino: {
                        nombre: 'Molina, Maule, Chile',
                    },
                    disponibles: 2,
                    precio: 1000,
                    fecha: '2023-05-18',
                    horainicio: '21:12',
                },
                {
                    haciautalca: false,
                    origen: {
                        nombre: 'Claudio Vicuña, Empedrado, Maule 354000, Chile',
                    },
                    disponibles: 4,
                    precio: 0,
                    fecha: '2023-06-18',
                    horainicio: '8:30',
                    destino: 'Universidad de talca, sede Los niches'
                },

                ],


        }
    },
    methods: {
        prueba() {
            this.$store.state.vistaViaje = this.viajesHardcoded[1];
        },
        async actualizarContraseña() {
            /*Validamos los campos del usuario*/
            if (this.barra_progreso == 100 && this.misma_contraseña) {
                this.openNotificationSuccess("Contraseña actualizada")
                const token = JSON.parse(localStorage.getItem("carpooltoken"));
                console.log(token)
                token.contrasena = this.valor_contraseña_input1;
                console.log(token)
                this.mostrarTutorial = !this.mostrarTutorial

                await this.axios.put(`updatecontrausuario`, {
                    "userid": token._id,
                    "contranueva": token.contrasena
                })
            } else if (this.barra_progreso != 100) {
                this.openNotificationError("Contraseña no segura")
            } else {
                this.openNotificationError("Las contraseñas no son las mismas")
            }

        },


        openNotificationError(title) {
            const noti = this.$vs.notification({
                position: 'bottom-center',
                title,
                duration: '1500',
                color: 'danger',

            })
        },
        openNotificationSuccess(title) {
            const noti = this.$vs.notification({
                position: 'bottom-center',
                title,
                duration: '1500',
                color: 'success',

            })
        },
        fin_tutorial() {
            if (this.pagina == 8) {
                this.openLoading();
                this.$router.push('/cliente');
            }
        },
        openLoading() {
            const loading = this.$vs.loading()
            setTimeout(() => {
                loading.close()
            }, 1000)
        }
    },
    computed: {
        barra_progreso() {
            let progress = 0

            // tiene un numero

            if (/\d/.test(this.valor_contraseña_input1)) {
                progress += 20
            }

            // tiene una letra mayuscula

            if (/(.*[A-Z].*)/.test(this.valor_contraseña_input1)) {
                progress += 20
            }

            // tiene minusculas

            if (/(.*[a-z].*)/.test(this.valor_contraseña_input1)) {
                progress += 20
            }

            // mas de 5 digitos

            if (this.valor_contraseña_input1.length >= 6) {
                progress += 20
            }

            // al menos un caracter espcial

            if (/[^A-Za-z0-9]/.test(this.valor_contraseña_input1)) {
                progress += 20
            }

            return progress
        },
        misma_contraseña() {

            if (this.valor_contraseña_input1 == this.valor_contraseña_input2) {
                return true;
            } else {
                return false;
            }

        }
    },
    components: {
        CardViaje,
        PuntosdeSubidaTutorial,
        NotificacionBoton
    },
};
</script>

<style scoped>
.centro h1{
    font-size: 15px;
}
.contenedor .titulo.pagina {
    background-color: #f79034;
    width: 300px;
    height: 10px;
    margin: auto;
    text-align: center;
    font-size: larger;
    margin-top: 10px;
    margin-bottom: 10px;
}

.formulario.CambiarContra {
    color: white;
    background-color: #36568c;
    margin: auto;
    width: 400px;
    border-radius: 7%;
}



.tituloformulario {
    text-align: center;
}

.formulario .material-icons-outlined {
    color: #f79034;
    /**No seleccionable */
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.material-icons-outlined {
    /**No seleccionable */
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.formulario .material-icons-outlined.flecha {
    color: white;

}

.formulario .input {
    margin-top: 5vh;
    display: flex;
    justify-content: center;

}

.formulario .select {
    margin-top: 5vh;
    display: flex;
    justify-content: center;

}

.formulario .checkbox {
    margin-top: 2vh;
    display: flex;
    justify-content: center;
}

.formulario .btncontinuar {
    margin-top: 2vh;
    margin-bottom: 2vh;
    display: flex;
    justify-content: center;
}

/**PARTE DEL TUTORIAL */
.formulario.Tutorial {
    color: white;
    background-color: #36568c;
    margin: auto;
    width: 100%;

}

.botoncontinuar {
    margin-bottom: 15px;
}

.responsive {
    width: 100%;
    height: auto;
}


.btntutorial {
    display: flex;
    justify-content: space-between;
    overflow: auto;
    width: 100vw;
    text-align: center;
    z-index: 5000;
}

h1 {
    font-size: 20px;
}

.izquierda {
  
}

.centro {
    float: inline-start;
    width: 70%;
    text-align: center;
}

.derecho {
    
}



.pagina {
    background-color: white;
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 10px;
}

#card_no_events:active {
    pointer-events: none;
}

#card_no_events:hover+#flecha_abajo {
    background-color: #ccc
}

.material-icons-outlined.downward {
    position: absolute;
    font-size: 44px;
    top: 61%;
    left: 37.6%;
    background-color: white;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    border-top-right-radius: 12px;
    border-top-left-radius: 12px;
    -webkit-transition-duration: 0.4s;
    /* Safari */
    transition-duration: 0.4s;
}

.material-icons-outlined.downward:hover {
    background-color: #555555;
    color: white;
}

/*Bounce*/
@keyframes kreep {
    0% {
        -webkit-transform: scale(1.1, .9);
        transform: scale(1.1, .9);
    }

    50% {
        -webkit-transform: scale(.9, 1.1) translateY(-.5rem)
    }

    70% {
        -webkit-transform: scale(1);
        transform: scale(1);
    }
}

.material-icons-outlined.downward.kreep {

    /*name-duration-function(ease,eas-in,linear)-delay-count-direction */
    animation: kreep 0.7s ease 2s infinite alternate;
}

.material-icons-outlined.kreep {

    /*name-duration-function(ease,eas-in,linear)-delay-count-direction */
    animation: kreep 0.7s ease 2s infinite alternate;
}

/*END BOUNCER*/
.vs-navbar-content {
    position: relative;
}


.imgNavbar {
    position: absolute;

    height: 35px;
    z-index: 5000;

}
</style>
