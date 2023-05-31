<template>
    <div class="center">
        <vs-button @click="active = !active">
            Iniciar Sesión
            <span class="material-icons-outlined">
                login
            </span>
        </vs-button>
        <vs-dialog not-close not-padding blur v-model="active">
            <Login />
        </vs-dialog>
    </div>
</template>
<script>
import Login from "./login.vue"
export default {
    data: () => ({
        active: false,
    }),
    components: {
        Login
    }
}
</script>

<style scoped>
.vs-button {
    top: 20%;
    color: rgb(255, 255, 255);
    height: 50%;
}

.vs-button span{
    margin-left: 10px;
    color: rgb(255, 255, 255);
}

</style>
