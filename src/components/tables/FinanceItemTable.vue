<template>
  <div class="dashboard__table pt-10">
    <v-card>
      <v-card-title>
        {{ title }}
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="getItemsFromGroup"
        :items-per-page="10"
        hide-default-footer
        class="elevation-1"
      >
        <template v-slot:item.totalInvested="{ item }">
          <TweenNumber :value="item.totalInvested" /> €
        </template>
        <template v-slot:item.currentValue="{ item }">
          <TweenNumber :value="item.currentValue" /> €
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
              <TweenNumber
                :value="item.amount"
                :toFixed="0"
                :formatPrice="false"
              />
            </span>
            <v-icon
              :title="`Buy more ${item.title} ${item.exposition}s`"
              @click.stop="buyItem(item)"
              class="dashboard__table__amount__icon"
              >mdi-plus</v-icon
            >
          </span>
        </template>
        <template v-slot:item.averageStockPrice="{ item }">
          <TweenNumber :value="item.averageStockPrice" />
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
          <v-icon @click.stop="editItem(item)" title="Edit">mdi-pencil</v-icon>
          <v-icon @click.stop="deleteItem(item)" title="Delete"
            >mdi-delete</v-icon
          >
        </template>
        <template v-slot:footer>
          <div class="dashboard__table__footer">
            <div class="dashboard__table__footer__item">
              Total:
              <b><TweenNumber :value="totalCapitalAsset" /> € </b>
            </div>
            <div class="dashboard__table__footer__item">
              <span
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
            </div>
          </div>
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
      :item="modalItem"
      @dialog-event="confirmEvent"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { filter } from 'lodash'
import FormDialog from '@/components/dialog/FormDialog'
import ConfirmDialog from '@/components/dialog/ConfirmDialog'
import TweenNumber from '@/components/TweenNumber'

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
      headers: [
        { text: 'Name', value: 'title' },
        { text: 'Invested', value: 'totalInvested' },
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
      return calc
    },
    editItem(item) {
      this.formOpen = true
      this.modalComponent = 'item'
      this.modalItem = item
    },
    deleteItem(item) {
      this.modalItem = item
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
        this.$store.dispatch('deleteFinanceItem', payload.key)
      }
      this.confirmOpen = false
      this.modalItem = ''
    },
  },
  computed: {
    ...mapState(['financeItems']),
    getItemsFromGroup() {
      return filter(this.financeItems, { exposition: this.item })
    },
    totalCapitalAsset() {
      let value = 0
      this.getItemsFromGroup.forEach((item) => {
        value += parseFloat(item.currentValue)
      })
      return value
    },
    calculateTotalProfit() {
      let invested = 0
      let profit = 0
      this.getItemsFromGroup.forEach((item) => {
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
  created() {
    if (this.title === 'Stock' || this.title === 'ETF') {
      this.headers.splice(
        2,
        0,
        { text: 'Amount', value: 'amount' },
        { text: 'Av. stock price', value: 'averageStockPrice' }
      )
    }
    // TODO: if cash, change invested to total value?
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

  &__footer {
    border-top: thin solid rgba(0, 0, 0, 0.12);
    padding: 15px;
    font-size: 15px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    &__item {
      .c-red {
        color: red;
      }
      .c-green {
        color: green;
      }
      .c-orange {
        color: orange;
      }
    }
  }
}
</style>
