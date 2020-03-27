<template>
  <v-dialog v-model="isOpen" content-class="form-dialog">
    <v-btn class="form-dialog__close" icon @click="$emit('close')">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <h2>{{ formTitle }}</h2>
    <component
      v-bind:is="modalComponent"
      @close="$emit('close')"
      :editMode="editMode"
      :formProps="modalItem"
    ></component>
  </v-dialog>
</template>

<script>
import GroupForm from '@/components/forms/GroupForm'
import ItemForm from '@/components/forms/ItemForm'
import ItemAddForm from '@/components/forms/ItemAddForm'
import ItemExtractForm from '@/components/forms/ItemExtractForm'

export default {
  props: {
    formOpen: {
      type: Boolean,
      default: false,
    },
    modalComponent: {
      type: [Function, Object, String],
      default: '',
    },
    editMode: {
      type: Boolean,
      default: false,
    },
    modalItem: [Object, Array, String],
  },
  data() {
    return {
      isOpen: false,
    }
  },
  watch: {
    formOpen(newValue) {
      this.isOpen = newValue
    },
    isOpen(newValue) {
      if (!newValue) {
        this.$emit('close')
      }
    },
  },
  computed: {
    formTitle() {
      if (this.editMode && this.modalComponent === 'item') {
        return 'Edit Item'
      } else if (this.editMode && this.modalComponent === 'group') {
        return 'Edit Group'
      } else if (this.editMode && this.modalComponent === 'item-add') {
        return `Buy more ${this.modalItem.exposition}s from ${this.modalItem.title}`
      } else if (this.editMode && this.modalComponent === 'item-extract') {
        return `Sell ${this.modalItem.exposition}s from ${this.modalItem.title}`
      }

      if (this.modalComponent === 'group') {
        return 'Add Group'
      } else if (this.modalComponent === 'item') {
        return 'Add Item'
      }

      return ''
    },
  },
  components: {
    group: GroupForm,
    item: ItemForm,
    'item-add': ItemAddForm,
    'item-extract': ItemExtractForm,
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
