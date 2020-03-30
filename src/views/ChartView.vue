<template>
  <div class="dashboard px-5">
    <div class="dashboard__chart">
      <v-card class="pa-5">
        <v-card-title class="pa-0 pb-3 text-center">
          Capital Ratio in Percent
        </v-card-title>

        <DoghnutChart
          v-if="groupValuesLoaded"
          :chartData="groupPercentData"
          :options="percentOptions"
        />
      </v-card>
    </div>

    <v-row class="py-7">
      <v-col cols="12" md="6" v-for="group in financeGroups" :key="group.key">
        <div class="dashboard__chart pr-5">
          <v-card class="pa-5">
            <v-card-title> {{ group.title }} </v-card-title>
            <DoghnutChart
              :chartData="itemValuesData(group.title)"
              :options="percentOptions"
            />
          </v-card>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { filter, find } from 'lodash'
import DoghnutChart from '@/components/charts/DoghnutChart'

export default {
  data() {
    return {
      groupPercentData: null,
      percentOptions: {
        tooltips: {
          callbacks: {
            label: function (item, data) {
              const label = data.labels[item.index]
              const value = data.datasets[item.datasetIndex].data[item.index]
              return `${label}: ${value}%`
            },
          },
        },
      },
      groupValuesLoaded: false,
    }
  },
  watch: {
    groupPercentValues: {
      immediate: true,
      handler(values) {
        if (values.length) {
          this.groupValuesLoaded = true
          this.groupPercentData = {
            labels: this.groupNames,
            datasets: [
              {
                data: values,
                backgroundColor: this.getBackgroundColors(0),
                borderWidth: 1,
              },
            ],
          }
        } else {
          this.groupValuesLoaded = false
        }
      },
    },
  },
  methods: {
    getBackgroundColors(mode) {
      let colors = []
      switch (mode) {
        case 0:
          colors = [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ]
          break
        default:
          colors = [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)',
          ]
          break
      }
      return colors
    },
    itemsFromGroup(item) {
      return filter(this.financeItems, { exposition: item })
    },
    itemValuesData(title) {
      const currentGroup = find(this.financeGroups, { title })
      const items = this.itemsFromGroup(title)

      if (items.length) {
        const total = currentGroup.currentValue
        const labels = []
        const values = []
        items.forEach((item, index) => {
          labels[index] = item.title
          values[index] = parseFloat((item.currentValue / total) * 100).toFixed(
            0
          )
        })
        return {
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: this.getBackgroundColors(items.length),
              borderWidth: 1,
            },
          ],
        }
      }
    },
  },
  computed: {
    ...mapState(['financeGroups', 'financeItems']),
    ...mapGetters(['groupNames', 'groupPercentValues']),
  },
  components: {
    DoghnutChart,
  },
}
</script>

<style lang="less" scoped>
.dashboard {
  &__chart {
    margin: 0 auto;
    max-width: 400px;
  }
}
</style>
