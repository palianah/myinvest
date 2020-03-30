<template>
  <div class="register">
    <h2 class="text-center">
      {{ $vuetify.lang.t('$vuetify.auth.register.headline') }}
    </h2>
    <AuthForm @submit="onSubmit" />
  </div>
</template>

<script>
import AuthForm from '@/components/forms/AuthForm'

export default {
  methods: {
    onSubmit({ valid, email, password }) {
      if (valid) {
        this.$store.dispatch('signup', { email, password })
      } else {
        console.error('has error!')
      }
    },
  },
  components: {
    AuthForm,
  },
}
</script>

<style lang="less" scoped>
.register {
  margin: 0 auto;
  max-width: 400px;
}
</style>
