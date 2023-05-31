<template>
  <div>
    <div id="app">
      <router-view/>
    </div>
  </div>
</template>

<script>
import API from './api';
export default {
  methods: {
    async getuserbyid() {
      const resp = await API.getallviajes()
    }
  },
  data: () => ({
    active: 0,
    menu: 'home',
    loader: true
  }),
}
</script>
<style >
* {
  font-family: 'poppins', sans-serif;
}
</style>
