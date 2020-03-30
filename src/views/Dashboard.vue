<template>
  <div class="dashboard px-5">
    <FinanceGroupTable />

    <div v-for="group in financeGroups" :key="group.title">
      <component
        v-bind:is="itemComponent(group.title)"
        :title="group.title"
      ></component>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import FinanceGroupTable from '@/components/tables/FinanceGroupTable'
import FinanceItemTable from '@/components/tables/FinanceItemTable'
import FinanceItemTableStock from '@/components/tables/FinanceItemTableStock'
import FinanceItemTableP2P from '@/components/tables/FinanceItemTableP2P'
import FinanceItemTableCash from '@/components/tables/FinanceItemTableCash'

export default {
  computed: {
    ...mapState(['financeGroups', 'forex']),
  },
  methods: {
    itemComponent(title) {
      let component = ''
      switch (title.toLowerCase()) {
        case 'stock':
        case 'etf':
          component = 'stock-item'
          break
        case 'p2p':
          component = 'p2p-item'
          break
        case 'cash':
          component = 'cash-item'
          break
        default:
          component = 'default-item'
          break
      }
      return component
    },
  },
  created() {
    // TODO: get only every hour new currency to save request, and only if stock or etf exists!
    this.$store.dispatch('convertExchange', 'EUR/USD')
  },
  components: {
    FinanceGroupTable,
    'default-item': FinanceItemTable,
    'p2p-item': FinanceItemTableP2P,
    'stock-item': FinanceItemTableStock,
    'cash-item': FinanceItemTableCash,
  },
}
</script>

<style lang="less" scoped></style>
