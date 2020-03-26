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

    <template v-if="showStockFormData">
      <v-text-field v-model="formData.stockID" label="stockID"></v-text-field>
      <v-text-field v-model="formData.amount" label="Amount"></v-text-field>
      <v-text-field
        type="number"
        v-model="formData.averageStockPrice"
        label="Bought single stock price"
      ></v-text-field>
    </template>

    <v-text-field
      type="number"
      v-model="formData.totalInvested"
      label="Total Invested Value"
    ></v-text-field>

    <template v-if="editMode">
      <v-text-field
        type="number"
        v-model="formData.currentValue"
        label="Current Value"
      ></v-text-field>
    </template>

    <div class="text-center">
      <v-btn type="submit" min-width="150" class="ma-2" color="primary">
        Save
      </v-btn>
      <v-btn class="ma-2" min-width="150" color="error" @click="$emit('close')">
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
      emptyRule: [(v) => !!v || 'This field is required'],
      formData: this.formProps
        ? { ...this.formProps }
        : {
            exposition: null,
            title: '',
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
        if (!this.editMode) {
          this.$store.commit('ADD_FINANCE_ITEM', {
            ...this.formData,
            key: new Date(), // TODO: firebase key
            profit: 0,
            currentValue: this.formData.totalInvested,
          })
        } else {
          this.$store.commit('UPDATE_FINANCE_ITEM', {
            ...this.formData,
            key: '', // TODO: get from saved key
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
