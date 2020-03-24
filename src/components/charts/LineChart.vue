<script>
import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  props: ['chartdata'],
  data() {
    return {
      options: {
        legend: {
          display: false,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    }
  },
  mounted() {
    this.renderChart(this.chartdata, this.options)
  },
}
</script>

<style lang="less" scoped></style>
