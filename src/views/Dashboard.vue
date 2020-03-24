<template>
  <div class="dashboard px-5">
    <FinanceGroupTable />

    <!-- <div v-for="group in financeGroups" :key="group.title">
      <FinanceItemTable
        v-if="getItemsFromGroup()"
        :title="group.title"
        :financeItems="getItemsFromGroup(group.title)"
      />
    </div> -->

    <FinanceItemTable
      v-if="getItemsFromGroup()"
      :title="financeGroups[0].title"
      :financeItems="getItemsFromGroup(financeGroups[0].title)"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { filter } from 'lodash'
import FinanceGroupTable from '@/components/tables/FinanceGroupTable'
import FinanceItemTable from '@/components/tables/FinanceItemTable'

export default {
  computed: {
    ...mapState(['financeGroups', 'financeItems']),
  },
  methods: {
    getItemsFromGroup(group) {
      const item = filter(this.financeItems, { exposition: group })
      return item
    },
  },
  components: {
    FinanceGroupTable,
    FinanceItemTable,
  },
}
</script>

<style lang="less" scoped></style>
