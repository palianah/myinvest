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
    ...mapState(['layout', 'userId']),
  },
  watch: {
    userId(userId) {
      if (userId) {
        this.$store.dispatch('getFinanceGroups')
        this.$store.dispatch('getFinanceItems')
      }
    },
  },
  components: {
    landing: LandingLayout,
    default: DefaultLayout,
  },
  created() {
    this.$vuetify.lang.current = this.$route.params.lang
    this.$store.dispatch('tryAutoLogin')
  },
}
</script>
