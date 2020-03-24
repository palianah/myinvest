<template>
  <v-form
    v-model="valid"
    @submit.prevent="saveGroup"
    ref="form"
    lazy-validation
  >
    <v-text-field
      v-model="formData.title"
      label="Title"
      :rules="titleRules"
      required
    ></v-text-field>

    <v-text-field
      v-model="formData.description"
      label="Description"
      :rules="descriptionRules"
      required
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
      titleRules: [(v) => !!v || 'Title is required'],
      descriptionRules: [(v) => !!v || 'Description is required'],
      formData: this.formProps
        ? { ...this.formProps }
        : {
            title: '',
            description: '',
          },
    }
  },
  methods: {
    saveGroup() {
      if (this.validate()) {
        // TODO: dispatch statt commit
        this.$store.commit('UPDATE_FINANCE_GROUP', {
          ...this.formData,
          key: new Date(),
        })
        this.$emit('close')
      }
    },
    validate() {
      return this.$refs.form.validate()
    },
  },
}
</script>

<style lang="less" scoped></style>
