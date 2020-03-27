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
      label="Amount"
      :rules="amountRules"
      :max="formProps.amount"
      required
    ></v-text-field>
    <v-text-field
      class="item-extract-form__input"
      type="number"
      v-model="formData.averageStockPrice"
      label="Current single stock price"
      :rules="emptyRule"
      required
    ></v-text-field>

    <div class="text-center">
      <v-btn type="submit" min-width="150" class="ma-2" color="primary">
        Sell
      </v-btn>
      <v-btn class="ma-2" min-width="150" color="error" @click="$emit('close')">
        Cancel
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
    editMode: Boolean,
  },
  data() {
    return {
      valid: true,
      emptyRule: [(v) => !!v || 'This field is required'],
      amountRules: [
        (v) => !!v || 'This field is required',
        (v) => v <= parseFloat(this.formProps.amount) || 'Amount is bigger than you own.',
      ],
      formData: {
        amount: this.formProps.amount ? this.formProps.amount : '',
        averageStockPrice: '',
      },
    }
  },
  methods: {
    saveItem() {
      if (this.validate()) {
        const newData = this.calculateValues()

        // TODO: dispatch statt commit
        this.$store.commit('UPDATE_FINANCE_ITEM', {
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
      const currentValue = this.calculateCurrentValue(formAmount, propsStockPrice)
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
