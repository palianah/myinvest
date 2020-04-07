<template>
  <v-dialog v-model="isOpen" content-class="form-dialog">
    <v-btn class="form-dialog__close" icon @click="$emit('close')">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <h2>{{ formTitle }}</h2>
    <component
      v-bind:is="modalComponent"
      @close="$emit('close')"
      @real-price-added="realPriceAdded"
      :editMode="editMode"
      :formProps="modalItem"
    ></component>
  </v-dialog>
</template>

<script>
import GroupForm from '@/components/forms/GroupForm'
import ItemForm from '@/components/forms/ItemForm'
import ItemBuyForm from '@/components/forms/ItemBuyForm'
import ItemSellForm from '@/components/forms/ItemSellForm'

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
  methods: {
    realPriceAdded(data) {
      this.$emit('real-price-added', data)
    },
  },
  computed: {
    formTitle() {
      if (this.editMode && this.modalComponent === 'item') {
        return this.$vuetify.lang.t('$vuetify.forms.editItemTitle')
      } else if (this.editMode && this.modalComponent === 'group') {
        return this.$vuetify.lang.t('$vuetify.forms.editGroupTitle')
      } else if (this.editMode && this.modalComponent === 'item-add') {
        return `Buy more ${this.modalItem.exposition}s from ${this.modalItem.title}`
      } else if (this.editMode && this.modalComponent === 'item-extract') {
        return `Sell ${this.modalItem.exposition}s from ${this.modalItem.title}`
      }

      if (this.modalComponent === 'group') {
        return this.$vuetify.lang.t('$vuetify.forms.addGroupTitle')
      } else if (this.modalComponent === 'item') {
        return this.$vuetify.lang.t('$vuetify.forms.addItemTitle')
      }

      return ''
    },
  },
  components: {
    group: GroupForm,
    item: ItemForm,
    'item-add': ItemBuyForm,
    'item-extract': ItemSellForm,
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
