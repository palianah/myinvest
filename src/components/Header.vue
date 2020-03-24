<template>
  <v-app-bar app color="white" clipped-left>
    <v-toolbar-title>My Investment</v-toolbar-title>

    <v-spacer></v-spacer>

    <template v-if="!idToken">
      <v-btn value="login" text @click="redirect('login')">
        <span>Login</span>
        <v-icon>mdi-login</v-icon>
      </v-btn>
      <v-btn value="register" text @click="redirect('register')">
        <span>Register</span>
        <v-icon>mdi-account-plus-outline</v-icon>
      </v-btn>
    </template>
    <template v-else>
      <v-btn value="logout" text @click="logout">
        <span>Logout</span>
        <v-icon>mdi-login</v-icon>
      </v-btn>
    </template>
  </v-app-bar>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['idToken']),
  },
  methods: {
    redirect(name) {
      if (name !== this.$route.name) {
        this.$router.push({ name })
      }
    },
    logout() {
      this.$store.dispatch('logout')
    },
  },
}
</script>

<style lang="scss" scoped></style>
