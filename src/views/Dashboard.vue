<template>
  <div class="dashboard px-2 pt-2">
    <FinanceGroupTable />

    <v-expansion-panels v-model="openedPanels" multiple flat tile>
      <v-expansion-panel v-for="group in sortedGroups" :key="group.key">
        <component
          v-bind:is="itemComponent(group.groupType)"
          :group="group"
        ></component>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import FinanceGroupTable from '@/components/tables/FinanceGroupTable'
import FinanceItemTable from '@/components/tables/FinanceItemTable'
import FinanceItemTableStock from '@/components/tables/FinanceItemTableStock'
import FinanceItemTableP2P from '@/components/tables/FinanceItemTableP2P'
import FinanceItemTableCash from '@/components/tables/FinanceItemTableCash'

export default {
  data() {
    return {
      openedPanels: [],
    }
  },
  watch: {
    sortedGroups() {
      if (this.isDesktop()) {
        this.openAllPanels()
      }
    },
  },
  computed: {
    ...mapState(['forex']),
    ...mapGetters(['sortedGroups']),
    hasFinanceData() {
      return this.sortedGroups.length
    },
  },
  methods: {
    isDesktop() {
      if (window.innerWidth >= 768) {
        return true
      }
      return false
    },
    openAllPanels() {
      const panels = []
      const iterator = this.sortedGroups.keys()

      for (const key of iterator) {
        panels.push(key)
      }
      this.openedPanels = panels
    },
    itemComponent(groupType) {
      let component = ''
      switch (groupType) {
        case 'trade':
          component = 'trade-item'
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
    if (this.isDesktop()) {
      this.openAllPanels()
    }
  },
  components: {
    FinanceGroupTable,
    'default-item': FinanceItemTable,
    'p2p-item': FinanceItemTableP2P,
    'trade-item': FinanceItemTableStock,
    'cash-item': FinanceItemTableCash,
  },
}
</script>

<style lang="less">
.dashboard {
  // overwrite expansion panel
  .v-expansion-panel {
    margin-bottom: 1px;
  }
  .v-expansion-panel-header__icon {
    display: none;
  }
  .v-expansion-panel-content__wrap {
    padding: 0;
  }
  .v-expansion-panel .v-card__title {
    padding: 0;
  }
}
</style>
