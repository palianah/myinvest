<template>
  <div class="dashboard py-10">
    <Sidebar :key="$route.fullPath" />
    <v-content class="dashboard__content">
      <div class="container container--fluid">
        <router-view :key="$route.fullPath"></router-view>
      </div>
    </v-content>

    <TourApp />
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar'
import TourApp from '@/components/TourApp'

export default {
  components: {
    Sidebar,
    TourApp,
  },
}
</script>

<style lang="less" scoped>
.dashboard {
  &__content {
    padding-left: 256px !important;
  }
}
</style>
