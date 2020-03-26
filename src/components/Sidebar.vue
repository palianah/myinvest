<template>
  <v-navigation-drawer class="sidebar" permanent color="primary" fixed dark>
    <h2 class="px-5 pt-5 sidebar__headline">My Investment</h2>

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

    <v-btn class="sidebar__logout" small text @click="logout">
      <span>Logout</span>
      <v-icon>mdi-login</v-icon>
    </v-btn>
  </v-navigation-drawer>
</template>

<script>
import FormDialog from '@/components/dialog/FormDialog'

export default {
  data() {
    return {
      formOpen: false,
      modalComponent: '',
      items: [
        {
          id: 'table',
          title: 'List-View',
          icon: 'mdi-format-list-bulleted',
        },
        { id: 'chart', title: 'Chart-View', icon: 'mdi-finance' },
        { id: 'examples', title: 'Examples', icon: 'mdi-tablet' },
        { id: 'group', title: 'Add Finance Group', icon: 'mdi-pencil-plus' },
        { id: 'item', title: 'Add Finance Item ', icon: 'mdi-pencil-plus' },
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
