<template>
  <div class="dashboard__table pt-10">
    <v-card>
      <v-card-title>
        {{ title }}
        <v-spacer></v-spacer>
        <v-text-field
          v-model="groupSearch"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="financeItems"
        :items-per-page="10"
        :search="groupSearch"
        class="elevation-1"
      >
        <template v-slot:item.totalInvested="{ item }">
          {{ formatPrice(item.totalInvested) }} €
        </template>
        <template v-slot:item.currentValue="{ item }">
          {{ formatPrice(item.currentValue) }} €
        </template>
        <template v-slot:item.profit="{ item }">
          <v-chip :color="getColor(item.profit)" dark>
            {{ formatPrice(item.profit) }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import utilsFormat from '@/utils/formatting'

export default {
  props: {
    title: [String],
    financeItems: {
      type: [Array, Object],
      required: true,
    },
  },
  data() {
    return {
      groupSearch: '',
      headers: [
        { text: 'Name', value: 'title' },
        { text: 'Description', value: 'description' },
        { text: 'Total invested', value: 'totalInvested' },
        { text: 'Current Value', value: 'currentValue' },
        { text: 'Profit', value: 'profit' },
        // TODO: edit icon to edit values
      ],
    }
  },
  methods: {
    getColor(profit) {
      const val = parseFloat(profit)
      if (val > 0) return 'green'
      else if (val === 0) return 'orange'
      else return 'red'
    },
    formatPrice(val) {
      return utilsFormat.formatPrice(val)
    },
  },
  created() {
    if (this.title === 'Stock' || this.title === 'ETF') {
      this.headers.splice(
        2,
        0,
        { text: 'Amount', value: 'amount' },
        { text: 'Average stock price', value: 'averageStockPrice' }
      )
    }
  },
}
</script>

<style lang="less" scoped></style>
