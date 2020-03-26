<template>
  <v-form v-model="valid" @submit="onSubmit">
    <v-container>
      <v-text-field
        v-model="email"
        :rules="emailRules"
        label="E-mail"
        required
      ></v-text-field>

      <v-text-field
        type="password"
        v-model="password"
        :rules="passwordRules"
        :counter="30"
        label="Password"
        required
      ></v-text-field>

      <div class="text-center">
        <v-btn type="submit" class="ma-2" color="primary">
          Register
        </v-btn>
        <v-btn class="ma-2" color="error">
          Cancel
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
        (v) => !!v || 'Password is required',
        (v) => v.length >= 6 || 'Password must be greater than 6 characters',
        (v) => v.length <= 30 || 'Password must be less than 10 characters',
      ],
      email: '',
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+/.test(v) || 'E-mail must be valid',
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
