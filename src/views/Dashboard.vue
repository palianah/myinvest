<template>
  <div class="dashboard px-5">
    <FinanceGroupTable />

    <div v-for="group in financeGroups" :key="group.title">
      <FinanceItemTable :title="group.title" :item="group.title" />
    </div>

    <!-- <FinanceItemTable :title="financeGroups[0].title" item="P2P" /> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import FinanceGroupTable from '@/components/tables/FinanceGroupTable'
import FinanceItemTable from '@/components/tables/FinanceItemTable'

export default {
  computed: {
    ...mapState(['financeGroups']),
  },
  components: {
    FinanceGroupTable,
    FinanceItemTable,
  },
}
</script>

<style lang="less" scoped></style>
