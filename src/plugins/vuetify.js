import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import en from '@/assets/i18n/en.js'
import de from '@/assets/i18n/de.js'
import kor from '@/assets/i18n/kor.js'

Vue.use(Vuetify)

const opts = {
  lang: {
    locales: { en, de, kor },
    current: 'en',
  },
}

export default new Vuetify(opts)
