<template>
  <v-dialog v-model="isOpen" content-class="form-dialog">
    <v-btn class="form-dialog__close" icon @click="$emit('close')">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <h2>Add {{ formTitle }}</h2>
    <component v-bind:is="modalComponent" @close="$emit('close')"></component>
  </v-dialog>
</template>

<script>
import GroupForm from '@/components/GroupForm'
import ItemForm from '@/components/ItemForm'

export default {
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    modalComponent: {
      type: [Function, Object, String],
      default: '',
    },
  },
  watch: {
    dialog(newValue) {
      this.isOpen = newValue
    },
    isOpen(newValue) {
      if (!newValue) {
        this.$emit('close')
      }
    },
  },
  data() {
    return {
      isOpen: false,
    }
  },
  computed: {
    formTitle() {
      if (this.modalComponent === 'group') {
        return 'Group'
      }
      return 'Item'
    },
  },
  components: {
    group: GroupForm,
    item: ItemForm,
  },
}
</script>

<style lang="less">
// overwrite dialog
.v-dialog__content {
  .form-dialog {
    position: relative;
    width: 70%;
    background: white;
    z-index: 100;
    padding: 20px;

    &__close {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
</style>
