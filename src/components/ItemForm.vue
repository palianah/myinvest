<template>
  <v-form v-model="valid" @submit.prevent="saveItem" ref="form" lazy-validation>
    <v-select
      v-model="formData.exposition"
      :items="groupNames"
      :rules="emptyRule"
      label="Finance Group"
      required
    ></v-select>

    <v-text-field
      v-model="formData.title"
      label="Title"
      :rules="emptyRule"
      required
    ></v-text-field>

    <v-text-field
      v-model="formData.description"
      label="Description"
      :rules="emptyRule"
      required
    ></v-text-field>

    <template v-if="showStockFormData">
      <v-text-field v-model="formData.stockID" label="stockID"></v-text-field>
      <v-text-field v-model="formData.amount" label="Amount"></v-text-field>
      <v-text-field
        v-model="formData.averageStockPrice"
        label="Bought single stock price"
      ></v-text-field>
    </template>

    <v-text-field
      v-model="formData.totalInvested"
      label="Total Invested Value"
    ></v-text-field>

    <div class="text-center">
      <v-btn type="submit" min-width="150" large class="ma-2" color="primary">
        Save
      </v-btn>
      <v-btn
        class="ma-2"
        min-width="150"
        large
        color="error"
        @click="$emit('close')"
      >
        Cancel
      </v-btn>
    </div>
  </v-form>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    formProps: {
      type: [Object, String],
      default: '',
    },
  },
  data() {
    return {
      valid: true,
      showStockFormData: false,
      emptyRule: [(v) => !!v || 'This field is required'],
      formData: this.formProps
        ? { ...this.formProps }
        : {
            exposition: null,
            title: '',
            description: '',
            stockID: '',
            amount: '',
            averageStockPrice: '',
            totalInvested: '',
          },
    }
  },
  watch: {
    'formData.exposition'(val) {
      if (val.toLowerCase() === 'etf' || val.toLowerCase() === 'stock') {
        this.showStockFormData = true
      } else {
        this.showStockFormData = false
      }
    },
  },
  methods: {
    saveItem() {
      if (this.validate()) {
        // TODO: dispatch statt commit
        this.$store.commit('UPDATE_FINANCE_ITEM', {
          ...this.formData,
          key: new Date(),
          currentValue: this.formData.totalInvested,
        })
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
