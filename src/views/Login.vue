<template>
  <div class="login">
    <h2 class="text-center">Login to My Invest</h2>
    <AuthForm @submit="onSubmit" />
  </div>
</template>

<script>
import AuthForm from '@/components/AuthForm'

export default {
  methods: {
    onSubmit({ valid, email, password }) {
      if (valid) {
        this.$store.dispatch('login', { email, password })
      } else {
        console.log('has error!')
      }
    }
  },
  components: {
    AuthForm
  }
}
</script>

<style lang="less" scoped>
.login {
  margin: 0 auto;
  max-width: 400px;
}
</style>
