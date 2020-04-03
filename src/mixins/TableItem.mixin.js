import { filter } from 'lodash'

// mixin used for FinanceItemTable Components
const tableItem = {
  data() {
    return {
      formOpen: false,
      confirmOpen: false,
      editMode: true,
      modalComponent: '',
      modalItem: '',
      headers: [
        {
          text: this.$vuetify.lang.t('$vuetify.table.headlines.name'),
          value: 'title',
        },
        {
          text: this.$vuetify.lang.t('$vuetify.table.headlines.totalInvested'),
          value: 'totalInvested',
          sortable: false,
        },
        {
          text: this.$vuetify.lang.t('$vuetify.table.headlines.currentValue'),
          value: 'currentValue',
        },
        {
          text: this.$vuetify.lang.t('$vuetify.table.headlines.profit'),
          value: 'profit',
          sortable: false,
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
    addItem() {
      this.formOpen = true
      this.modalComponent = 'item'
      this.editMode = false
      this.modalItem = {
        exposition: this.title,
      }
    },
    deleteItem(item) {
      this.modalItem = item
      this.confirmOpen = true
    },
    closeFormDialog() {
      this.formOpen = false
      this.modalComponent = ''
      this.modalItem = ''
      this.editMode = true
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
    tableItems() {
      return filter(this.financeItems, { exposition: this.title })
    },
    totalCapitalAsset() {
      let value = 0
      this.tableItems.forEach((item) => {
        value += parseFloat(item.currentValue)
      })
      return value
    },
    calculateTotalProfit() {
      let invested = 0
      let profit = 0
      this.tableItems.forEach((item) => {
        invested += parseFloat(item.totalInvested)
        profit += parseFloat(item.profit)
      })
      const finalProfit = parseFloat((profit / invested) * 100).toFixed(2)
      if (finalProfit === 'NaN') return 0
      return parseFloat(finalProfit)
    },
    getTotalIcon() {
      const val = this.calculateTotalProfit
      if (val > 0) return 'arrow-up-bold'
      if (val < 0) return 'arrow-down-bold'
      return 'swap-horizontal'
    },
  },
}

export default tableItem
