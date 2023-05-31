<template>
    <div class='contenedorperfil'>
        <div class="contimg">
            <img class="circle" height="128" width="128" :src="imagenPerfil" alt="No imagen"
                @click="abrirSelectorDeArchivos" id="input">

        </div>

        <h3>{{ this.nombre }}</h3>
        <div class="correo">
            <p class="correo">{{ this.correo }}</p>
        </div>
        <div class="contimg">
            <button class="botonChofer" v-if="this.eschofer">Chofer</button>
            <button class="botonChofer" v-if="!this.eschofer">Pasajero</button>
        </div>


        <p style="margin-left: 2px;">Actividad: {{ this.actividad }} </p>
        <p v-if="this.eschofer">
            <vs-button style="width: 95%;" @click="mostrarInfoAuto">
                Información Vehiculo
            </vs-button>
        </p>
        <div class="centrar-div" v-if="this.clickInfoAuto">
            <div>
                <p class="info_user">Patente: {{ vehiculo.patente }} </p>
                <p class="info_user">Marca: {{ vehiculo.marca }} </p>
                <p class="info_user">Modelo: {{ vehiculo.modelo }} </p>
                <div class="calificacion">
                    <p class="info_user">Calificación como chofer
                        <br />
                        <span class="material-icons-outlined" v-for="i in 3" :key="i">
                            star
                        </span>

                    </p>
                </div>
            </div>
        </div>
    </div>
</template> 

<script>
import API from '@/api';

export default {
    name: 'G2ProyTaller12023PerfilUsuario',
    data() {
        return {
            id: "",
            nombre: "",
            correo: "",
            actividad: "",
            eschofer: false,
            vehiculo: null,
            clickInfoAuto: false,
            imagenPerfil: '',
            file: null, // Declarar la variable file aquí
            urlFoto: ""
        };
    },

    mounted() {
        this.usuario()

    },
    methods: {
        usuario() {
            const token = JSON.parse(localStorage.getItem("carpooltoken"))
            // Obtener nombre
            this.id = token.id
            this.nombre = token.nombre
            this.correo = token.correo
            this.actividad = token.actividad
            this.eschofer = token.eschofer
            this.imagenPerfil=token.imagenperfil
            this.vehiculo = token.vehiculo
        },
        mostrarInfoAuto() {
            this.clickInfoAuto = !this.clickInfoAuto
        },

        abrirSelectorDeArchivos() {
            const input = document.createElement('input');
            console.log(input)
            input.type = 'file';
            input.accept = 'image/*';
            input.click();
            input.onchange = (event) => {
                this.file = event.target.files[0];
                console.log(this.file)
                if (this.file) {

                    const fileName = this.file.name;


                    const reader = new FileReader();

                    reader.readAsDataURL(this.file);
                    const storageRef = firebase.storage().ref();
                    const imagePath = 'images/*' + this.file.name;
                    const imageRef = storageRef.child(imagePath);
                    const uploadTask = imageRef.put( this.file);

                    // Maneja los eventos de progreso y finalización de la carga
                    uploadTask.on('state_changed',
                        (snapshot) => {
                            // Maneja el progreso de carga, si lo deseas
                        },
                        (error) => {
                            // Maneja los errores durante la carga
                            console.error(error);
                        },
                        () => {
                            // La carga se ha completado con éxito
                            console.log('Imagen cargada exitosamente.');
                            // Obtén la URL de descarga de la imagen
                             uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
                                console.log('URL de descarga:', downloadURL);
                                this.urlFoto=downloadURL
                                this.imagenPerfil=downloadURL                   
                                var data = {
                                    userid: JSON.parse(localStorage.getItem("carpooltoken"))._id,
                                    fotoperfil: downloadURL
                                }
                                var token = JSON.parse(localStorage.getItem("carpooltoken"))
                                token.fotoperfil = downloadURL
                                await localStorage.setItem('carpooltoken', JSON.stringify(token));
                                this.$store.state.urlperfil = downloadURL
                                this.$emit('cambiarfoto');  
                                const foto = await API.addFotoPerfil(data)
                            });
                        }
                    );


                }
            };
            
        }
    },
}
</script>

<style scoped>
.contenedorperfil {
    background: white;

    color: #000;
    text-shadow: 0 1px 1px rgba(255, 255, 255, 0.1);
    text-align: center;
    display: flex;
    flex-direction: column;

    width: 100vw;
    height: 100%;

}

::-moz-selection {
    background: rgba(0, 0, 0, 0.1);
}

::selection {
    background: rgba(0, 0, 0, 0.1);
}

h1 {
    font-weight: 100;
    font-size: 2.7em;
}

h3 {
    color: #111222;
    font-size: 1.4em;
}

a {
    color: RoyalBlue;
    font-weight: normal;
    text-decoration: none;
}

a:hover {
    color: CornflowerBlue;
}

.contimg {
    display: flex;
    justify-content: center;
    width: 100%;
}

.circle {
    line-height: 0;
    /* remover line-height */
    display: inline-block;
    /* ciruclo alrededor de la imagen */
    margin: 5px;
    border: 4px solid rgba(200, 200, 200, 0.4);
    border-radius: 50%;
    /* El valor es relativo al tamaño de la imagen */
    /*box-shadow: 0px 0px 5px rgba(0,0,0,0.4);*/
    transition: linear 0.25s;
    height: 128px;
    width: 128px;
    margin-top: 4vh;
}

.circle {
    display: flex;
    border-radius: 50%;
    /* El valor es relativo al tamaño de la imagen */
}

.circle:hover {
    transition: ease-out 0.2s;
    border: 4px solid rgba(0, 0, 0, 0.2);
    -webkit-transition: ease-out 0.2s;
    cursor: pointer;
}

.barra_arriba {
    height: 5vh;
    background-color: #36568C;
}

.letra_chofer_pasajero {
    font-size: 18px;
}

.informacion_usuario {
    background-color: #feb677;
    width: 200px;
    display: inline-block;
    justify-content: center;
}

.botonChofer {
    background-color: #f79034;
    border: none;
    color: white;
    padding: 15px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    border-radius: 12px;
    width: 25vh;
    cursor: default;
}

.correo {
    font-size: 18px;
    color: gray;
}

.info_user {
    border: 4px solid rgba(46, 46, 46, 0.4);
    border-radius: 3%;
    margin-right: 3px;
}

.info_user.boton {
    background-color: orange;
    cursor: pointer;
    width: 100%;

}

.centrar-div {
    display: flex;
    justify-content: center;
}
</style>