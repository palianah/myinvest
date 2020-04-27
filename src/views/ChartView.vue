<template>
  <div class="dashboard px-5">
    <v-row class="justify-center">
      <v-col cols="12" md="6">
        <v-card class="pa-5">
          <v-card-text class="dashboard__card__headline pa-0 pb-3">
            {{ $vuetify.lang.t('$vuetify.chart.capitalRationHeadline') }}
          </v-card-text>
          <div class="dashboard__chart" v-if="!isLoading">
            <DoghnutChart
              class="dashboard__chart__doghnut"
              v-if="groupValuesLoaded"
              :chartData="groupPercentData"
              :options="percentOptions"
            />
            <ul class="dashboard__chart__legend" v-if="groupPercentData">
              <li
                class="dashboard__chart__legend__item"
                v-for="(data, index) in groupPercentData.datasets[0].data"
                :key="data"
              >
                <span
                  class="dashboard__chart__legend__bubble"
                  :style="{
                    backgroundColor:
                      groupPercentData.datasets[0].backgroundColor[index],
                  }"
                ></span>
                <span class="dashboard__chart__legend__text">
                  {{ groupPercentData.labels[index] }}
                </span>
                <span class="dashboard__chart__legend__value">
                  {{ data }}%
                </span>
              </li>
            </ul>
            <p v-else>
              <i>{{ $vuetify.lang.t('$vuetify.chart.noGroup') }}</i>
            </p>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-5">
          <v-card-text class="dashboard__card__headline pa-0 pb-3">
            {{ $vuetify.lang.t('$vuetify.chart.customLineBarHeadline') }}
          </v-card-text>
          <CustomLineBar>
            <template v-slot:currentValue="{ item }">
              <p class="ma-0"><TweenNumber :value="item.currentValue" /> €</p>
            </template>
          </CustomLineBar>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { filter, find } from 'lodash'
import DoghnutChart from '@/components/charts/DoghnutChart'
import CustomLineBar from '@/components/charts/CustomLineBar'
import TweenNumber from '@/components/TweenNumber.vue'

export default {
  data() {
    return {
      isLoading: true,
      groupLegend: null,
      groupPercentData: null,
      percentOptions: {
        legend: {
          display: false,
          position: 'right',
          align: 'center',
        },
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
    showTour() {
      this.isLoading = false
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
  mounted() {
    if (this.showTour !== null) {
      this.isLoading = false
    }
  },
  computed: {
    ...mapState(['financeGroups', 'financeItems', 'showTour']),
    ...mapGetters(['allGroups', 'groupPercentValues']),
    groupNames() {
      const groupNames = this.allGroups.map((groups) => {
        return groups.title
      })
      return groupNames
    },
  },
  components: {
    DoghnutChart,
    CustomLineBar,
    TweenNumber,
  },
}
</script>

<style lang="less">
@import '../assets/less/structure.less';

.dashboard {
  &__card__headline {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  &__chart {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    &__doghnut {
      @media @mobile {
        margin: 0;
        max-width: 250px;
      }

      max-width: 350px;
      margin: 0 20px 0 0;
      width: 50%;
      flex: 1 0 50%;
    }

    &__legend {
      @media @mobile {
        width: auto;
        flex: none;
      }

      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-flow: column;
      justify-content: center;
      flex: 1 0 40%;
      width: 40%;

      &__item {
        @media @mobile {
          font-size: 13px;
        }

        font-size: 15px;
        padding-bottom: 12px;
      }

      &__bubble {
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }

      &__text {
        padding-left: 5px;
        display: inline-block;
      }

      &__value {
        display: inline-block;
        padding-left: 10px;
      }
    }
  }
}
</style>
