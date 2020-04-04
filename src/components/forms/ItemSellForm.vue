<template>
  <v-form
    class="item-extract-form pt-5"
    v-model="valid"
    @submit.prevent="saveItem"
    ref="form"
    lazy-validation
  >
    <v-text-field
      class="item-extract-form__input"
      type="number"
      v-model="formData.amount"
      :label="$vuetify.lang.t('$vuetify.forms.amount')"
      :rules="amountRules"
      :max="formProps.amount"
      required
    ></v-text-field>
    <v-text-field
      class="item-extract-form__input"
      type="number"
      v-model="formData.averageStockPrice"
      :label="$vuetify.lang.t('$vuetify.forms.currentSingleStockPrice')"
      :rules="emptyRule"
      required
    ></v-text-field>

    <div class="text-center">
      <v-btn type="submit" min-width="150" class="ma-2" color="primary">
        {{ $vuetify.lang.t('$vuetify.forms.sellBtn') }}
      </v-btn>
      <v-btn class="ma-2" min-width="150" color="error" @click="$emit('close')">
        {{ $vuetify.lang.t('$vuetify.forms.cancelBtn') }}
      </v-btn>
    </div>
  </v-form>
</template>

<script>
export default {
  props: {
    formProps: {
      type: [Array, Object, String],
      required: true,
    },
  },
  data() {
    return {
      valid: true,
      emptyRule: [
        (v) => !!v || this.$vuetify.lang.t('$vuetify.forms.fieldRequired'),
      ],
      amountRules: [
        (v) => !!v || this.$vuetify.lang.t('$vuetify.forms.fieldRequired'),
        (v) =>
          v <= parseFloat(this.formProps.amount) ||
          this.$vuetify.lang.t('$vuetify.forms.amountBigger'),
      ],
      formData: {
        amount: this.formProps.amount ? this.formProps.amount : '',
        averageStockPrice: this.formProps.real_price
          ? this.formProps.real_price
          : '',
      },
    }
  },
  methods: {
    saveItem() {
      if (this.validate()) {
        const newData = this.calculateValues()

        // TODO: dispatch statt commit
        this.$store.dispatch('updateFinanceItem', {
          ...this.formProps,
          ...newData,
        })
        this.$emit('close')
      }
    },
    calculateValues() {
      const formAmount = parseFloat(this.formData.amount)
      const propsStockPrice = parseFloat(this.formProps.averageStockPrice)
      const propsAmount = parseFloat(this.formProps.amount)

      const amount = propsAmount - formAmount
      const totalInvested = amount * propsStockPrice
      const currentValue = this.calculateCurrentValue(
        formAmount,
        propsStockPrice
      )
      const profit = currentValue - totalInvested

      return {
        totalInvested,
        currentValue,
        profit,
        amount,
      }
    },
    calculateCurrentValue(formAmount, propsStockPrice) {
      const formStockPrice = parseFloat(this.formData.averageStockPrice)
      const propsCurrent = parseFloat(this.formProps.currentValue)

      const formTotal = formAmount * formStockPrice
      const propsTotal = formAmount * propsStockPrice
      const profit = formTotal - propsTotal
      const propsMargin = propsCurrent - propsTotal

      const currentValue = propsMargin + profit
      return currentValue
    },
    validate() {
      return this.$refs.form.validate()
    },
  },
}
</script>

<style lang="less" scoped>
.item-extract-form {
  &__input {
    max-width: 300px;
    margin: 0 auto;
  }
}
</style>
