<template>
  <div class="dashboard__table">
    <v-card>
      <v-card-title>
        My Finance Expositions
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
        :items="groupsWithInvestments"
        :items-per-page="10"
        :search="groupSearch"
        class="elevation-1"
      >
        <template v-slot:item.totalInvested="{ item }">
          {{ item.totalInvested }} €
        </template>
        <template v-slot:item.currentValue="{ item }">
          {{ item.currentValue }} €
        </template>
        <template v-slot:item.profit="{ item }">
          <v-chip :color="getColor(item.profit)" dark>
            {{ item.profit }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      groupSearch: '',
      headers: [
        { text: 'Name', value: 'title' },
        { text: 'Description', value: 'description', width: '300' },
        { text: 'Total invested', value: 'totalInvested' },
        { text: 'Current Value', value: 'currentValue' },
        { text: 'Profit', value: 'profit' },
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
  },
  computed: {
    ...mapGetters(['groupsWithInvestments']),
  },
}
</script>

<style lang="less" scoped></style>
