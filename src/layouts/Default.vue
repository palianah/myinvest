<template>
  <div class="dashboard py-5">
    <Sidebar :key="$route.fullPath" />
    <v-content class="dashboard__content">
      <div class="container container--fluid pt-0">
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
@import '../assets/less/structure';

.dashboard {
  &__content {
    padding-left: 50px !important;

    @media @tabletLandscape {
      padding-left: 256px !important;
    }
  }
}
</style>
