import { mapState } from 'vuex'

// mixin used for Login/Register Components
const auth = {
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
    validate() {
      return this.$refs.form.validate()
    },
  },
  computed: {
    ...mapState(['authError']),
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('AUTH_ERROR', '')
    next()
  },
}

export default auth
