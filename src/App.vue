<template>
  <v-app>
    <component v-bind:is="layout"></component>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import LandingLayout from '@/layouts/Landing'
import DefaultLayout from './layouts/Default'
import Footer from './components/Footer'

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
    Footer,
  },
  created() {
    this.$vuetify.lang.current = this.$route.params.lang
    this.$store.dispatch('tryAutoLogin')
  },
}
</script>
