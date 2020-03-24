<script>
import { Doughnut } from 'vue-chartjs'

export default {
  extends: Doughnut,
  props: ['chartdata'],
  data() {
    return {
      options: {},
    }
  },
  mounted() {
    this.renderChart(this.chartdata, this.options)
  },
}
</script>

<style lang="less" scoped></style>
