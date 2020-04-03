<template>
  <v-navigation-drawer
    class="sidebar"
    permanent
    :stateless="true"
    :mini-variant="expanded"
    color="primary"
    fixed
    dark
  >
    <h2 class="px-5 pt-5 sidebar__headline">
      {{ $vuetify.lang.t('$vuetify.sidebar.headline') }}
    </h2>

    <v-list-item class="sidebar__arrow">
      <v-list-item-icon>
        <span v-if="isMobile" @click="toggleNavBar">
          <v-icon v-if="expanded">mdi-arrow-expand-right</v-icon>
          <v-icon v-else>mdi-arrow-expand-left</v-icon>
        </span>
      </v-list-item-icon>
    </v-list-item>

    <v-list dense nav class="py-0 pt-10">
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

    <LanguageSwitcher id="v-step-5" @click.native="toggleNavBar" />

    <div class="sidebar__actions">
      <v-btn class="sidebar__logout" small text @click="logout">
        <v-icon>mdi-logout</v-icon>
        <span class="sidebar__logout__text">
          {{ $vuetify.lang.t('$vuetify.sidebar.logout') }}
        </span>
      </v-btn>

      <v-icon
        class="sidebar__helper"
        @click="startTour"
        :title="$vuetify.lang.t('$vuetify.tour.helper')"
      >
        mdi-help-circle
      </v-icon>
    </div>
  </v-navigation-drawer>
</template>

<script>
import FormDialog from '@/components/dialog/FormDialog'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default {
  data() {
    return {
      isMobile: false,
      expanded: false,
      formOpen: false,
      modalComponent: '',
      items: [
        {
          id: 'table',
          cssId: 'v-step-1',
          title: this.$vuetify.lang.t('$vuetify.sidebar.listView'),
          icon: 'mdi-format-list-bulleted',
        },
        {
          id: 'chart',
          cssId: 'v-step-2',
          title: this.$vuetify.lang.t('$vuetify.sidebar.chartView'),
          icon: 'mdi-finance',
        },
        // {
        //   id: 'examples',
        //   title: this.$vuetify.lang.t('$vuetify.sidebar.examples'),
        //   icon: 'mdi-tablet',
        // },
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
    startTour() {
      this.$store.commit('SHOW_TOUR', true)
    },
    toggleNavBar() {
      if (this.isMobile) {
        this.expanded = !this.expanded
      }
    },
  },
  created() {
    if (window.innerWidth <= 1023) {
      this.isMobile = true
      this.expanded = true
    }
  },
  components: {
    FormDialog,
    LanguageSwitcher,
  },
}
</script>

<style lang="less">
@import '../assets/less/structure.less';

.sidebar {
  &__headline {
    display: none;
    color: white;

    @media @tabletLandscape {
      display: block;
    }
  }

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

  &__arrow {
    display: block;

    @media @tabletLandscape {
      display: none;
    }
  }
}
</style>
