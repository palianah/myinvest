<template>
  <div class="landing">
    <router-link :to="{ name: 'login' }">Login</router-link>
    <br />
    <router-link :to="{ name: 'register' }">Register</router-link>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Landing',
  components: {},
}
</script>
