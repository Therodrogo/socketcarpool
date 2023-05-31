import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import { io } from 'socket.io-client';
import SocketioService from "../services/socketio.service";
export default new Vuex.Store({
  state: {
    comentarioActico: false,
    gpspermisos: "sin permisos",
    notificacionActiva: false,
    vistaViaje: null,
    precio: 0,
    asientos: 0,
    fecha: "",
    hora: "",
    haciautalca: true,
    opcion: 0,
    iduser: null,
    marker1: {
      nombre: "",
      lng: 0,
      lat: 0
    },
    activarcomentario: true,
    marker2: {
      nombre: "Universidad de talca, sede Los niches",
      lng: -71.23025064539733,
      lat: -35.00254581757482
    },
    menu: "viajar",
    origenseleccionado: {
      nombre: "",
      lng: 0,
      lat: 0
    },
    destinoseleccionado: {
      nombre: "",
      lng: 0,
      lat: 0
    },
    coordenadas: [],
    posicionseleccionada: {
      lng: 0,
      lat: 0
    },
    salaesperaviaje: null,
    rutavalida: false,
    idchoferseleccionado: null,
    SocketioService: SocketioService,
    idviaje: null,
    activarchat: false,
    historialviajeseleccionado: null,
    socket: null,
    socketRoom: null,
    enviarPajaseros: [], // Para Socket Pasajeros reales
  },
  getters: {
    menu: state => state.menu,
    gethaciautalca: state => state.haciautalca
  },
  mutations: {
    setgpspermisos(state, gpspermisos) {
      state.gpspermisos = gpspermisos;
    },
    cambiarviaje(state, valor) {
      state.menu = valor
    },
    async conectarSocket() {
      console.log("conectando...")
      /* this.state.socket = io("http://localhost:5003"); */
      this.state.socket = io('https://socketcarpool-wacd334doa-uc.a.run.app');
      
      
      await this.state.socket.on("connect_error", (err) => {
        console.log(err.message);
      })
    },
    async desconectarSocket() {
      console.log("desconectando...")
      await this.state.socket.disconnect();
    },
    async conectarSocketRoom() {
      this.state.socketRoom = io('https://socketroom-wacd334doa-uc.a.run.app');
      /* this.state.socketRoom = io('http://localhost:5050'); */
      // Nos conectamos al socket
      await this.state.socketRoom.on('connect', () => {
        console.log('Usuario room conectandose...');
      });
    },
    async desconectarSocketRoom() {
      await this.state.socketRoom.disconnect();
      localStorage.removeItem('historialviajeseleccionado')
      console.log("Usuario room desconectando...")
    },
    async unirSalaSocket() {
      
      this.state.historialviajeseleccionado = localStorage.getItem('historialviajeseleccionado')
     
      await this.state.socketRoom.emit('set id', JSON.parse(localStorage.getItem("carpooltoken"))._id);
      await this.state.socketRoom.emit('join room', this.state.historialviajeseleccionado);
    },async EnviarCoordenadas(state,coordenadas){
      await this.state.socketRoom.emit('enviarCoordenadas',this.state.historialviajeseleccionado,coordenadas)
    }
  },
  actions: {
    obtenerGPSestado({ commit }) {

      if (navigator.permissions) {
        navigator.permissions
          .query({ name: 'geolocation' })
          .then(async permissionStatus => {

            if (permissionStatus.state === 'granted') {
              commit("setgpspermisos", "activo")
              localStorage.setItem("gpspermisos", "activo")

            } else if (permissionStatus.state === 'prompt') {
              commit("setgpspermisos", "sin permisos")
             this.dispatch("solicitudGPS")
              
            } else if (permissionStatus.state === 'denied') {
              // Permiso denegado, mostrar mensaje al usuario

              commit("setgpspermisos", "denegado")
              localStorage.setItem("gpspermisos", "denegado")

            }
          })
          .catch(error => {
            console.log(error)
            commit("setgpspermisos", "error")
            localStorage.setItem("gpspermisos", "error")
          });
      } else {
        commit("setgpspermisos", "incompatible")
        localStorage.setItem("gpspermisos", "incompatible")
      }

    }, async solicitudGPS({ commit }) {
      try {
        return new Promise((resolve, reject) => {
          if(localStorage.getItem("gpspermisos")!=="activo"){
            navigator.geolocation.getCurrentPosition(
             position => {
               commit("setgpspermisos", "activo")
               localStorage.setItem("gpspermisos", "activo")
               resolve("activo");
             },
             error => {
     
               commit("setgpspermisos", "denegado")
               localStorage.setItem("gpspermisos", "denegado")
               resolve("denegado");
               // Permiso denegado, mostrar mensaje al usuario
     
             }
           );
         }
        });
      } catch (error) {
        reject(error)
        throw error;
      }
      

    }
  },
  modules: {
  }
})
