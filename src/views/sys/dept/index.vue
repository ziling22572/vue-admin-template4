<template>
  <div class="app-container">
    <router-view></router-view>  <!-- 这里放子路由 -->
  </div>
  </template>


<script>


export default {
  data() {
    return {}
  },
  created() {
  },
  methods: {}
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}
</style>
