<template>
  <div class="dashboard__table pt-5">
    <v-card>
      <v-expansion-panel-header>
        <v-card-title class="dashboard__table__title">
          <div>{{ title }}</div>
          <div>
            <v-icon
              :title="$vuetify.lang.t('$vuetify.sidebar.addItem')"
              @click.stop="addItem"
              >mdi-pencil-plus</v-icon
            >
          </div>
        </v-card-title>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-data-table
          :headers="headers"
          :items="tableItems"
          :items-per-page="10"
          hide-default-footer
          :mobile-breakpoint="768"
        >
          <template v-slot:item.totalInvested="{ item }">
            <TweenNumber :value="item.totalInvested" /> €
          </template>
          <template v-slot:item.currentValue="{ item }">
            <TweenNumber :value="item.currentValue" /> €
          </template>
          <template v-slot:item.realStockPrice="{ item }">
            <span v-if="stockData && stockData[item.stockID]">
              {{ stockData[item.stockID].real_price }}
              <span
                :class="stockDataColor(stockData[item.stockID].percent_change)"
              >
                ({{ stockDataPercent(stockData[item.stockID].percent_change) }}
                %)
              </span>
            </span>
            <span v-else>
              <v-skeleton-loader
                :boilerplate="!stockData[item.stockID]"
                ref="skeleton"
                type="text"
                tile
                class="mx-auto"
              ></v-skeleton-loader>
            </span>
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
            <span
              class="dashboard__table__profit"
              :class="getColor(item.profit)"
            >
              <v-icon class="dashboard__table__arrow">
                mdi-{{ getIcon(item.profit) }}
              </v-icon>
              <TweenNumber
                :value="calculateProfit(item)"
                :formatPrice="false"
              />
              %
              <span class="dashboard__table__profit__text">
                (
                <span v-if="Math.sign(parseFloat(item.profit)) !== -1">+</span>
                <TweenNumber :value="item.profit" />
                €)
              </span>
            </span>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon @click.stop="editItem(item)" title="Edit"
              >mdi-pencil</v-icon
            >
            <v-icon @click.stop="deleteItem(item)" title="Delete"
              >mdi-delete</v-icon
            >
          </template>
          <template v-slot:footer>
            <div class="dashboard__table__footer">
              <div class="dashboard__table__footer__item">
                {{ $vuetify.lang.t('$vuetify.table.footer.total') }}:
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
      </v-expansion-panel-content>
    </v-card>

    <FormDialog
      :formOpen="formOpen"
      :modalComponent="modalComponent"
      :modalItem="modalItem"
      :editMode="editMode"
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
import { find } from 'lodash'
import FormDialog from '@/components/dialog/FormDialog'
import ConfirmDialog from '@/components/dialog/ConfirmDialog'
import TweenNumber from '@/components/TweenNumber'
import TableItemMixin from '@/mixins/TableItem.mixin'

export default {
  mixins: [TableItemMixin],
  props: {
    title: [String],
  },
  data() {
    return {
      stockData: {},
      headers: [
        {
          text: this.$vuetify.lang.t('$vuetify.table.headlines.name'),
          value: 'title',
        },
        {
          text: this.$vuetify.lang.t('$vuetify.table.headlines.totalInvested'),
          value: 'totalInvested',
        },
        {
          text: this.$vuetify.lang.t('$vuetify.table.headlines.currentValue'),
          value: 'currentValue',
        },
        {
          text: this.$vuetify.lang.t('$vuetify.table.headlines.amount'),
          value: 'amount',
        },
        {
          text: this.$vuetify.lang.t('$vuetify.table.headlines.averagePrice'),
          value: 'averageStockPrice',
        },
        {
          text: this.$vuetify.lang.t('$vuetify.table.headlines.realtimePrice'),
          value: 'realStockPrice',
        },
        {
          text: this.$vuetify.lang.t('$vuetify.table.headlines.profit'),
          value: 'profit',
        },
        {
          text: this.$vuetify.lang.t('$vuetify.table.headlines.actions'),
          value: 'actions',
          width: '100',
          align: 'right',
          sortable: false,
        },
      ],
    }
  },
  watch: {
    // TODO: this immediate trigger is needed for route change.
    // could be refactored to save stock api requests if data is stored to
    // vuex initially on getting Data and fetching real_prices there!
    forex: {
      immediate: true,
      handler(forex) {
        if (forex && forex.value && this.tableItems.length) {
          this.$store
            .dispatch('realStockPrice', this.tableItems)
            .then((res) => {
              // reactivity for deep objects:
              // https://vuejs.org/v2/guide/reactivity.html#For-Objects
              if (this.tableItems.length > 1) {
                Object.values(res).forEach((data, i) => {
                  this.$set(this.stockData, data.symbol, data)
                  this.updateItem(data, this.tableItems[i])
                })
              } else {
                this.$set(this.stockData, res.symbol, res)
                this.updateItem(res, this.tableItems[0])
              }
            })
        }
      },
    },
  },
  methods: {
    buyItem(item) {
      let real_price = ''
      if (
        this.stockData[item.stockID] &&
        'real_price' in this.stockData[item.stockID]
      ) {
        real_price = this.stockData[item.stockID].real_price
      }
      this.formOpen = true
      this.modalComponent = 'item-add'
      this.modalItem = {
        ...item,
        real_price,
      }
    },
    sellItem(item) {
      let real_price = ''
      if (
        this.stockData[item.stockID] &&
        'real_price' in this.stockData[item.stockID]
      ) {
        real_price = this.stockData[item.stockID].real_price
      }
      this.formOpen = true
      this.modalComponent = 'item-extract'
      this.modalItem = {
        ...item,
        real_price,
      }
    },
    stockDataPercent(percent) {
      let res = parseFloat(parseFloat(percent).toFixed(2))
      if (res > 0) {
        res = '+' + res
      }
      return res
    },
    stockDataColor(percent) {
      const res = parseFloat(percent)
      if (res < 0) {
        return 'c-red'
      } else if (res > 0) {
        return 'c-green'
      }
      return 'c-orange'
    },
    updateItem(res, item) {
      const curItem = find(this.financeItems, { stockID: item.stockID })
      const curPrice = curItem.amount * res.real_price
      const curProfit = curPrice - curItem.totalInvested
      this.$store.dispatch('updateFinanceItem', {
        ...item,
        currentValue: curPrice,
        profit: curProfit,
      })
    },
  },
  computed: {
    ...mapState(['financeItems', 'forex']),
  },
  components: {
    FormDialog,
    ConfirmDialog,
    TweenNumber,
  },
}
</script>
