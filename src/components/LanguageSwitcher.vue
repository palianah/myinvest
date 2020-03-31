<template>
  <div class="language-switcher">
    <v-select
      v-model="language"
      :items="langs"
      :label="$vuetify.lang.t('$vuetify.langSwitcher.lang')"
      hide-details
      prepend-icon="mdi-web"
      single-line
      @change="changeLanguage"
    ></v-select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      language: '',
      langs: [],
    }
  },
  watch: {
    '$route.params.lang'() {
      this.langs = this.langs.map((lang) => {
        lang.text = this.$vuetify.lang.t(`$vuetify.langSwitcher.${lang.value}`)
        return lang
      })
    },
  },
  methods: {
    createLanguageDropdown() {
      let languages = []
      Object.keys(this.$vuetify.lang.locales).forEach((lang, index) => {
        languages[index] = {
          text: this.$vuetify.lang.t(`$vuetify.langSwitcher.${lang}`),
          value: lang,
        }
      })
      return languages
    },
    changeLanguage(lang) {
      this.$vuetify.lang.current = lang.toLowerCase()
      this.$router.push({
        name: this.$route.name,
        params: {
          lang: lang.toLowerCase(),
        },
      })
    },
  },
  created() {
    this.language = this.$route.params.lang
    this.langs = this.createLanguageDropdown()
  },
}
</script>

<style lang="less" scoped>
.language-switcher {
  padding: 20px 15px;
  margin: 0;
  max-width: 200px;

  &__ul {
    list-style: none;
    margin: 0;
  }

  &__item {
    display: inline-block;
    padding-right: 20px;

    &:last-child {
      padding-right: 0;
    }
  }
}
</style>
