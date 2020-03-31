<template>
  <v-content>
    <div class="landing">
      <router-view :key="$route.fullPath"></router-view>
    </div>
  </v-content>
</template>

<script>
export default {}
</script>

<style lang="less"></style>
