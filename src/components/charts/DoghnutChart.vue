<script>
import { Doughnut, mixins } from 'vue-chartjs'

export default {
  extends: Doughnut,
  mixins: [mixins.reactiveProp],
  props: {
    chartData: {
      type: Object,
      default: null,
    },
    options: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    htmlLegend: null,
  }),
  mounted() {
    this.renderChart(this.chartData, this.options)
    this.htmlLegend = this.generateLegend()
  },
}
</script>

<style lang="less" scoped></style>
