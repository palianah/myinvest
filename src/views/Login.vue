<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card class="elevation-12">
          <v-form
            v-model="valid"
            @submit.prevent="onSubmit"
            ref="form"
            lazy-validation
          >
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>
                {{ $vuetify.lang.t('$vuetify.auth.login.headline') }}
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <template v-if="authError">
                <v-sheet color="text-center red lighten-2 pa-1 mb-5">
                  {{ $vuetify.lang.t('$vuetify.auth.loginError') }}
                </v-sheet>
              </template>
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
            </v-card-text>
            <v-card-actions>
              <router-link class="pl-2" :to="{ name: 'register' }">
                {{ $vuetify.lang.t('$vuetify.auth.noAccount') }}
              </router-link>
              <v-spacer></v-spacer>
              <v-btn type="submit" class="ma-2 px-5" color="primary">
                {{ $vuetify.lang.t('$vuetify.auth.loginBtn') }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import AuthMixin from '@/mixins/Auth.mixin'

export default {
  mixins: [AuthMixin],
  methods: {
    onSubmit() {
      if (this.validate()) {
        this.$store.dispatch('login', {
          email: this.email,
          password: this.password,
        })
      }
    },
  },
}
</script>
