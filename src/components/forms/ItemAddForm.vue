<template>
  <v-form
    class="item-add-form pt-5"
    v-model="valid"
    @submit.prevent="saveItem"
    ref="form"
    lazy-validation
  >
    <v-text-field
      class="item-add-form__input"
      type="number"
      v-model="formData.amount"
      label="Amount"
      :rules="emptyRule"
      required
    ></v-text-field>
    <v-text-field
      class="item-add-form__input"
      type="number"
      v-model="formData.averageStockPrice"
      label="Bought single stock price"
      :rules="emptyRule"
      required
    ></v-text-field>

    <div class="text-center">
      <v-btn type="submit" min-width="150" class="ma-2" color="primary">
        Buy
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
      formData: {
        amount: '',
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
    // totalInvested = (amount * averageStockprice) + formProps.totalInvested
    // currentValue = (amount * averageStockprice) + formProps.currentValue
    // profit = currentValue - totalInvested
    // amount = amount + formProps.amount
    // averageStockprice = totalInvested / amount
    calculateValues() {
      const formAmount = parseFloat(this.formData.amount)
      const formStockPrice = parseFloat(this.formData.averageStockPrice)
      const propsTotalInvested = parseFloat(this.formProps.totalInvested)
      const propsCurrent = parseFloat(this.formProps.currentValue)
      const propsAmount = parseFloat(this.formProps.amount)

      const totalInvested = (formAmount * formStockPrice) + propsTotalInvested
      const currentValue = (formAmount * formStockPrice) + propsCurrent
      const profit = currentValue - totalInvested
      const amount = formAmount + propsAmount
      const averageStockPrice = parseFloat(totalInvested / amount).toFixed(2)

      return {
        totalInvested,
        currentValue,
        profit,
        amount,
        averageStockPrice
      }
    },
    validate() {
      return this.$refs.form.validate()
    },
  },
}
</script>

<style lang="less" scoped>
.item-add-form {
  &__input {
    max-width: 300px;
    margin: 0 auto;
  }
}
</style>
