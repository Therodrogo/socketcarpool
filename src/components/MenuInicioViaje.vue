<template>
    <div class="contenedor">

        <div class="acordion" :class="{ 'active': activeMenu == true }">
            <vs-button @click="getConductor" color="#377BA3" circle style="width: 50px; height: 50px; ">
                <span class="material-icons-outlined">
                    face
                </span>
            </vs-button>

            <vs-dialog overflow-hidden full-screen v-model="activedialog">
                <InformacionChofer :conductor="this.conductorInfo" :comentarios="comentarios"
                    :valoraciontotal="valoraciontotal" />
            </vs-dialog>

            <vs-button @click="panico" circle danger style="width: 50px; height: 50px; margin-top: 20px;">
                <span class="material-icons-outlined">
                    emergency_share
                </span>
            </vs-button>
            <vs-button circle style="width: 50px; height: 50px; margin-top: 20px;" @click="startRecording"
                v-if="showStartButton">
                <span class="material-icons-outlined">
                    mic
                </span>

            </vs-button>
            <vs-button success circle style="width: 50px; height: 50px; margin-top: 20px;" @click="stopRecording"
                v-if="showStopButton">

                <span class="material-icons-outlined">
                    mic
                </span>
            </vs-button>
            <vs-button @click="mostrarChat" circle dark
                style="width: 50px; height: 50px; margin-top: 20px; margin-bottom: 20px;">
                <span class="material-icons-outlined">
                    chat_bubble
                </span>
            </vs-button>

        </div>
        <div class="botonmenu" @click="activeMenu = !activeMenu">
            <vs-button circle shadow style="width: 50px; height: 50px;">
                <span class="material-icons-outlined" v-if="activeMenu">
                    remove
                </span>
                <span class="material-icons-outlined" v-else>
                    add
                </span>
            </vs-button>
        </div>

    </div>
</template>

<script>

import API from '@/api';
import InformacionChofer from './InformacionChofer.vue';

