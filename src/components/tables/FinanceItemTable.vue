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
@import '../../assets/less/structure.less';

.dashboard__table {
  // overwrite data-table
  .v-data-table__mobile-row {
    min-height: 33px;
    font-size: 13px;
  }
  .v-data-table-header-mobile {
    display: none;
  }

  .v-label {
    font-size: 12px;
  }

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
    font-size: 16px;

    @media @tablet {
      font-size: 20px;
    }
  }

  &__card {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__card-title {
    display: block;
    font-weight: normal;
  }

  &__card-price {
    font-size: 30px;
    line-height: 45px;
    border-bottom: 2px solid #1565c0;
    padding: 10px 0;
    margin-bottom: 10px;
  }

  &__card-text {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
      margin-top: 10px;
      padding-top: 10px;
      border-top: thin solid rgba(0, 0, 0, 0.3);
    }

    &__headline {
      font-size: 14px;
    }

    &__value {
      text-align: right;
      font-size: 14px;
    }
  }

  &__profit {
    background: transparent;

    &__text {
      display: block;
      padding-left: 5px;
      font-size: 12px;
    }
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
