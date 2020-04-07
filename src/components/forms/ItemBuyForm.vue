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
      :label="$vuetify.lang.t('$vuetify.forms.amount')"
      :rules="emptyRule"
      required
    ></v-text-field>
    <v-text-field
      class="item-add-form__input"
      type="number"
      v-model="formData.averageStockPrice"
      :label="$vuetify.lang.t('$vuetify.forms.boughtSingleStockPrice')"
      :rules="emptyRule"
      required
    ></v-text-field>

    <div class="text-center">
      <v-btn type="submit" min-width="150" class="ma-2" color="primary">
        {{ $vuetify.lang.t('$vuetify.forms.buyBtn') }}
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
      formData: {
        amount: '',
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
        
        this.$store.dispatch('updateFinanceItem', {
          ...this.formProps,
          ...newData,
        })
        this.$emit('close')
      }
    },
    calculateValues() {
      const formAmount = parseFloat(this.formData.amount)
      const formStockPrice = parseFloat(this.formData.averageStockPrice)
      const propsTotalInvested = parseFloat(this.formProps.totalInvested)
      const propsRealPrice = parseFloat(this.formProps.real_price)
      const propsAmount = parseFloat(this.formProps.amount)

      const amount = formAmount + propsAmount
      const totalInvested = propsTotalInvested + (formAmount * formStockPrice)
      const currentValue = amount * propsRealPrice
      const profit = currentValue - totalInvested
      const averageStockPrice = parseFloat(totalInvested / amount).toFixed(2)

      return {
        totalInvested,
        currentValue,
        profit,
        amount,
        averageStockPrice,
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
