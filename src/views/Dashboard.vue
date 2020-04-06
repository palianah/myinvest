<template>
  <div class="dashboard px-2 pt-2">
    <FinanceGroupTable />

    <v-expansion-panels v-model="panel" multiple flat tile>
      <v-expansion-panel v-for="group in sortedGroups" :key="group.title">
        <component
          v-bind:is="itemComponent(group.title)"
          :title="group.title"
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
      isMobile: false,
      panel: [],
    }
  },
  watch: {
    sortedGroups(newValue) {
      if (newValue && this.isMobile) {
        this.panel = []
      } else {
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
    onResize() {
      if (window.innerWidth < 768) {
        this.isMobile = true
        this.panel = []
      } else {
        this.isMobile = false
        this.openAllPanels()
      }
    },
    openAllPanels() {
      const panel = []
      const iterator = this.sortedGroups.keys()

      for (const key of iterator) {
        panel.push(key)
      }
      this.panel = panel
    },
    itemComponent(title) {
      let component = ''
      switch (title.toLowerCase()) {
        case 'stock':
        case 'etf':
        case 'crypto':
        case 'krypto':
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
    window.addEventListener('resize', this.onResize)
    this.onResize()
  },
  destroyed() {
    window.removeEventListener('resize', this.onResize)
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