export default {
    name: 'G2ProyTaller12023ChatView',

    data() {
        return {
            activeMenu: false,
            conductorInfo: null,
            activedialog: false,
            showStartButton: true,
            showStopButton: false,
            recording: false,
            chunks: [],
            mediaRecorder: null,
            audioRef: null,
            audioUrl: null,
            recordingTime: 0,
            comentarios: [],
            valoraciontotal: 0,
            contPanico: 0,
            info: '',
        };
    },

    mounted() {

    },

    methods: {
        async getConductor() {

            this.comentarios = [],
            this.valoraciontotal = 0
            this.activedialog = !this.activedialog
            this.conductorInfo = await API.getuserbyid(this.viajeSeleccionado.choferid)
        
            this.cargar_comentarios()
        },
        async cargar_comentarios() {

            this.comentarios = await API.getcalificacionbychofer(this.viajeSeleccionado.choferid)

            console.log(this.comentarios)
            this.comentarios.forEach(element => {
                this.valoraciontotal += element.nota
            });
            this.valoraciontotal = this.valoraciontotal / this.comentarios.length

            if (this.valoraciontotal - (Math.floor(this.valoraciontotal)) > 0) {
                this.mediasestrellas = 1

                this.noestrellas = 5 - (Math.floor(this.valoraciontotal)) - 1
            } else {
                this.mediasestrellas = 0
            }
        },

        async panico(){
                 


            try {

                var token = JSON.parse(localStorage.getItem("carpooltoken"))
            
                //aumentar contador en 1 

                token.contPanico = token.contPanico + 1;

                this.contPanico = token.contPanico;

                //obtener contPanico de localstorage
                var data = {
                
                    userid: JSON.parse(localStorage.getItem("carpooltoken"))._id,
                
                    contPanico: this.contPanico
                
                }

                //mandar contPanico a localstorage
                await localStorage.setItem('carpooltoken', JSON.stringify(token));

                //mandar a bd
                const panico = await API.addContPanic(data)
      
                
            } catch (error) {

               console(error);
                
            }

            

           
        },

        mostrarChat() {
            this.$store.state.opcion = 'chat'
        }, startRecording() {

            this.showStopButton = true;
            this.showStartButton = false;


            this.chunks = [];
            navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
                this.recording = true;
                this.mediaRecorder = new MediaRecorder(stream);
                this.mediaRecorder.addEventListener('dataavailable', (event) => {
                    if (event.data.size > 0) {
                        this.chunks.push(event.data);
                    }
                });
                this.mediaRecorder.start();
                this.recordingTime = 0;
                this.recordingTimeInterval = setInterval(() => {
                    this.recordingTime++;
                }, 1000);
            });
        },
        stopRecording() {

            this.showStopButton = false;
            this.showStartButton = true;


            if (this.mediaRecorder && this.recording) {
                this.recording = false;
                clearInterval(this.recordingTimeInterval);
                this.mediaRecorder.stop();
                this.mediaRecorder.addEventListener('stop', () => {
                    const blob = new Blob(this.chunks, { type: 'audio/mp3' });
                    const audioUrl = URL.createObjectURL(blob);
                    this.audioUrl = audioUrl;
                   
                    this.uploadAudio();
                   

                });

            }
        },


        async uploadAudio() {

            if (this.audioUrl) {


                let fechaActual = new Date();
                let dia = fechaActual.getDate();
                let mes = fechaActual.getMonth() + 1;
                let anio = fechaActual.getFullYear();

                let fechaCompleta = `${dia}:${mes}:${anio}`;


                let horasActual = new Date();
                let hora = horasActual.getHours();
                let minutos = horasActual.getMinutes();
                let segundos = horasActual.getSeconds();

                let horaCompleta = `${hora}:${minutos}:${segundos}`;

                let fechaHora = fechaCompleta + '-' + horaCompleta;


                let id_unico = JSON.parse(localStorage.getItem("carpooltoken"))._id;


                const blob = new Blob(this.chunks, { type: 'audio/mp3' });
                const storageRef = firebase.storage().ref().child(`Audios/${id_unico}/` + fechaHora + '.mp3');

                storageRef.put(blob).then(() => {

                    console.log('Se subió el audio a Firebase');

                    const storageRef = firebase.storage().ref().child(`Audios/${id_unico}/` + fechaHora + '.mp3');

                    storageRef.put(blob).then(() => {
                        console.log('Se subió el audio a Firebase');
                        storageRef.getDownloadURL().then(async (url) => {

                            const audioSrc = url;
                            /* alert(audioSrc); */
                            console.log(url);
                            var data = {
                                emisoraudio: JSON.parse(localStorage.getItem("carpooltoken"))._id,
                                enlace: url,
                                idviaje: this.$store.state.historialviajeseleccionado,
                                fecha:fechaCompleta
                            } 
                            console.log("hola mamita 1:",this.$store.state.historialviajeseleccionado);  
                            console.log("hola mamita 2:",this.viajeseleccionado);  
                            const cargaraudio = await  API.addaudio(data)
                            console.log(cargaraudio);
                        });
                    });             
                }); 
            }
        },      

        formatTime(time) {
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        },
        
    },
    components: {
        InformacionChofer
    },
    props: {
        viajeseleccionado: Object
    }
};
</script>

<style scoped>
.contenedor {
    position: fixed;
    bottom: 0;
    right: 0;
    margin-bottom: 50px;
    display: flex;
    flex-direction: column;
    max-width: 60px;
    border-top-right-radius: 30px;
    border-top-left-radius: 30px;
    border-bottom-right-radius: 30px;
    border-bottom-left-radius: 30px;
    /*  background: grey; */

}

.acordion {
    max-height: 0;
    overflow: hidden;
    border-bottom-right-radius: 30px;
    border-bottom-left-radius: 30px;
    transition: max-height 0.2s ease;
}

.acordion.active {
    max-height: 400px;
    border-bottom-right-radius: 30px;
    border-bottom-left-radius: 30px;
    transition: max-height 1s ease;
}

.botonmenu {
    display: flex;
}

.botonmenu span {
    margin: 0;
}

</style>