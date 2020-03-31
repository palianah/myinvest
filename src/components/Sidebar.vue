<template>
  <v-navigation-drawer class="sidebar" permanent color="primary" fixed dark>
    <h2 class="px-5 pt-5 sidebar__headline">
      {{ $vuetify.lang.t('$vuetify.sidebar.headline') }}
    </h2>

    <v-list dense nav class="py-0 pt-10">
      <v-list-item
        v-for="item in items"
        :key="item.title"
        link
        @click.stop="redirectOrOpenModal(item.id)"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <FormDialog
      :formOpen="formOpen"
      :modalComponent="modalComponent"
      @close="closeModal"
    />

    <LanguageSwitcher />

    <v-btn class="sidebar__logout" small text @click="logout">
      <v-icon>mdi-logout</v-icon>
      <span>{{ $vuetify.lang.t('$vuetify.sidebar.logout') }}</span>
    </v-btn>
  </v-navigation-drawer>
</template>

<script>
import FormDialog from '@/components/dialog/FormDialog'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default {
  data() {
    return {
      formOpen: false,
      modalComponent: '',
      items: [
        {
          id: 'table',
          title: this.$vuetify.lang.t('$vuetify.sidebar.listView'),
          icon: 'mdi-format-list-bulleted',
        },
        {
          id: 'chart',
          title: this.$vuetify.lang.t('$vuetify.sidebar.chartView'),
          icon: 'mdi-finance',
        },
        {
          id: 'examples',
          title: this.$vuetify.lang.t('$vuetify.sidebar.examples'),
          icon: 'mdi-tablet',
        },
        {
          id: 'group',
          title: this.$vuetify.lang.t('$vuetify.sidebar.addGroup'),
          icon: 'mdi-pencil-plus',
        },
        {
          id: 'item',
          title: this.$vuetify.lang.t('$vuetify.sidebar.addItem'),
          icon: 'mdi-pencil-plus',
        },
      ],
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
    },
    redirectOrOpenModal(id) {
      switch (id) {
        case 'group':
          this.formOpen = true
          this.modalComponent = 'group'
          break
        case 'item':
          this.formOpen = true
          this.modalComponent = 'item'
          break
        case 'examples':
          if (this.$route.name !== 'examples') {
            this.$router.push({ name: 'examples' })
          }
          break
        case 'table':
          if (this.$route.name !== 'dashboard') {
            this.$router.push({ name: 'dashboard' })
          }
          break
        case 'chart':
          if (this.$route.name !== 'chart-view') {
            this.$router.push({ name: 'chart-view' })
          }
          break
        default:
          if (this.$route.name !== 'dashboard') {
            this.$router.push({ name: 'dashboard' })
          }
          break
      }
    },
    closeModal() {
      this.formOpen = false
      this.modalComponent = ''
    },
  },
  components: {
    FormDialog,
    LanguageSwitcher,
  },
}
</script>

<style lang="less" scoped>
.sidebar {
  &__headline {
    color: white;
  }

  &__logout {
    position: absolute;
    bottom: 20px;
    left: 15px;
  }
}
</style>
