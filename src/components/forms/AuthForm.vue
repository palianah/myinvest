<template>
  <v-form v-model="valid" @submit="onSubmit">
    <v-container>
      <v-text-field
        v-model="email"
        :rules="emailRules"
        :label="$vuetify.lang.t('$vuetify.auth.email')"
        required
      ></v-text-field>

      <v-text-field
        type="password"
        v-model="password"
        :rules="passwordRules"
        :counter="30"
        :label="$vuetify.lang.t('$vuetify.auth.password')"
        required
      ></v-text-field>

      <div class="text-center">
        <v-btn type="submit" class="ma-2" color="primary">
          {{ $vuetify.lang.t('$vuetify.auth.registerBtn') }}
        </v-btn>
        <v-btn class="ma-2" color="error">
          {{ $vuetify.lang.t('$vuetify.auth.cancelBtn') }}
        </v-btn>
      </div>
    </v-container>
  </v-form>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      password: '',
      passwordRules: [
        (v) => !!v || this.$vuetify.lang.t('$vuetify.auth.passwordRequired'),
        (v) =>
          v.length >= 6 ||
          this.$vuetify.lang.t('$vuetify.auth.passwordLength1'),
        (v) =>
          v.length <= 30 ||
          this.$vuetify.lang.t('$vuetify.auth.passwordLength2'),
      ],
      email: '',
      emailRules: [
        (v) => !!v || this.$vuetify.lang.t('$vuetify.auth.emailRequired'),
        (v) =>
          /.+@.+/.test(v) || this.$vuetify.lang.t('$vuetify.auth.emailValid'),
      ],
    }
  },
  methods: {
    onSubmit(e) {
      e.preventDefault()

      this.$emit('submit', {
        valid: this.valid,
        password: this.password,
        email: this.email,
      })
    },
  },
}
</script>

<style lang="less" scoped></style>
