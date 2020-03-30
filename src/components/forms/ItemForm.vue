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
      ></v-text-field>
      <v-text-field
        type="number"
        v-model="formData.amount"
        :label="$vuetify.lang.t('$vuetify.forms.amount')"
      ></v-text-field>
      <v-text-field
        type="number"
        v-model="formData.averageStockPrice"
        :label="$vuetify.lang.t('$vuetify.forms.averageStockPrice')"
      ></v-text-field>
    </template>

    <v-text-field
      type="number"
      v-model="formData.totalInvested"
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
import { mapGetters } from 'vuex'
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
      markets: ['US', 'DE', 'KOR'],
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
        if (val.toLowerCase() === 'etf' || val.toLowerCase() === 'stock') {
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
          this.$store.dispatch('addFinanceItem', {
            ...this.formData,
            profit: 0,
            currentValue: this.formData.totalInvested,
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
    validate() {
      return this.$refs.form.validate()
    },
  },
  computed: {
    ...mapGetters(['groupNames']),
  },
}
</script>

<style lang="less" scoped></style>
