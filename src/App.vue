<template>
  <v-app>
    <component v-bind:is="layout"></component>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import LandingLayout from '@/layouts/Landing'
import DefaultLayout from './layouts/Default'

export default {
  name: 'App',
  computed: {
    ...mapState(['layout'])
  },
  components: {
    landing: LandingLayout,
    default: DefaultLayout
  },
  created() {
    this.$store.dispatch('tryAutoLogin')
  }
}
</script>
