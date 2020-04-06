<template>
  <div class="dashboard__table">
    <v-row cols="12">
      <v-col cols="12" md="4">
        <v-card class="dashboard__table__card">
          <v-card-title class="dashboard__table__card-title">
            <div>
              {{ $vuetify.lang.t('$vuetify.table.tableGroupHeadline') }}
            </div>
            <div class="dashboard__table__card-price">
              <b><TweenNumber :value="totalCapitalAsset" /> €</b>
            </div>
          </v-card-title>
          <v-card-text>
            <div class="dashboard__table__card-text">
              <span class="dashboard__table__card-text__headline">
                {{ $vuetify.lang.t('$vuetify.table.headlines.totalInvested') }}
              </span>
              <span class="dashboard__table__card-text__value pl-2">
                <b><TweenNumber :value="totalInvested" /> €</b>
              </span>
            </div>
            <div class="dashboard__table__card-text">
              <span class="dashboard__table__card-text__headline">
                {{ $vuetify.lang.t('$vuetify.table.totalGroups') }}
              </span>
              <span class="dashboard__table__card-text__value pl-2">
                {{ filteredGroups.length }}
              </span>
            </div>
            <div class="dashboard__table__card-text">
              <span class="dashboard__table__card-text__headline">
                {{ $vuetify.lang.t('$vuetify.table.totalItems') }}
              </span>
              <span class="dashboard__table__card-text__value pl-2">
                {{ financeItems.length }}
              </span>
            </div>
            <div class="dashboard__table__card-text">
              <span class="dashboard__table__card-text__headline">
                {{ $vuetify.lang.t('$vuetify.table.headlines.profit') }}:
              </span>
              <span
                class="dashboard__table__card-text__value pl-2"
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
                <span class="dashboard__table__profit__text">
                  <span v-if="Math.sign(totalProfit) !== -1">+</span>
                  <TweenNumber :value="totalProfit" />
                  €
                </span>
              </span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="8">
        <v-card style="height: 100%;">
          <v-card-title class="dashboard__table__title">
            <div>
              {{ $vuetify.lang.t('$vuetify.table.tableAllGroupsHeadline') }}
            </div>
            <div>
              <v-icon
                :title="$vuetify.lang.t('$vuetify.sidebar.addGroup')"
                @click.stop="addGroup"
                >mdi-pencil-plus</v-icon
              >
            </div>
          </v-card-title>
          <v-data-table
            v-model="selected"
            :headers="headers"
            :items="filteredGroups"
            :items-per-page="10"
            hide-default-footer
            :mobile-breakpoint="768"
          >
            <template v-slot:item.totalInvested="{ item }">
              <TweenNumber :value="item.totalInvested" />
              €
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
                  <span v-if="Math.sign(item.profit) !== -1">+</span>
                  <TweenNumber :value="item.profit" />
                  €)
                </span>
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
      </v-col>
    </v-row>

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
import { mapGetters, mapState } from 'vuex'
import FormDialog from '@/components/dialog/FormDialog'
import ConfirmDialog from '@/components/dialog/ConfirmDialog'
import TweenNumber from '@/components/TweenNumber'

export default {
  data() {
    return {
      formOpen: false,
      confirmOpen: false,
      editMode: true,
      modalComponent: '',
      modalItem: '',
      selected: [],
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
          text: this.$vuetify.lang.t('$vuetify.table.headlines.profit'),
          value: 'profit',
          width: '150',
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
      if (totalInvested === 0 && profit === 0) {
        return 0.0
      }
      const calc = parseFloat((profit / totalInvested) * 100).toFixed(2)
      return calc
    },
    editGroup(item) {
      this.formOpen = true
      this.modalComponent = 'group'
      this.modalItem = item
    },
    addGroup() {
      this.formOpen = true
      this.modalComponent = 'group'
      this.editMode = false
    },
    deleteGroup(item) {
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
        this.$store.dispatch('deleteFinanceGroup', payload)
      }
      this.confirmOpen = false
    },
  },
  computed: {
    ...mapState(['financeItems']),
    ...mapGetters([
      'filteredGroups',
      'totalCapitalAsset',
      'totalProfit',
      'totalInvested',
    ]),
    calculateTotalProfit() {
      let invested = 0
      let profit = 0
      this.filteredGroups.forEach((item) => {
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
  components: {
    FormDialog,
    ConfirmDialog,
    TweenNumber,
  },
}
</script>
