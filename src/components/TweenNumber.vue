<template>
  <span class="tweened-number">{{ animatedNumber }}</span>
</template>

<script>
import gsap from 'gsap'
import utilsFormat from '@/utils/formatting'

export default {
  props: {
    value: {
      type: [Number, String],
      required: true,
    },
    formatPrice: {
      type: Boolean,
      default: true,
    },
    toFixed: {
      type: Number,
      default: 2,
    },
  },
  watch: {
    value(newVal) {
      this.animate(newVal)
    },
  },
  data() {
    return {
      tweenedNumber: 0,
    }
  },
  computed: {
    animatedNumber: function () {
      if (this.formatPrice) {
        return this.formatCurrency(this.tweenedNumber)
      } else {
        return parseFloat(this.tweenedNumber).toFixed(this.toFixed)
      }
    },
  },
  methods: {
    animate(value, speed = 0) {
      gsap.to(this.$data, {
        duration: speed ? speed : 0.75,
        tweenedNumber: value,
      })
    },
    formatCurrency(val) {
      return utilsFormat.formatPrice(val)
    },
  },
  mounted() {
    this.animate(this.value, 0.1) // 0.1: no animation on init
  },
}
</script>
