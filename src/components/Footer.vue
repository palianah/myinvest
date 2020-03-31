<template>
  <v-footer class="footer" padless>
    <LanguageSwitcher />
  </v-footer>
</template>

<script>
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default {
  components: {
    LanguageSwitcher,
  },
}
</script>

<style lang="less" scoped>
.footer {
  margin-left: 256px;
}
</style>
