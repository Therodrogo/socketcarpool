<template>
    <div class="conten">
        <div v-if="option == 0">
            <AdminVista1 />
        </div>
        <div v-if="option == 1">
        </div>
        <div class="boton">
            <div 
            @click="cambio(false)" style=" background: white; padding: 3%; font-size: 12px; border-radius: 12px; display: flex; justify-content: center; cursor: pointer;">
                <p style="margin: 0; display: flex; flex-direction: column; text-align: center;">
                    Hacia utalca
                    <span class="material-icons-outlined" v-if="!$store.state.haciautalca">
                        radio_button_checked
                    </span>
                    <span class="material-icons-outlined" v-else>
                        radio_button_unchecked
                    </span>
                </p>
            </div>
         

            <vs-button @click="cambioestado">
                Ajustar Viaje
            </vs-button>

            <div  @click="cambio(true)"
            style=" background: white; padding: 3%; font-size: 12px; border-radius: 12px;display: flex; justify-content: center;  cursor: pointer;">
                <p style="margin: 0; display: flex; flex-direction: column; text-align: center;">
                    Desde utalca
                    <span class="material-icons-outlined" v-if="$store.state.haciautalca">
                        radio_button_checked
                    </span>
                    <span class="material-icons-outlined" v-else>
                        radio_button_unchecked
                    </span>
                </p>
            </div>

        </div>
     <!--    <div class="switch">
            <vs-switch v-model="active2" @input="cambio">
                <template #off>
                    HACIA UTALCA
                </template>
                <template #on>
                    DESDE UTALCA
                </template>
            </vs-switch>
        </div> -->




        <vs-dialog not-close not-padding blur v-model="active">
            <AdminVista2 @viajecreado="creado" />
        </vs-dialog>

    </div>
</template>

<script>
import AdminVista1 from './AdminVista1.vue';
import AdminVista2 from './AdminVista2.vue';

export default {
    name: "G2ProyTaller12023CrearViaje",
    data() {
        return {
            option: 0,
            active: false,
            active2: false
        };
    },
    methods: {

        next() {
            if (this.option == 0) {
                this.option = 1
            }
            else {
                this.option = 0
            }

        }, cambioestado() {


            if (this.$store.state.marker1.lng != 0 && this.$store.state.marker1.lat != 0 && this.$store.state.rutavalida) {
                this.active = !this.active
            } else {
                this.openNotification("Error al crear", 2000, "Necesitas ingresar una ruta valida", "danger", "top-right")
            }
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
            this.$emit("viajecreado")
        }, cambio(valor) {
            this.$store.state.haciautalca = valor

        }
    }, mounted() {

        this.$store.state.marker1.lng = 0
        this.$store.state.marker1.lat = 0
    },
    components: { AdminVista1, AdminVista2 }
};
</script>

<style  scoped>
.conten {
    display: block;
    width: 100vw;
}

.switch {
    Z-index: 1000;
    width: 50vw;
    position: fixed;
    bottom: 50;
}


.elemento {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.boton {
    width: 100vw;
    display: flex;
    justify-content: space-between;
    position: absolute;
    z-index: 50;
    left: 50%;
    transform: translateX(-50%);
    bottom: 120px;
}
</style>