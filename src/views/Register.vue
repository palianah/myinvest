<template>
  <div class="register">
    <h2 class="text-center">Register to My Invest</h2>
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
.register {
  margin: 0 auto;
  max-width: 400px;
}
</style>
