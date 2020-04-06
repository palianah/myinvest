<template>
  <div class="dashboard py-5">
    <Sidebar :key="$route.fullPath" />
    <v-content class="dashboard__content">
      <div class="container container--fluid pt-0">
        <router-view :key="$route.fullPath"></router-view>
      </div>
    </v-content>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar'

export default {
  components: {
    Sidebar,
  },
}
</script>
