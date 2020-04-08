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
    <br />
    <p>
      {{ $vuetify.lang.t('$vuetify.forms.groupTypeTitle') }}
    </p>
    <v-radio-group v-model="formData.groupType">
      <v-radio
        v-for="group in groupTypes"
        :key="group.value"
        :label="group.label"
        :value="group.value"
      ></v-radio>
    </v-radio-group>

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
      groupTypes: [
        {
          value: 'trade',
          label: this.$vuetify.lang.t('$vuetify.forms.groupTypeTrade'),
        },
        {
          value: 'cash',
          label: this.$vuetify.lang.t('$vuetify.forms.groupTypeCash'),
        },
        {
          value: 'p2p',
          label: this.$vuetify.lang.t('$vuetify.forms.groupTypeP2P'),
        },
        {
          value: 'default',
          label: this.$vuetify.lang.t('$vuetify.forms.groupTypeDefault'),
        },
      ],
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
            groupType: 'trade',
          },
    }
  },
  methods: {
    saveGroup() {
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
