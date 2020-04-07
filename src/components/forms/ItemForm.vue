<template>
  <v-form v-model="valid" @submit.prevent="saveItem" ref="form" lazy-validation>
    <v-select
      v-model="formData.exposition"
      :items="groupNames"
      :rules="emptyRule"
      :label="$vuetify.lang.t('$vuetify.forms.financeGroup')"
      required
    ></v-select>

    <v-text-field
      v-model="formData.title"
      :label="$vuetify.lang.t('$vuetify.forms.title')"
      :rules="emptyRule"
      required
    ></v-text-field>

    <template v-if="showStockFormData">
      <v-select
        v-model="formData.market"
        :items="markets"
        :rules="emptyRule"
        :label="$vuetify.lang.t('$vuetify.forms.tradingMarket')"
        required
      ></v-select>
      <v-text-field
        v-model="formData.stockID"
        :label="$vuetify.lang.t('$vuetify.forms.quotes')"
        @change="onQuotesChange"
      ></v-text-field>
      <v-text-field
        type="number"
        v-model.lazy="formData.amount"
        @change="calulateTotalInvestedValue"
        :label="$vuetify.lang.t('$vuetify.forms.amount')"
      ></v-text-field>
      <v-text-field
        type="number"
        v-model="formData.averageStockPrice"
        :label="$vuetify.lang.t('$vuetify.forms.averageStockPrice')"
        @change="calulateTotalInvestedValue"
        ref="averageStockPrice"
      ></v-text-field>
    </template>

    <v-text-field
      type="number"
      v-model="formData.totalInvested"
      ref="totalInvested"
      :label="$vuetify.lang.t('$vuetify.forms.totalInvestedValue')"
    ></v-text-field>

    <template v-if="editMode">
      <v-text-field
        type="number"
        v-model="formData.currentValue"
        :label="$vuetify.lang.t('$vuetify.forms.currentValue')"
      ></v-text-field>
    </template>

    <div class="text-center">
      <v-btn type="submit" min-width="150" class="ma-2" color="primary">
        {{ $vuetify.lang.t('$vuetify.forms.saveBtn') }}
      </v-btn>
      <v-btn class="ma-2" min-width="150" color="error" @click="$emit('close')">
        {{ $vuetify.lang.t('$vuetify.forms.cancelBtn') }}
      </v-btn>
    </div>
  </v-form>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import FinanceService from '@/services/finance.service'

export default {
  props: {
    formProps: {
      type: [Array, Object, String],
      default: '',
    },
    editMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      valid: true,
      showStockFormData: false,
      real_stock_price: null,
      markets: ['US', 'DE'],
      emptyRule: [
        (v) => !!v || this.$vuetify.lang.t('$vuetify.forms.fieldRequired'),
      ],
      formData: this.formProps
        ? { ...this.formProps }
        : {
            exposition: null,
            title: '',
            stockID: '',
            amount: '',
            market: '',
            averageStockPrice: '',
            totalInvested: '',
          },
    }
  },
  watch: {
    'formData.exposition': {
      immediate: true,
      handler(val) {
        if (!val) return
        if (
          val.toLowerCase().includes('etf') ||
          val.toLowerCase().includes('stock') ||
          val.toLowerCase().includes('crypto') ||
          val.toLowerCase().includes('krypto')
        ) {
          this.showStockFormData = true
        } else {
          this.showStockFormData = false
        }
      },
    },
  },
  methods: {
    saveItem() {
      if (this.validate()) {
        if (!this.editMode) {
          let profit = 0
          let currentValue = this.formData.totalInvested
          if (this.showStockFormData) {
            currentValue = this.real_stock_price * this.formData.amount
            profit = currentValue - this.formData.totalInvested
          }
          this.$store.dispatch('addFinanceItem', {
            ...this.formData,
            profit,
            currentValue,
          })
        } else {
          this.$store.dispatch('updateFinanceItem', {
            ...this.formData,
            profit:
              parseFloat(this.formData.currentValue) -
              parseFloat(this.formData.totalInvested),
          })
        }
        this.$emit('close')
      }
    },
    onQuotesChange(val) {
      this.formData.averageStockPrice = 20
      FinanceService.quote(val)
        .then((res) => {
          const { data } = res
          let price = 0
          const dif = parseFloat(this.forex.value)
          let real_price = 0
          price = parseFloat(data.close)
          real_price = price.toFixed(2)
          if (this.formData.market === 'US') {
            real_price = parseFloat(price / dif).toFixed(2)
          }
          this.formData.averageStockPrice = real_price
          this.real_stock_price = real_price
          this.$refs.averageStockPrice.value = real_price // vuetify text-field bug, vue-warning!
          // emit result directly to table
          this.$emit('real-price-added', {
            ...data,
            real_price,
          })
        })
        .catch((e) => console.error('onQuotesChange error: ', e))
    },
    calulateTotalInvestedValue() {
      if (this.formData.amount && this.formData.averageStockPrice) {
        const calc =
          parseFloat(this.formData.amount) *
          parseFloat(this.formData.averageStockPrice)
        this.formData.totalInvested = parseFloat(calc.toFixed(2))
        this.$refs.totalInvested.value = parseFloat(calc.toFixed(2)) // vuetify text-field bug, vue-warning!
      }
    },
    validate() {
      return this.$refs.form.validate()
    },
  },
  computed: {
    ...mapState(['forex']),
    ...mapGetters(['groupNames']),
  },
}
</script>

<style lang="less" scoped></style>
