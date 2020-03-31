<template>
  <div class="dashboard__table pt-10">
    <v-card>
      <v-card-title class="dashboard__table__title">
        <div>{{ title }}</div>
        <div>
          <v-icon
            :title="$vuetify.lang.t('$vuetify.sidebar.addItem')"
            @click="addItem"
            >mdi-pencil-plus</v-icon
          >
        </div>
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
import FormDialog from '@/components/dialog/FormDialog'
import ConfirmDialog from '@/components/dialog/ConfirmDialog'
import TweenNumber from '@/components/TweenNumber'
import TableItemMixin from '@/mixins/TableItem.mixin'

export default {
  mixins: [TableItemMixin],
  props: {
    title: [String],
  },
  computed: {
    ...mapState(['financeItems']),
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
  .c-red {
    color: red;
  }
  .c-green {
    color: green;
  }
  .c-orange {
    color: orange;
  }

  &__title {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  &__profit {
    background: transparent;
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
  }
}
</style>
