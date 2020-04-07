<template>
  <v-tour
    class="tour-app"
    name="TourApp"
    :steps="steps"
    :options="tourOptions"
    :callbacks="tourCallbacks"
  >
  </v-tour>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    drawer: {
      type: [Boolean],
    },
  },
  // https://github.com/pulsardev/vue-tour/wiki
  data() {
    return {
      tourCallbacks: {
        onStop: this.onTourStop,
      },
      tourOptions: {
        startTimeout: 0,
        useKeyboardNavigation: true,
        highlight: false,
        labels: {
          buttonSkip: this.$vuetify.lang.t('$vuetify.tour.skipBtn'),
          buttonPrevious: this.$vuetify.lang.t('$vuetify.tour.prevBtn'),
          buttonNext: this.$vuetify.lang.t('$vuetify.tour.nextBtn'),
          buttonStop: this.$vuetify.lang.t('$vuetify.tour.stopBtn'),
        },
      },
      steps: [
        {
          target: '#v-step-1',
          content: this.$vuetify.lang.t('$vuetify.tour.step1'),
        },
        {
          target: '#v-step-2',
          content: this.$vuetify.lang.t('$vuetify.tour.step2'),
        },
        {
          target: '#v-step-3',
          content: this.$vuetify.lang.t('$vuetify.tour.step3'),
        },
        {
          target: '#v-step-4',
          content: this.$vuetify.lang.t('$vuetify.tour.step4'),
        },
        {
          target: '#v-step-5',
          content: this.$vuetify.lang.t('$vuetify.tour.step5'),
        },
      ],
    }
  },
  watch: {
    drawer(open) {
      if (this.showTour && open) {
        this.$tours['TourApp'].start()
      }
    },
    showTour(noData) {
      if (noData && this.drawer) {
        this.$tours['TourApp'].start()
      }
    },
  },
  methods: {
    onTourStop() {
      this.$store.commit('SHOW_TOUR', false)
    },
  },
  computed: {
    ...mapState(['showTour']),
  },
}
</script>
<style lang="less">
@import '../assets/less/structure.less';

.tour-app {
  // overwrite tour css
  .v-step {
    background: #00695c !important;
    left: 20px !important;
    width: 260px;

    @media @tablet {
      width: 300px;
      left: 100px !important;
    }

    &__arrow {
      border-color: #00695c !important;
      border-left-color: transparent !important;
      border-right-color: transparent !important;
      border-top-color: transparent !important;
      left: 50px !important;
    }
  }
}
</style>
