<template>
  <div class="dashboard__table">
    <v-card>
      <v-card-title>
        My Finance Expositions
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
        :items="groupsWithInvestments"
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
        <template v-slot:item.profit="{ item }">
          <span class="dashboard__table__profit" :class="getColor(item.profit)">
            <v-icon class="dashboard__table__arrow">
              mdi-{{ getIcon(item.profit) }}
            </v-icon>
            {{ calculateProfit(item) }}
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
import { mapGetters } from 'vuex'
import utilsFormat from '@/utils/formatting'
import FormDialog from '@/components/dialog/FormDialog'
import ConfirmDialog from '@/components/dialog/ConfirmDialog'

export default {
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
      const calc = parseFloat((profit / totalInvested) * 100).toFixed(2)
      return `${calc}%`
    },
    formatPrice(val) {
      return utilsFormat.formatPrice(val)
    },
    editGroup(item) {
      this.formOpen = true
      this.modalComponent = 'group'
      this.modalItem = item
    },
    deleteGroup(item) {
      this.deleteTitle = item.title
      this.confirmOpen = true
    },
    closeFormDialog() {
      this.formOpen = false
      this.modalComponent = ''
      this.modalItem = ''
    },
    confirmEvent(payload) {
      if (payload.mode === 'confirm') {
        // TODO: use dispatch action after firebase connected
        this.$store.commit('DELETE_FINANCE_GROUP', payload.title)
      }
      this.confirmOpen = false
    },
  },
  computed: {
    ...mapGetters(['groupsWithInvestments']),
  },
  components: {
    FormDialog,
    ConfirmDialog,
  },
}
</script>

<style lang="less" scoped></style>
