<template>
  <v-dialog v-model="isOpen" content-class="confirm-dialog">
    <v-btn
      class="confirm-dialog__close"
      icon
      @click="$emit('dialog-event', 'cancel')"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <h3 class="text-center pb-5">
      {{ $vuetify.lang.t('$vuetify.forms.deleteMessage') }} {{ item.title }}?
    </h3>
    <div class="text-center">
      <v-btn
        @click="$emit('dialog-event', { mode: 'confirm', key: item.key })"
        min-width="100"
        small
        class="ma-2"
        color="primary"
      >
        {{ $vuetify.lang.t('$vuetify.forms.confirmBtn') }}
      </v-btn>
      <v-btn
        class="ma-2"
        min-width="100"
        small
        color="error"
        @click="$emit('dialog-event', { mode: 'cancel', key: item.key })"
      >
        {{ $vuetify.lang.t('$vuetify.forms.cancelBtn') }}
      </v-btn>
    </div>
  </v-dialog>
</template>

<script>
export default {
  props: {
    item: {
      type: [Object, String],
      default: '',
    },
    confirmOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isOpen: false,
    }
  },
  watch: {
    confirmOpen(newValue) {
      this.isOpen = newValue
    },
    isOpen(newValue) {
      if (!newValue) {
        this.$emit('dialog-event', { mode: 'cancel', key: this.item.key })
      }
    },
  },
}
</script>

<style lang="less">
// overwrite dialog
.v-dialog__content {
  .confirm-dialog {
    position: relative;
    width: 50%;
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
