<template>
    <div>
        <div v-responsive.lg.xl>
        </div>
        <div class="contenedorMovil" v-responsive.sm.xs>
            <!-- <ClienteNavbar /> -->
            <NavbarMenu/>
        </div>
    </div>
</template>
  
<script>

import NavbarMenu from '@/components/NavbarMenu.vue';


export default {
    data: () => ({
    }),
    components: { NavbarMenu },
   created(){
    this.$store.commit('conectarSocket');
   },
   beforeDestroy(){
    this.$store.commit('desconectarSocket');
   },
}
</script>
<style scoped>
.contenedorMovil {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 95vh;

}
</style>
  