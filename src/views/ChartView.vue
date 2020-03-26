<template>
  <div class="dashboard px-5">
    <h1>Chart View here</h1>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['financeGroups']),
  },
  components: {},
}
</script>

<style lang="less" scoped></style>
