<template>
  <div class="custom-linebar">
    <div v-if="!isLoading">
      <div v-if="sortedItemsByPrice.length">
        <ul class="custom-linebar__list">
          <li
            class="custom-linebar__list__item"
            v-for="(item, index) in sortedItemsByPrice"
            :key="item.key"
            :style="{
              width: itemPercent(item.currentValue),
              backgroundColor: itemBg(index),
            }"
            :title="item.title"
          ></li>
        </ul>
        <div class="custom-linebar__details">
          <div
            class="custom-linebar__details__item"
            v-for="(item, index) in sortedItemsByPrice"
            :key="item.key"
          >
            <span
              class="custom-linebar__details__bg"
              :style="{ backgroundColor: itemBg(index) }"
            ></span>
            <span class="custom-linebar__details__text">
              {{ item.title }} ({{ item.exposition.title }})
              <slot name="currentValue" v-bind:item="item"></slot>
            </span>
            <span class="custom-linebar__details__text align-right">
              {{ itemPercent(item.currentValue) }}</span
            >
          </div>
        </div>
        <div class="custom-linebar__footer">
          {{ $vuetify.lang.t('$vuetify.table.footer.total') }}:
          <b><TweenNumber :value="totalCapitalAsset" /> €</b>
        </div>
      </div>
      <div v-else>
        <i>{{ $vuetify.lang.t('$vuetify.chart.noItems') }}</i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import TweenNumber from '@/components/TweenNumber.vue'

export default {
  data() {
    return {
      isLoading: true,
      bgList: [
        '#11cdef',
        '#2dce89',
        '#355C7D',
        '#f5365c',
        '#fb6340',
        '#6C5B7B',
        '#F8B195',
        '#99B898',
        '#F67280',
        '#A8E6CE',
        '#E8175D',
        '#A7226E',
        '#F7DB4F',
        '#E1F5C4',
        '#594F4F',
        '#45ADA8',
        '#E5FCC2',
        '#FE4365',
        '#FC9D9A',
        '#F9CDAD',
        '#C8C8A9',
        '#83AF9B',
      ],
    }
  },
  watch: {
    showTour() {
      this.isLoading = false
    },
  },
  methods: {
    itemPercent(currentValue) {
      const item = parseFloat(currentValue)
      const total = parseFloat(this.totalCapitalAsset)
      const width = parseFloat((item / total) * 100).toFixed(2)
      return `${width}%`
    },
    itemBg(index) {
      return this.bgList[index]
    },
  },
  computed: {
    ...mapState(['showTour']),
    ...mapGetters(['totalCapitalAsset', 'sortedItemsByPrice']),
  },
  mounted() {
    if (this.showTour !== null) {
      this.isLoading = false
    }
  },
  components: {
    TweenNumber,
  },
}
</script>

<style lang="less" scoped>
.custom-linebar {
  width: 100%;

  &__list {
    list-style: none;
    padding: 0;
    width: 100%;
    height: 30px;

    &__item {
      width: 10%;
      display: inline-block;
      height: 100%;
      // default
      background-color: olive;
      transition: width 0.5s ease-in;

      &:first-child {
        border-radius: 5px 0px 0px 5px;
      }

      &:last-child {
        border-radius: 0px 5px 5px 0px;
      }
    }
  }

  &__details {
    margin-top: 40px;

    &__item {
      padding: 0 0 10px 0;
      margin-bottom: 12px;
      border-bottom: thin solid rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
    }

    &__bg {
      display: inline-block;
      width: 20px;
      height: 20px;
      border-radius: 5px;
      margin-right: 15px;
    }

    &__text {
      display: block;
      font-size: 14px;
      padding-left: 5px;

      &.align-right {
        padding-left: 0;
        margin-left: auto;
      }
    }
  }
}
</style>
