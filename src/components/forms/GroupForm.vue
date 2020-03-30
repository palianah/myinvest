<template>
  <v-form
    v-model="valid"
    @submit.prevent="saveGroup"
    ref="form"
    lazy-validation
  >
    <v-text-field
      v-model="formData.title"
      :label="$vuetify.lang.t('$vuetify.forms.title')"
      :rules="titleRules"
      required
    ></v-text-field>

    <v-text-field
      v-model="formData.description"
      :label="$vuetify.lang.t('$vuetify.forms.description')"
      :rules="descriptionRules"
      required
    ></v-text-field>

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
      titleRules: [
        (v) => !!v || this.$vuetify.lang.t('$vuetify.forms.titleRequired'),
      ],
      descriptionRules: [
        (v) =>
          !!v || this.$vuetify.lang.t('$vuetify.forms.descriptionRequired'),
      ],
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
      // TODO: check if groupData.title exists already, not valid!
      if (this.validate()) {
        if (!this.editMode) {
          this.$store.dispatch('addFinanceGroup', this.formData)
        } else {
          this.$store.dispatch('updateFinanceGroup', this.formData)
        }
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
