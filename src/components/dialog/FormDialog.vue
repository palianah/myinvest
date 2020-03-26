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
      }

      if (this.modalComponent === 'group') {
        return 'Add Group'
      } else {
        return 'Add Item'
      }
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
