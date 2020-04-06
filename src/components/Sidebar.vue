<template>
  <div>
    <v-app-bar
      :clipped-left="$vuetify.breakpoint.mdAndUp"
      app
      color="blue darken-3"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title style="width: 300px;" class="ml-0 pl-4">
        {{ $vuetify.lang.t('$vuetify.sidebar.headline') }}
      </v-toolbar-title>
      <v-spacer />
      <v-btn icon @click.stop="reloadApp">
        <v-icon>mdi-reload</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      app
      class="sidebar"
      color="white"
      :clipped="$vuetify.breakpoint.mdAndUp"
      v-model="drawer"
    >
      <v-list dense nav class="mt-5">
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          @click.stop="redirectOrOpenModal(item.id)"
          :id="item.cssId"
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

      <LanguageSwitcher id="v-step-5" />

      <div class="sidebar__actions">
        <v-btn class="sidebar__logout" small text @click.stop="logout">
          <v-icon>mdi-logout</v-icon>
          <span class="sidebar__logout__text">
            {{ $vuetify.lang.t('$vuetify.sidebar.logout') }}
          </span>
        </v-btn>
        <v-icon
          class="sidebar__helper"
          @click.stop="startTour"
          :title="$vuetify.lang.t('$vuetify.tour.helper')"
        >
          mdi-help-circle
        </v-icon>
      </div>
    </v-navigation-drawer>

    <TourApp />
  </div>
</template>

<script>
import FormDialog from '@/components/dialog/FormDialog'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import TourApp from '@/components/TourApp'

export default {
  data() {
    return {
      drawer: null,
      formOpen: false,
      modalComponent: '',
      items: [
        {
          id: 'table',
          cssId: 'v-step-1',
          title: this.$vuetify.lang.t('$vuetify.sidebar.listView'),
          icon: 'mdi-desktop-mac-dashboard',
        },
        {
          id: 'chart',
          cssId: 'v-step-2',
          title: this.$vuetify.lang.t('$vuetify.sidebar.chartView'),
          icon: 'mdi-finance',
        },
        {
          id: 'group',
          cssId: 'v-step-3',
          title: this.$vuetify.lang.t('$vuetify.sidebar.addGroup'),
          icon: 'mdi-pencil-plus',
        },
        {
          id: 'item',
          cssId: 'v-step-4',
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
    reloadApp() {
      location.reload()
    },
    startTour() {
      this.$store.commit('SHOW_TOUR', true)
    },
    checkIdTokenValid() {
      const refreshToken = localStorage.getItem('refreshToken')
      const expirationDate = Date.parse(localStorage.getItem('expirationDate'))
      if (
        !refreshToken ||
        !expirationDate ||
        new Date().getTime() >= expirationDate
      ) {
        this.$store.dispatch('refreshIdToken', refreshToken)
      }
    },
    redirectOrOpenModal(id) {
      this.checkIdTokenValid()

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
    TourApp,
  },
}
</script>

<style lang="less">
@import '../assets/less/structure.less';

.sidebar {
  &__actions {
    position: absolute;
    bottom: 20px;
    left: 0;
    width: 100%;
    padding: 0 25px 0 0;
    display: flex;
    justify-content: space-between;
  }

  &__logout__text {
    display: inline-block;
    padding-left: 20px;
  }
}
</style>
