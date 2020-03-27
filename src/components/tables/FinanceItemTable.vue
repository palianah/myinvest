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
        :items="getItemsFromGroup"
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
        <template v-slot:item.amount="{ item }">
          <span class="dashboard__table__amount">
            <v-icon
              :title="`Sell ${item.title} ${item.exposition}s`"
              @click.stop="sellItem(item)"
              class="dashboard__table__amount__icon"
              >mdi-minus</v-icon
            >
            <span class="dashboard__table__amount__text">
              {{ item.amount }}
            </span>
            <v-icon
              :title="`Buy more ${item.title} ${item.exposition}s`"
              @click.stop="buyItem(item)"
              class="dashboard__table__amount__icon"
              >mdi-plus</v-icon
            >
          </span>
        </template>
        <template v-slot:item.profit="{ item }">
          <span class="dashboard__table__profit" :class="getColor(item.profit)">
            <v-icon class="dashboard__table__arrow">
              mdi-{{ getIcon(item.profit) }}
            </v-icon>
            {{ calculateProfit(item) }}
          </span>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon @click.stop="editItem(item)" title="Edit">mdi-pencil</v-icon>
          <v-icon @click.stop="deleteItem(item)" title="Delete"
            >mdi-delete</v-icon
          >
        </template>
      </v-data-table>
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
      :title="deleteTitle"
      @dialog-event="confirmEvent"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { filter } from 'lodash'
import utilsFormat from '@/utils/formatting'
import FormDialog from '@/components/dialog/FormDialog'
import ConfirmDialog from '@/components/dialog/ConfirmDialog'

export default {
  props: {
    title: [String],
    item: {
      type: [String],
      required: true,
    },
  },
  data() {
    return {
      formOpen: false,
      confirmOpen: false,
      modalComponent: '',
      modalItem: '',
      deleteTitle: '',
      groupSearch: '',
      headers: [
        { text: 'Name', value: 'title' },
        { text: 'Total invested', value: 'totalInvested' },
        { text: 'Current Value', value: 'currentValue' },
        { text: 'Profit', value: 'profit' },
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
      const calc = parseFloat((profit / totalInvested) * 100).toFixed(2)
      return `${calc}%`
    },
    formatPrice(val) {
      return utilsFormat.formatPrice(val)
    },
    editItem(item) {
      this.formOpen = true
      this.modalComponent = 'item'
      this.modalItem = item
    },
    deleteItem(item) {
      this.deleteTitle = item.title
      this.confirmOpen = true
    },
    buyItem(item) {
      this.formOpen = true
      this.modalComponent = 'item-add'
      this.modalItem = item
    },
    sellItem(item) {
      this.formOpen = true
      this.modalComponent = 'item-extract'
      this.modalItem = item
    },
    closeFormDialog() {
      this.formOpen = false
      this.modalComponent = ''
      this.modalItem = ''
    },
    confirmEvent(payload) {
      if (payload.mode === 'confirm') {
        // TODO: use dispatch action after firebase connected
        this.$store.commit('DELETE_FINANCE_ITEM', payload.title)
      }
      this.confirmOpen = false
    },
  },
  computed: {
    ...mapState(['financeItems']),
    getItemsFromGroup() {
      return filter(this.financeItems, { exposition: this.item })
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
  components: {
    FormDialog,
    ConfirmDialog,
  },
}
</script>

<style lang="less">
.dashboard__table {
  &__profit {
    background: transparent;

    &.c-red {
      color: red;
    }
    &.c-green {
      color: green;
    }
    &.c-orange {
      color: orange;
    }
  }

  .v-icon {
    font-size: 18px;
  }

  &__arrow {
    font-size: 16px;

    &.mdi-arrow-down-bold {
      color: red;
    }
    &.mdi-arrow-up-bold {
      color: green;
    }
    &.mdi-swap-horizontal {
      color: orange;
    }
  }

  &__amount {
    width: 200px;

    &__icon {
      font-size: 16px !important;
    }
  }
}
</style>
