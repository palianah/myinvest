<template>
  <div class="dashboard__table" v-if="filteredGroups.length">
    <v-card>
      <v-card-title>
        My Portfolio
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
        :items="filteredGroups"
        :items-per-page="10"
        :search="groupSearch"
        class="elevation-1"
      >
        <template v-slot:item.totalInvested="{ item }">
          <TweenNumber :value="item.totalInvested" />
          €
        </template>
        <template v-slot:item.profit="{ item }">
          <span class="dashboard__table__profit" :class="getColor(item.profit)">
            <v-icon class="dashboard__table__arrow">
              mdi-{{ getIcon(item.profit) }}
            </v-icon>
            <TweenNumber :value="calculateProfit(item)" :formatPrice="false" />
            %
          </span>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon @click.stop="editGroup(item)" :title="item.actions"
            >mdi-pencil</v-icon
          >
          <v-icon @click.stop="deleteGroup(item)" :title="item.actions"
            >mdi-delete</v-icon
          >
        </template>
      </v-data-table>
      <div class="dashboard__table__footer__prepend">
        <p class="dashboard__table__footer__prepend__text">
          Total:
          <b><TweenNumber :value="totalCapitalAsset" /> €</b>

          <span
            class="pl-2"
            :class="{
              'c-red': calculateTotalProfit < 0,
              'c-green': calculateTotalProfit > 0,
              'c-orange': calculateTotalProfit === 0,
            }"
          >
            <v-icon class="dashboard__table__arrow">
              mdi-{{ getTotalIcon }}
            </v-icon>
            <TweenNumber :value="calculateTotalProfit" /> %
          </span>
        </p>
      </div>
    </v-card>

    <FormDialog
      :formOpen="formOpen"
      :modalComponent="modalComponent"
      :modalItem="modalItem"
      :editMode="true"
      @close="closeFormDialog"
    />
    <ConfirmDialog
      :confirmOpen="confirmOpen"
      :item="modalItem"
      @dialog-event="confirmEvent"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FormDialog from '@/components/dialog/FormDialog'
import ConfirmDialog from '@/components/dialog/ConfirmDialog'
import TweenNumber from '@/components/TweenNumber'

export default {
  data() {
    return {
      formOpen: false,
      confirmOpen: false,
      modalComponent: '',
      modalItem: '',
      groupSearch: '',
      headers: [
        { text: 'Name', value: 'title' },
        { text: 'Description', value: 'description', width: '300' },
        { text: 'Total invested', value: 'totalInvested' },
        { text: 'Profit', value: 'profit', width: '150' },
        {
          text: 'Actions',
          value: 'actions',
          width: '100',
          align: 'right',
          sortable: false,
        },
      ],
    }
  },
  methods: {
    getColor(profit) {
      const val = parseFloat(profit)
      if (val > 0) return 'c-green'
      else if (val === 0) return 'c-orange'
      else return 'c-red'
    },
    getIcon(profit) {
      const val = parseFloat(profit)
      if (val > 0) return 'arrow-up-bold'
      if (val < 0) return 'arrow-down-bold'
      return 'swap-horizontal'
    },
    calculateProfit(item) {
      const totalInvested = parseFloat(item.totalInvested)
      const profit = parseFloat(item.profit)
      if (totalInvested === 0 && profit === 0) {
        return 0.0
      }
      const calc = parseFloat((profit / totalInvested) * 100).toFixed(2)
      return calc
    },
    editGroup(item) {
      this.formOpen = true
      this.modalComponent = 'group'
      this.modalItem = item
    },
    deleteGroup(item) {
      this.modalItem = item
      this.confirmOpen = true
    },
    closeFormDialog() {
      this.formOpen = false
      this.modalComponent = ''
      this.modalItem = ''
    },
    confirmEvent(payload) {
      if (payload.mode === 'confirm') {
        this.$store.dispatch('deleteFinanceGroup', payload)
      }
      this.confirmOpen = false
    },
  },
  computed: {
    ...mapGetters(['filteredGroups', 'totalCapitalAsset']),
    calculateTotalProfit() {
      let invested = 0
      let profit = 0
      this.filteredGroups.forEach((item) => {
        invested += parseFloat(item.totalInvested)
        profit += parseFloat(item.profit)
      })
      const finalProfit = parseFloat((profit / invested) * 100).toFixed(2)
      return parseFloat(finalProfit)
    },
    getTotalIcon() {
      const val = this.calculateTotalProfit
      if (val > 0) return 'arrow-up-bold'
      if (val < 0) return 'arrow-down-bold'
      return 'swap-horizontal'
    },
  },
  components: {
    FormDialog,
    ConfirmDialog,
    TweenNumber,
  },
}
</script>

<style lang="less">
.dashboard__table {
  &__footer__prepend {
    margin-top: -58px;
    height: 58px;

    &__text {
      font-size: 15px;
      padding: 17px;
    }
  }
}
</style>
